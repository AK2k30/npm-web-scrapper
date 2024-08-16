import inquirer from 'inquirer';
import chalk from 'chalk';
import { OpenAI } from 'openai';
import Groq from 'groq-sdk';
import { getApiKeys, chooseApi } from './config.js';

async function startChatbot(scrapedContent) {
  const apiKeys = await getApiKeys();
  const chosenApi = await chooseApi();

  let openai, groq;

  // Initialize API clients based on user choice
  try {
    if (chosenApi === 'openaiKey') {
      openai = new OpenAI({ apiKey: apiKeys.openaiKey });
    } else if (chosenApi === 'groqKey') {
      groq = new Groq({ apiKey: apiKeys.groqKey });
    } else {
      throw new Error('Invalid API selection.');
    }
  } catch (error) {
    console.error(chalk.red('Initialization Error:'), error.message);
    return;
  }

  console.log(chalk.blue('Chatbot: Ask me anything about the scraped content. Type "esc" to exit.'));

  while (true) {
    const { userInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userInput',
        message: 'You:',
      },
    ]);

    if (userInput.toLowerCase() === 'esc') {
      console.log(chalk.blue('Chatbot: Goodbye!'));
      break;
    }

    try {
      let response;

      if (chosenApi === 'groqKey') {
        response = await getGroqChatCompletion(groq, scrapedContent, userInput);
        console.log(chalk.blue(`Chatbot (Groq): ${response}`));
      } else if (chosenApi === 'openaiKey') {
        response = await getOpenAIChatCompletion(openai, scrapedContent, userInput);
        console.log(chalk.blue(`Chatbot (OpenAI): ${response}`));
      }
    } catch (error) {
      handleApiError(error);
    }
  }
}

async function getOpenAIChatCompletion(openai, scrapedContent, userInput) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant analyzing scraped web content.' },
        { role: 'user', content: `Scraped content: ${scrapedContent}\n\nUser question: ${userInput}` }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

async function getGroqChatCompletion(groq, scrapedContent, userInput) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant analyzing scraped web content.' },
        { role: 'user', content: `Scraped content: ${scrapedContent}\n\nUser question: ${userInput}` }
      ],
      model: 'llama3-8b-8192',
    });
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    throw new Error(`Groq API Error: ${error.message}`);
  }
}

function handleApiError(error) {
  // Detailed error handling
  if (error.response) {
    // API responded with an error
    console.error(chalk.red(`API Error - Status Code: ${error.response.status}`));
    console.error(chalk.red(`API Error - Response Headers: ${JSON.stringify(error.response.headers)}`));
    console.error(chalk.red(`API Error - Response Body: ${error.response.data}`));
  } else if (error.request) {
    // No response from the API
    console.error(chalk.red('No response from the API.'));
    console.error(chalk.red(`Request Details: ${error.request}`));
  } else {
    // Other errors
    console.error(chalk.red(`Unexpected Error: ${error.message}`));
  }
}

export { startChatbot };
