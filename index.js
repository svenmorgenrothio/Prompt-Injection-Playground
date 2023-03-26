const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const {
	prePrompt,
	classifierPrePrompt,
	classifierModerationPrompt
} = require('./prompts.js');
require("dotenv").config();

const port = 3000;
const app = express();
app.use('/', express.static('public'));
app.use(bodyParser.json());


if (!process.env.OPENAI_API_KEY) {
	console.error("Please set the OPENAI_API_KEY environment variable");
	process.exit(1);
}
// Either create a .env file with the OPENAI_API_KEY variable or set an environment variable
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.post('/api/v1.0/pre-prompt', (req, res) => {
	const prompt = req.body.input;
	const completion = openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: prePrompt },
			{ role: "user", content: prompt }
		]
	})
	completion.then((data) => {
		console.log(data)
		console.log(data.data?.choices?.[0]?.message?.content)
		res.json({ status: 'success', message: data.data?.choices?.[0]?.message?.content });
	}).catch((err) => {
		console.error(err)
		console.log(`${prePrompt}${prompt}`)
		res.json({ status: 'error', message: err });
	})
})

app.post('/api/v1.0/classifier', (req, res) => {
	const moderationResponses = [
		"I can not answer this question because it is not related to healthy eating.",
		"Please try to stay on topic. I am here to answer questions about healthy eating.",
		"I am not sure what you are asking me. I am here to answer questions about healthy eating.",
		"This question does not seem to be related to healthy eating. Please try again.",
		"It seems like you are trying to ask me a question that is not related to healthy eating. I am unable to give you an answer.",
	];
	const prompt = req.body.input;
	const classification = openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: classifierModerationPrompt },
			{ role: "assistant", content: "true" },
			{ role: "user", content: `The text: ${prompt}` }
		]
	})
	classification.then((data) => {
		const response = data.data?.choices?.[0]?.message?.content;
		console.log(response)
		switch (response) {
			case "true":
				const completion = openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: [
						{ role: "system", content: classifierPrePrompt },
						{ role: "user", content: prompt }
					]
				});
				completion.then((data) => {
					console.log(data)
					console.log(data.data?.choices?.[0]?.message?.content)
					res.json({ status: 'success', message: data.data?.choices?.[0]?.message?.content });
				}).catch((err) => {
					console.error(err)
					console.log(`${prePrompt}${prompt}`)
					res.json({ status: 'error', message: err });
				})
				break;
			case "false":
				res.json({ status: 'success', message: moderationResponses[Math.floor(Math.random() * moderationResponses.length)] });
				break;
			default:
				res.json({ status: 'error', message: { stack: "Text classifier gave unexpected output." } });
		}

	}).catch((err) => {
		console.error(err)
		console.log(`${prePrompt}${prompt}`)
		res.json({ status: 'error', message: err });
	})
});


// debug
/*
app.post('/api/v1.0/testprompt', (req, res) => {
	res.json({ status: 'success', message: req.body.input });
});
*/
app.listen(port, '0.0.0.0');