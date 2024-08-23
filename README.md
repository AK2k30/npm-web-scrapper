# Web-Scrap-AI

**Version:** 1.0.3
**Author:** Akash Singh
**License:** ISC

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Step-by-Step Guide](###Step-by-Step Guide)
4. [Installation](#installation)
5. [Custome Class-Base scraping](#### Custom Class-Based Scraping)
6. [Usage](#usage)
   * [Command-Line Interface (CLI)](#command-line-interface-cli)
7. [How It Works](#how-it-works)
   * [AI Chatbot](#ai-chatbot)
8. [Environment Variables](#environment-variables)
9. [Error Handling](#error-handling)
10. [Docker Support](#docker-support)
11. [Contributing](#contributing)
12. [License](#license)

## Overview

**Web-Scrap-AI** is a powerful command-line tool that combines the capabilities of web scraping and artificial intelligence. It allows users to scrape data from websites using Puppeteer and interact with that data through an AI-powered chatbot. The tool is designed to be intuitive, allowing both automatic and custom class-based scraping, with answers tailored to the specific JSON data scraped from the website.

## Features

* **Docker Support:**
* * Dockerfile provided for easy containerization and deployment.
* **Automatic Web Scraping:** Quickly scrape a website's data using the built-in automatic scraping function.
* **Custom Class-Based Scraping:** Target specific parts of a website by specifying class names and assigning custom titles to the scraped data.
* **AI-Powered Chatbot:** Interact with the scraped data using an AI chatbot that can answer questions based on the data in JSON format.
* **Context-Specific Queries:** Ask the chatbot about specific sections of the scraped data, like titles or paragraphs, using simple commands such as `/title` or `/paragraph`.
* **Environment Configuration:** Easily configure and manage your Groq API key for AI interactions.

### Step-by-Step Guide

1. **Start the CLI:**
   Run the following command in your terminal:
   <pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>Copy code</button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-bash">npm run web-scrap-ai
   </code></div></div></pre>
2. **Enter the Website URL:**
   The CLI will prompt you to enter the URL of the website you want to scrape.
3. **Choose Scraping Method:**
   * **Automatic Scraping:** The tool will automatically scrape the most relevant data from the website.
   * **Custom Class-Based Scraping:** You can specify the class names you want to scrape and assign custom titles to the scraped data.

### Custom Class-Based Scraping

Custom class-based scraping allows you to target specific elements of a website by providing the class names of those elements. This is particularly useful when you want to scrape specific sections of a page, such as product details, reviews, or any other content marked with identifiable class names.

#### How It Class-Based Works

* **Class Names:** You provide the class names of the elements you want to scrape.
* **Titles:** For each class name, you assign a title that will be used in the resulting JSON file to categorize the data.

#### Example

Let's say you want to scrape a website's product names and prices:

* Class name for product names: `.product-title`
* Class name for product prices: `.product-price`
* Assigned titles: `Product Names` and `Product Prices`

During the scraping process, the tool will extract data from elements with these class names and store them under the provided titles in the JSON file.

## Installation

To install  **Web-Scrap-AI** , you can use npm:

```bash
npm install web-scrap-ai
```

This will install the package and automatically set up the required script in your `package.json`.

## Usage

### Command-Line Interface (CLI)

After installation, you can use the `web-scrap-ai` command to start the tool:

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span></span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg></button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-bash">npm run web-scrap-ai
</code></div></div></pre>

## How It Works

### Web Scraping

1. **Automatic Scraping:**
   The tool can automatically scrape data from the provided URL using Puppeteer. It tries to intelligently extract meaningful content from the page.
2. **Custom Class-Based Scraping:**
   Users can manually specify the class names of the HTML elements they want to scrape. The tool will prompt for the class names and the titles to assign to the data in the JSON file.

### AI Chatbot

1. **Initiating the Chatbot:**
   After scraping, the tool can start an AI chatbot that interacts with the scraped data. The chatbot only answers questions related to the scraped JSON data.
2. **Selecting the JSON File:**
   If there are multiple JSON files in the root directory, the user can select which file to use for the chatbot session.
3. **Data-Specific Responses:**
   The AI can automatically detect commands like `/title` or `/paragraph` and respond with information specific to those sections.
4. **Fine-Tuning:**
   The model is fine-tuned during the session to ensure it only answers questions relevant to the selected JSON file.

## Environment Variables

This package requires a Groq API key only if ai model doesn't work or you are not satisfied with the answer, which is stored in a `.env` file. The key is used to access Groq's AI model.

* To set api key enter "api key" when chatbot is running.

### Setting Up the API Key

* If the `.env` file doesn't exist, it will be created automatically when you enter the API key for the first time.
* The API key is stored under the variable name `GROQ_API_KEY`.

## Error Handling

* **Invalid URLs:**
  If the provided URL is invalid, the tool will display an error message and terminate the session.
* **API Errors:**
  If there is an issue with the Groq API, the tool will prompt the user to re-enter the API key.
* **File System Errors:**
  The tool includes error handling for file reading/writing operations. If it cannot access the `package.json` or any other required file, it will display an appropriate error message.

## Docker Support

**Web-Scrap-AI** comes with a Dockerfile to allow easy containerization and deployment. You can build and run the Docker container as follows:

<pre><div class="dark bg-gray-950 rounded-md border-[0.5px] border-token-border-medium"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span></span><div class="flex items-center"><span class="" data-state="closed"><button class="flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg></button></span></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="!whitespace-pre hljs language-bash">docker build -t web-scrap-ai .
docker run -it web-scrap-ai
</code></div></div></pre>

## Contributing

Contributions to **Web-Scrap-AI** are welcome! If you have ideas for new features or improvements, feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License. See the LICENSE file for details.
