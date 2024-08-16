#!/bin/bash

# Define the path to your project
PROJECT_DIR="$(dirname "$0")"

# Navigate to the project directory
cd "$PROJECT_DIR" || { echo "Failed to navigate to project directory"; exit 1; }

# Ensure dependencies are installed
echo "Installing dependencies..."
npm install || { echo "Failed to install dependencies"; exit 1; }

# Check if API keys are already set
if [ ! -f ".web-scraper-config.json" ]; then
  echo "API keys not found. Setting up API keys..."
  node -e '
    const { setApiKeys } = require("./lib/config.js");
    setApiKeys().catch(err => {
      console.error("Failed to set API keys:", err.message);
      process.exit(1);
    });
  '
else
  echo "API keys already set."
fi

# Test scraping and chatbot interaction
echo "Running the scraper and chatbot..."
node -e '
(async () => {
  const { scrapeWebsite } = require("./lib/scraper.js");
  const { startChatbot } = require("./lib/chatbot.js");

  // Mock URL for testing
  const testUrl = "https://example.com";

  try {
    // Scrape the website
    const scrapedContent = await scrapeWebsite(testUrl);
    console.log("Scraped content:", scrapedContent.substring(0, 100)); // Display the first 100 characters

    // Start the chatbot with scraped content
    await startChatbot(scrapedContent);
  } catch (err) {
    console.error("Test failed:", err.message);
    process.exit(1);
  }
})();
'

# Clean up (optional)
# echo "Cleaning up..."
# rm -f .web-scraper-config.json

echo "Test completed successfully."