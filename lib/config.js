import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, '..', '.web-scraper-config.json');

async function setApiKeys() {
  try {
    await fs.access(CONFIG_FILE);
    console.log('API keys already set.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      try {
        const { openaiKey, geminiKey, groqKey } = await inquirer.prompt([
          {
            type: 'password',
            name: 'openaiKey',
            message: 'Enter your OpenAI API key:',
            mask: '*',
          },
          {
            type: 'password',
            name: 'geminiKey',
            message: 'Enter your Gemini API key:',
            mask: '*',
          },
          {
            type: 'password',
            name: 'groqKey',
            message: 'Enter your Groq API key:',
            mask: '*',
          },
        ]);

        await fs.writeFile(CONFIG_FILE, JSON.stringify({ openaiKey, geminiKey, groqKey }));
        console.log('API keys saved successfully.');
      } catch (innerError) {
        console.error('Failed to save API keys:', innerError.message);
        console.error('Please check your file system permissions and try again.');
      }
    } else {
      console.error('Failed to access configuration file:', error.message);
      console.error('Please ensure the file path is correct and try again.');
    }
  }
}

async function getApiKeys() {
  try {
    const config = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(config);
  } catch (error) {
    console.error('Failed to read API keys:', error.message);
    if (error.code === 'ENOENT') {
      throw new Error('Configuration file not found. Please run the setup to create it.');
    } else if (error.name === 'SyntaxError') {
      throw new Error('Configuration file is corrupted. Please delete it and run the setup again.');
    } else {
      throw new Error('An unknown error occurred while reading the configuration file.');
    }
  }
}

async function chooseApi() {
  try {
    const apiKeys = await getApiKeys();

    const { chosenApi } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chosenApi',
        message: 'Which API do you want to use?',
        choices: [
          { name: 'OpenAI', value: 'openaiKey' },
          { name: 'Gemini', value: 'geminiKey' },
          { name: 'Groq', value: 'groqKey' },
        ],
      },
    ]);

    const apiKey = apiKeys[chosenApi];
    if (!apiKey) {
      throw new Error(`API key for ${chosenApi.replace('Key', '')} is not set.`);
    }

    console.log(`You have chosen to use the ${chosenApi.replace('Key', '')} API.`);
    return apiKey;
  } catch (error) {
    console.error('Error selecting API:', error.message);
    if (error.message.includes('API key for')) {
      console.error('Please ensure that the API key is correctly set in the configuration file.');
    } else {
      console.error('An unknown error occurred. Please try again.');
    }
    throw error;
  }
}

export { setApiKeys, getApiKeys, chooseApi };