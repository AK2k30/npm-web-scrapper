#!/usr/bin/env node

require('dotenv').config(); 
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const fs = require('fs');
const crypto = require('crypto');
const cheerio = require('cheerio');
const Groq = require("groq-sdk");
const path = require('path');

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function checkAndStoreGroqApiKey() {
    let apiKey = process.env.GROQ_API_KEY;
  
    if (!apiKey) {
      console.log("GROQ API key not found. Please enter your GROQ API key.");
      apiKey = readlineSync.question('Enter your GROQ API key: ');
  
      if (!fs.existsSync('.env')) {
        fs.writeFileSync('.env', `GROQ_API_KEY=${apiKey}\n`);
        console.log(".env file created and GROQ API key stored.");
      } else {
        fs.appendFileSync('.env', `GROQ_API_KEY=${apiKey}\n`);
        console.log("GROQ API key stored in existing .env file.");
      }
  
      require('dotenv').config();  // Reload environment variables
    }
  
    return new Groq({ apiKey });
  }
  
  const groq = checkAndStoreGroqApiKey();
  
  

async function autoScrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  const content = await page.content();
  const $ = cheerio.load(content);
  
  const scrapedData = {
    title: $('title').text(),
    headings: $('h1, h2, h3').map((_, el) => $(el).text()).get(),
    paragraphs: $('p').map((_, el) => $(el).text()).get(),
    links: $('a').map((_, el) => ({ 
      text: $(el).text(), 
      href: $(el).attr('href') 
    })).get(),
    images: $('img').map((_, el) => ({ 
      alt: $(el).attr('alt'), 
      src: $(el).attr('src') 
    })).get()
  };

  await browser.close();
  return scrapedData;
}

async function scrapeWebsite(url, classNames, titles) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a viewport size
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Increase the timeout and wait until the network is idle
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 6000000 });

    const result = {};

    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];
      const title = titles[i];

      // Scrape data based on the class name
      const data = await page.$$eval(`.${className}`, elements =>
        elements.map(el => el.innerText.trim())
      );

      result[title] = data;
    }

    await browser.close();
    return result;
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    await browser.close();
    throw error;
  }
}

function generateRandomFileName(extension = 'json') {
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `scraped_data_${randomBytes}.${extension}`;
}

async function getGroqChatCompletion(messages) {
    try {
      return await groq.chat.completions.create({
        messages: messages,
        model: "llama3-8b-8192",
      });
    } catch (error) {
      throw new Error("Failed to get AI response from Groq API. Please check your API key or try again later.");
    }
  }
  
  // New function to chunk data into manageable sizes
  function chunkData(data, size) {
    const chunks = [];
    let index = 0;
  
    while (index < data.length) {
      chunks.push(data.slice(index, index + size));
      index += size;
    }
  
    return chunks;
  }
  
  // New function to list JSON files in the root directory
  function listJsonFiles() {
    return fs.readdirSync('./').filter(file => path.extname(file) === '.json');
  }
  
  // New function to extract specific parts of JSON
  function extractJsonPart(jsonData, part) {
    const lowerPart = part.toLowerCase();
    const extracted = [];
  
    function recurse(obj) {
      if (typeof obj !== 'object' || obj === null) return;
  
      for (const key in obj) {
        if (key.toLowerCase().includes(lowerPart)) {
          extracted.push(obj[key]);
        }
        if (typeof obj[key] === 'object') {
          recurse(obj[key]);
        }
      }
    }
  
    recurse(jsonData);
    return extracted.length ? extracted : null;
  }
  
  async function chatbot(jsonFileName) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFileName, 'utf-8'));
    
    console.log("AI Assistant: Hello! I'm ready to answer questions about the scraped data. Type 'exit' to end the conversation.");
  
    while (true) {
      const userQuestion = readlineSync.question("You: ");
      if (userQuestion.toLowerCase() === 'exit') break;
  
      // Detect commands like /title or /paragraph
      const match = userQuestion.match(/^\/(\w+)/);
      let context;
  
      if (match) {
        const part = match[1];
        const extracted = extractJsonPart(jsonData, part);
        if (extracted) {
          context = JSON.stringify(extracted);
        } else {
          console.log("AI Assistant: Sorry, I couldn't find that part in the data.");
          continue;
        }
      } else {
        context = JSON.stringify(jsonData);
      }
  
      const messages = [
        { role: "system", content: `You are an AI assistant answering questions based on the following JSON data: ${context}. Only answer questions related to this data. If the question is not related or the answer is not in the data, politely say so.` },
        { role: "user", content: userQuestion }
      ];
  
      try {
        const chatCompletion = await getGroqChatCompletion(messages);
        const answer = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        console.log("AI Assistant:", answer);
      } catch (error) {
        console.error("Error getting AI response:", error.message);
        console.log("AI Assistant: I'm sorry, I encountered an error while processing your question. Please try again.");
      }
    }
  }
  
  async function main() {
    console.log('Welcome to the Web Scraping and AI Q&A Chatbot CLI!');
  
    const url = readlineSync.question('Please enter the URL of the website: ');
  
    console.log('Choose scraping method:');
    console.log('1. Automatic scraping');
    console.log('2. Custom class-based scraping');
    const choice = readlineSync.question('Enter your choice (1 or 2): ');
  
    let data;
    let fileName;
  
    if (choice === '1') {
      console.log('Performing automatic scraping...');
      try {
        data = await autoScrape(url);
      } catch (error) {
        console.error("Error during automatic scraping:", error.message);
        return;
      }
    } else if (choice === '2') {
      const classNames = [];
      const titles = [];
  
      while (true) {
        const className = readlineSync.question('Enter a class name to scrape (or type "finish" to end): ');
        if (className.toLowerCase() === 'finish') break;
  
        const title = readlineSync.question('Enter the title you want to assign to this data in JSON: ');
  
        classNames.push(className);
        titles.push(title);
      }
  
      console.log('Scraping data...');
      try {
        data = await scrapeWebsite(url, classNames, titles);
      } catch (error) {
        console.error("Error during custom class-based scraping:", error.message);
        return;
      }
    } else {
      console.log('Invalid choice. Exiting...');
      return;
    }
  
    try {
      fileName = generateRandomFileName();
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
      console.log(`Data successfully scraped and saved to ${fileName}`);
    } catch (error) {
      console.error('Failed to save scraped data:', error.message);
      return;
    }
  
    console.log('Checking for existing JSON files in the root directory...');
    const jsonFiles = listJsonFiles();
  
    if (jsonFiles.length === 0) {
      console.log('No JSON files found in the root directory. Exiting...');
      return;
    }
  
    console.log('Available JSON files:');
    jsonFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
  
    const selectedFileIndex = readlineSync.question('Select a JSON file by number: ');
  
    const selectedFile = jsonFiles[selectedFileIndex - 1];
  
    if (!selectedFile) {
      console.log('Invalid selection. Exiting...');
      return;
    }
  
    console.log(`You selected: ${selectedFile}`);
  
    console.log('Do you want to start the Q&A chatbot with the selected JSON file?');
    const startChatbot = readlineSync.question('Enter "yes" to start or any other key to exit: ');
  
    if (startChatbot.toLowerCase() === 'yes') {
      await chatbot(selectedFile);
    }
  
    console.log('Goodbye!');
  }
  
  main();
  