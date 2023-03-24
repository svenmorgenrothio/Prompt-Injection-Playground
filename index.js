const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const app = express();
const port = 3000;

// Either create a .env file with the OPENAI_API_KEY variable or set an environment variable
require("dotenv").config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
	res.send('Ok')
});

app.listen(port, '0.0.0.0');