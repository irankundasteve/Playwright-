import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

chromium.use(stealth());

async function scrapeNews(query: string) {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log(`Searching DuckDuckGo for: ${query}...`);
  
  try {
    // Search DuckDuckGo (HTML version for easier scraping)
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const articleLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('.result__a');
      return Array.from(links)
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => !href.includes('duckduckgo.com'))
        .slice(0, 15);
    });

    console.log(`Found ${articleLinks.length} news articles. Crawling content...`);

    const results = [];
    for (const link of articleLinks) {
      try {
        console.log(`Crawling: ${link}`);
        const articlePage = await context.newPage();
        // Set a shorter timeout for individual articles to keep the process moving
        await articlePage.goto(link, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        const articleData = await articlePage.evaluate(() => {
          // Basic heuristic to find main content
          const title = document.title || '';
          
          // Remove noise
          const scripts = document.querySelectorAll('script, style, nav, footer, header, iframe');
          scripts.forEach(s => s.remove());

          // Get text from common content containers
          const contentSelectors = ['article', 'main', '.content', '.post-content', '.article-body', '#content'];
          let bodyText = '';
          
          for (const selector of contentSelectors) {
            const el = document.querySelector(selector);
            if (el) {
              bodyText = el.textContent?.trim() || '';
              if (bodyText.length > 500) break;
            }
          }

          // Fallback to body if no specific container found
          if (bodyText.length < 500) {
            bodyText = document.body.textContent?.trim() || '';
          }

          return {
            title,
            url: window.location.href,
            content: bodyText.slice(0, 5000), // Limit to 5000 chars per article
            timestamp: new Date().toISOString()
          };
        });

        if (articleData.content.length > 200) {
          results.push(articleData);
          console.log(`Successfully crawled: ${articleData.title.slice(0, 50)}...`);
        }
        
        await articlePage.close();
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
        console.error(`Failed to crawl ${link}:`, e);
      }
    }

    await browser.close();
    return results;
  } catch (error) {
    console.error(`Search failed for "${query}":`, error);
    await browser.close();
    return [];
  }
}

async function main() {
  const queries = [
    'latest tech news 2024',
    'emerging technology trends business',
    'artificial intelligence breakthroughs news',
    'sustainable tech innovations 2024',
    'future of ecommerce news',
    'saas industry reports 2024'
  ];
  const allData = [];

  console.log(`Starting news crawl for ${queries.length} search queries...`);

  for (const query of queries) {
    const data = await scrapeNews(query);
    if (data.length > 0) {
      allData.push(...data.map(item => ({ ...item, query })));
      console.log(`Added ${data.length} articles for query: "${query}". Total: ${allData.length}`);
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
