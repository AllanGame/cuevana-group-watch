const cheerio = require('cheerio');
const axios = require('axios');
const FormData = require('form-data')
const puppeteer = require('puppeteer');

const URL = "https://cuevana3.io/episodio/hawkeye-1x1";

scrapping()

async function scrapping() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL)
    await page.waitForFunction('document.querySelector("div#OptL1 > iframe.no-you").getAttribute("src")');
    let nextUrl = await page.evaluate('document.querySelector("div#OptL1 > iframe.no-you").getAttribute("src")')
    console.log(nextUrl);
  } catch (error) {
    console.log({error});
  }
}
