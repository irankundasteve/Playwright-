import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function scrapeSubreddit(subreddit: string) {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log(`Scraping r/${subreddit}...`);
  
  try {
    const url = `https://old.reddit.com/r/${subreddit}/new/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const pageTitle = await page.title();
    console.log(`Page title for r/${subreddit}: ${pageTitle}`);

    if (pageTitle.includes('Forbidden') || pageTitle.includes('Verify') || pageTitle.includes('Blocked')) {
      console.warn(`Access restricted for r/${subreddit}. Title: ${pageTitle}`);
    }

    const postLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a.title');
      return Array.from(links)
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href && href.includes('/comments/'))
        .slice(0, 25);
    });

    console.log(`Found ${postLinks.length} posts in r/${subreddit}. Scraping details...`);

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
            .filter(Boolean)
            .slice(0, 20); // Limit comments per post to keep file size manageable but large
          
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
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`Failed to scrape post ${link}:`, e);
      }
    }

    await browser.close();
    return results;
  } catch (error) {
    console.error(`Scrape failed for r/${subreddit}:`, error);
    await browser.close();
    return [];
  }
}

async function main() {
  const subreddits = [
    'entrepreneur', 'saas', 'business', 'marketing', 'startups', 
    'technology', 'artificialintelligence', 'futureology', 'sustainability',
    'fintech', 'ecommerce', 'contentcreation', 'crypto', 'healthtech',
    'remotework', 'cybersecurity', 'edtech', 'proptech', 'agritech',
    'biotech', 'space', 'quantumcomputing', 'renewableenergy', 'robotics'
  ];
  const allData = [];

  console.log(`Starting massive subreddit scrape for ${subreddits.length} communities...`);

  for (const sub of subreddits) {
    const data = await scrapeSubreddit(sub);
    if (data.length > 0) {
      allData.push(...data.map(item => ({ ...item, subreddit: sub })));
      console.log(`Successfully added ${data.length} items from r/${sub}. Total items: ${allData.length}`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
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
