import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function scrapeReddit(keyword: string) {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log(`Scraping Reddit for: ${keyword}...`);
  
  try {
    // Using old.reddit.com for better stability and easier parsing
    const searchUrl = `https://old.reddit.com/search/?q=${encodeURIComponent(keyword)}&t=week&sort=relevance`;
    console.log(`Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const currentUrl = page.url();
    if (currentUrl.includes('login')) {
      console.warn('Redirected to login page. Attempting to bypass...');
    }

    // Scroll to ensure content loads (though old reddit doesn't need much)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const postLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a.title');
      return Array.from(links).map(a => (a as HTMLAnchorElement).href).slice(0, 10);
    });

    console.log(`Found ${postLinks.length} post links for "${keyword}". Scraping details and comments...`);

    const results = [];
    for (const link of postLinks) {
      try {
        const postPage = await context.newPage();
        await postPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const postData = await postPage.evaluate(() => {
          const title = document.querySelector('a.title')?.textContent?.trim() || '';
          const body = document.querySelector('div.expando div.md')?.textContent?.trim() || '';
          const comments = Array.from(document.querySelectorAll('div.comment div.md'))
            .map(c => c.textContent?.trim())
            .filter(Boolean);
          
          return {
            title,
            url: window.location.href,
            content: body,
            comments: comments,
            comment_count: comments.length,
            timestamp: new Date().toISOString()
          };
        });

        results.push(postData);
        await postPage.close();
        // Small delay to be polite
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
        console.error(`Failed to scrape post ${link}:`, e);
      }
    }

    await browser.close();
    return results;
  } catch (error) {
    console.error(`Scrape failed for ${keyword}:`, error);
    const bodySnippet = await page.evaluate(() => document.body.innerText.slice(0, 500));
    console.log(`Page body snippet: ${bodySnippet}`);
    await browser.close();
    return [];
  }
}

async function main() {
  const keywords = [
    'sustainable packaging', 'AI assistant', 'saas ideas', 'market trends 2024',
    'consumer behavior', 'future of work', 'climate tech', 'fintech innovation',
    'ecommerce growth', 'creator economy', 'web3 utility', 'healthtech',
    'remote work tools', 'cybersecurity trends', 'edtech startups', 'proptech',
    'agritech', 'biotech breakthroughs', 'space economy', 'quantum computing',
    'renewable energy', 'electric vehicles', 'autonomous driving', 'robotics'
  ];
  const allData = [];

  console.log(`Starting massive scrape for ${keywords.length} keywords...`);

  for (const keyword of keywords) {
    const data = await scrapeReddit(keyword);
    if (data.length > 0) {
      allData.push(...data.map(item => ({ ...item, keyword })));
      console.log(`Successfully added ${data.length} items for "${keyword}". Total items: ${allData.length}`);
    } else {
      console.warn(`No data collected for keyword: "${keyword}"`);
    }
    // Small delay between keywords to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  const outputPath = path.join(process.cwd(), 'raw_data.json');
  
  if (allData.length === 0) {
    console.error("CRITICAL ERROR: No data was collected across all keywords. The output file will be empty.");
    // Create a dummy entry so the file isn't technically empty if everything fails
    allData.push({
      error: "Scrape failed to collect any real data",
      timestamp: new Date().toISOString(),
      note: "Check bot detection or selectors"
    });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  const stats = fs.statSync(outputPath);
  console.log(`Scraping complete. Saved ${allData.length} items to ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(console.error);
