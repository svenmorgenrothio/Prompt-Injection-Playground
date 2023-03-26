# Prompt Injection Playground
## What is this repository about?
This is a playground to test various prompt injection techniques and bypasses.

## What scenarios are currently supported?
### 1. Simple Pre-Prompt
The chatbot has a set of internal rules that are meant to be extracted or modified. It is instructed to never reveal those rules. 

Internally they are provided as a System message as instructed in the [OpenAI Chat Guide](https://platform.openai.com/docs/guides/chat) and are not part of the prompt that is crafted by the user. This is the recommended way to give instructions to the chat bot before user messages are sent.

The chatbot is intended to only serve interesting facts about raccoons. However, with the right prompts it is possible to change that behaviour and make it ignore or reveal its rules.

### 2. Text Classifier / Secret Pre-Prompt Combination
A request to the chatbot leads to two requests to ChatGPT. The first one contains a pre-prompt turning ChatGPT into a text analyzer. This analyzer will check whether or not the text is about the chatbot's topic. If it is, it will return "true", if not it will return "false". Based on that input it decides whether a second request is sent. If the response is false, it will show a generic error message.

If the response is true, the second request will initialize the actual chat bot and provide it with the user input. The rules and code name are protected and the chat bot will refuse to provide them. It needs to be tricked in order to give them to the user.

## Setup
### Overview

1. Obtain OpenAI API Key
2. Create a .env file in the same folder as index.js
3. Run docker-compose up

### Explanation

The recommended way is to use docker-compose to start the application. **You will first need to get an OpenAI API key.**

Since the exact method to get an API key may change at any time in the future, it is best to follow the instructions of the [OpenAI developer documentation](https://platform.openai.com/docs).

Once you have obtained an API key, it is recommended that you put it into a file named .env in the same directory as the `index.js` file.

```
OPENAI_API_KEY=sk-...
```

Alternatively you can pass it directly as an environment variable. After that you simply run the command below.

```
docker-compose up 
```

Once done the application will be availble on `http://localhost:3000`.

## Warning!
It is not recommended to expose the application over the internet.

## Limitations
As of now the chatbot only receives a single message and does not remember any input you gave it before.

## Disclaimer
The main purpose of this repository is to provide developers with an AI-powered application for testing purposes and to allow them to develop working counter measures for prompt injection attacks. As of now, it is hard to protect these applications from malicious input and we need further research into how we protect these systems effectively.