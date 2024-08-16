import axios from 'axios';
import cheerio from 'cheerio';

async function scrapeWebsite(url, selectors) {
  try {
    // Fetch the webpage
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Initialize an object to store the scraped content
    const scrapedData = {};

    // Iterate over the selectors and extract content based on provided selectors
    for (const [key, selector] of Object.entries(selectors)) {
      scrapedData[key] = [];
      $(selector).each((i, element) => {
        scrapedData[key].push($(element).text().trim());
      });
    }

    return scrapedData;
  } catch (error) {
    // Enhanced error handling with detailed information
    console.error(`Failed to scrape website: ${error.message}`);
    if (error.response) {
      console.error(`Status Code: ${error.response.status}`);
      console.error(`Response Headers: ${JSON.stringify(error.response.headers)}`);
    }
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}
