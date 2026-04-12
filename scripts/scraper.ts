import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function scrapeReddit(keyword: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Scraping Reddit for: ${keyword}...`);
  
  // Navigate to Reddit search
  await page.goto(`https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}&type=link&t=day`);
  
  // Wait for results
  await page.waitForTimeout(5000);

  const results = await page.evaluate(() => {
    const posts = document.querySelectorAll('post-consume-tracker');
    return Array.from(posts).map(post => {
      const titleElement = post.querySelector('a[slot="title"]');
      const contentElement = post.querySelector('div[slot="text-body"]');
      return {
        title: titleElement?.textContent?.trim() || '',
        url: (titleElement as HTMLAnchorElement)?.href || '',
        content: contentElement?.textContent?.trim() || '',
        timestamp: new Date().toISOString()
      };
    });
  });

  await browser.close();
  return results;
}

async function main() {
  const keywords = ['sustainable packaging', 'AI assistant', 'saas ideas'];
  const allData = [];

  for (const keyword of keywords) {
    try {
      const data = await scrapeReddit(keyword);
      allData.push(...data.map(item => ({ ...item, keyword })));
    } catch (error) {
      console.error(`Error scraping ${keyword}:`, error);
    }
  }

  const outputPath = path.join(process.cwd(), 'raw_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`Scraping complete. Saved ${allData.length} items to ${outputPath}`);
}

main().catch(console.error);
