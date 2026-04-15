import json
import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def scrape_news(driver, query):
    print(f"Searching for: {query}...")
    
    all_articles = []
    try:
        # Try DuckDuckGo first
        search_url = f"https://duckduckgo.com/html/?q={query.replace(' ', '+')}"
        driver.get(search_url)
        time.sleep(1)
        
        links = driver.find_elements(By.CSS_SELECTOR, ".result__a")
        article_links = [link.get_attribute("href") for link in links if "duckduckgo.com" not in link.get_attribute("href")][:15]
        
        if not article_links:
            print(f"No links found on DuckDuckGo for '{query}'. Page title: {driver.title}")
            # Fallback to Hacker News for general tech news if search fails
            if "tech" in query.lower() or "ai" in query.lower() or "innovation" in query.lower():
                print("Falling back to Hacker News...")
                driver.get("https://news.ycombinator.com/")
                hn_links = driver.find_elements(By.CSS_SELECTOR, ".titleline > a")
                article_links = [link.get_attribute("href") for link in hn_links][:20]
        
        print(f"Found {len(article_links)} links. Starting crawl...")
        
        for link in article_links:
            try:
                print(f"Crawling: {link}")
                driver.get(link)
                time.sleep(2)
                
                title = driver.title
                
                # Heuristic for main content
                body_text = ""
                content_selectors = ["article", "main", ".content", ".post-content", ".article-body", "#content", ".post", ".entry-content", ".body"]
                
                for selector in content_selectors:
                    try:
                        element = driver.find_element(By.CSS_SELECTOR, selector)
                        if element:
                            text = element.text.strip()
                            if len(text) > 500:
                                body_text = text
                                break
                    except:
                        continue
                
                if not body_text:
                    try:
                        body_text = driver.find_element(By.TAG_NAME, "body").text.strip()
                    except:
                        pass
                
                if len(body_text) > 200:
                    all_articles.append({
                        "title": title,
                        "url": link,
                        "content": body_text[:15000],
                        "timestamp": datetime.now().isoformat(),
                        "query": query
                    })
                
            except Exception as e:
                print(f"Failed to crawl {link}: {e}")
                
    except Exception as e:
        print(f"Search failed for {query}: {e}")
        
    return all_articles

def main():
    queries = [
        "latest tech news 2024",
        "emerging technology trends business",
        "artificial intelligence breakthroughs news",
        "sustainable tech innovations 2024",
        "future of ecommerce news",
        "saas industry reports 2024",
        "fintech innovation 2024 trends",
        "cybersecurity threats and solutions 2024",
        "healthtech startups and breakthroughs",
        "renewable energy technology news",
        "space exploration and commercialization news",
        "quantum computing progress 2024",
        "robotics and automation in industry",
        "web3 and blockchain utility cases",
        "remote work culture and tools trends"
    ]
    
    total_data = []
    print(f"Starting optimized news crawl for {len(queries)} search queries...")
    
    driver = get_driver()
    try:
        for query in queries:
            data = scrape_news(driver, query)
            total_data.extend(data)
            print(f"Current total data items: {len(total_data)}")
            time.sleep(1)
    finally:
        driver.quit()
        
    output_path = os.path.join(os.getcwd(), "raw_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(total_data, f, indent=2, ensure_ascii=False)
        
    file_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Scraping complete. Saved {len(total_data)} items to {output_path} ({file_size:.2f} MB)")

if __name__ == "__main__":
    main()
