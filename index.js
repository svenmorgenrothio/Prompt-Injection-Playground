const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const {
	prePrompt
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

// debug
/*
app.post('/api/v1.0/testprompt', (req, res) => {
	res.json({ status: 'success', message: req.body.input });
});
*/
app.listen(port, '0.0.0.0');