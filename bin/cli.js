#!/usr/bin/env node
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { scrapeWebsite } from '../lib/scraper.js';
import { startChatbot } from '../lib/chatbot.js';
import { setApiKeys, getApiKeys } from '../lib/config.js';

async function main() {
  console.log(chalk.green('Welcome to Web Scraper Chatbot!'));

  try {
    // Ensure API keys are set up
    await setApiKeys();

    // Prompt for website URL
    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'Enter the website URL to scrape:',
        validate: (input) => {
          // Simple URL validation
          const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
          return urlRegex.test(input) || 'Please enter a valid URL';
        },
      },
    ]);

    // Scrape the website
    const spinner = ora('Scraping website...').start();
    try {
      const scrapedContent = await scrapeWebsite(url);
      spinner.succeed('Website scraped successfully');
      
      // Start chatbot with scraped content
      await startChatbot(scrapedContent);
    } catch (scrapingError) {
      spinner.fail('Failed to scrape website');
      console.error(chalk.red('Error during website scraping:'), scrapingError.message);
      process.exit(1);
    }
  } catch (setupError) {
    console.error(chalk.red('An error occurred during setup:'), setupError.message);
    console.error('Please ensure your API keys are correctly set up and try again.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red('An unexpected error occurred:'), error.message);
  process.exit(1);
});
