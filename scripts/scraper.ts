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
    // Navigate to Reddit search with a longer timeout
    await page.goto(`https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}&type=link&t=week`, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Check for "Verify you are human" or blocking
    const content = await page.content();
    if (content.includes('Verify you are human') || content.includes('blocked')) {
      console.warn('Bot detection triggered. Attempting to proceed anyway...');
    }

    // Scroll multiple times to load more content
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(1500);
    }

    const results = await page.evaluate(() => {
      // Try multiple selectors as Reddit A/B tests UI frequently
      const posts = document.querySelectorAll('shreddit-post, article, [data-testid="post-container"], .Post');
      
      return Array.from(posts).map(post => {
        // Attempt to find title and content in various structures
        const titleElement = post.querySelector('a[slot="title"], h3, [data-adclicklocation="title"]');
        const contentElement = post.querySelector('div[slot="text-body"], [data-click-id="text"], .rich-text-section');
        const linkElement = post.querySelector('a[href*="/r/"]');

        return {
          title: titleElement?.textContent?.trim() || 'No Title',
          url: (linkElement as HTMLAnchorElement)?.href || '',
          content: contentElement?.textContent?.trim() || '',
          timestamp: new Date().toISOString(),
          raw_html_length: post.innerHTML.length // Adding bulk for data volume
        };
      }).filter(p => p.url !== '');
    });

    console.log(`Found ${results.length} posts for "${keyword}"`);
    await browser.close();
    return results;
  } catch (error) {
    console.error(`Scrape failed for ${keyword}:`, error);
    await browser.close();
    return [];
  }
}

async function main() {
  const keywords = [
    'sustainable packaging', 'AI assistant', 'saas ideas', 'market trends 2024',
    'consumer behavior', 'future of work', 'climate tech', 'fintech innovation',
    'ecommerce growth', 'creator economy', 'web3 utility', 'healthtech'
  ];
  const allData = [];

  for (const keyword of keywords) {
    const data = await scrapeReddit(keyword);
    allData.push(...data.map(item => ({ ...item, keyword })));
    // Small delay between keywords to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const outputPath = path.join(process.cwd(), 'raw_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`Scraping complete. Saved ${allData.length} items to ${outputPath}`);
}

main().catch(console.error);
