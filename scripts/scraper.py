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
        article_links = [link.get_attribute("href") for link in links if "duckduckgo.com" not in link.get_attribute("href")][:30]
        
        if not article_links:
            print(f"No links found on DuckDuckGo for '{query}'. Page title: {driver.title}")
            # Fallback to Hacker News for general tech news if search fails
            if any(k in query.lower() for k in ["tech", "ai", "innovation", "science", "future"]):
                print("Falling back to Hacker News...")
                driver.get("https://news.ycombinator.com/")
                hn_links = driver.find_elements(By.CSS_SELECTOR, ".titleline > a")
                article_links = [link.get_attribute("href") for link in hn_links][:40]
        
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
    # Massive multi-domain query list expanded to hundreds of topics
    base_queries = [
        "latest tech news 2024", "artificial intelligence breakthroughs", "quantum computing progress",
        "cybersecurity threats 2024", "robotics and automation trends", "web3 utility cases",
        "global market trends 2024", "fintech innovation reports", "cryptocurrency regulation news",
        "central bank digital currencies", "inflation impact on tech startups", "venture capital trends 2024",
        "biotech breakthroughs 2024", "healthtech innovation news", "genomic medicine progress",
        "climate change technology solutions", "renewable energy breakthroughs", "space exploration news",
        "future of ecommerce 2024", "saas industry growth reports", "supply chain automation news",
        "creator economy platforms 2024", "remote work culture trends", "proptech innovation news",
        "agritech and vertical farming", "edtech and future of learning", "autonomous vehicle progress",
        "metaverse enterprise use cases", "green hydrogen technology", "fusion energy milestones",
        "semiconductor industry news", "edge computing applications", "5G and 6G development",
        "digital twin technology", "neuromorphic computing", "nanotechnology in medicine",
        "circular economy business models", "carbon capture and storage", "blue economy trends",
        "precision medicine startups", "personalized nutrition tech", "mental health apps market",
        "insurtech innovation", "regtech compliance tools", "wealthtech for retail investors",
        "direct-to-consumer brand strategies", "social commerce growth", "omnichannel retail tech",
        "low-code no-code platform trends", "cloud native architecture", "devops automation tools",
        "gig economy worker rights", "future of urban mobility", "smart city infrastructure",
        "vertical takeoff and landing aircraft", "hyperloop development status", "solid state batteries",
        "hydrogen fuel cell vehicles", "microgrid technology", "tidal and wave energy",
        "synthetic biology applications", "lab grown meat industry", "regenerative agriculture",
        "commercial space stations", "asteroid mining feasibility", "satellite internet constellations",
        "ethical AI frameworks", "data privacy regulations 2024", "algorithmic bias solutions",
        "virtual reality in education", "augmented reality for retail", "mixed reality workplace",
        "gamification in business", "esports industry growth", "digital fashion and NFTs",
        "quantum cryptography", "zero trust security model", "biometric authentication trends",
        "predictive maintenance in manufacturing", "industrial internet of things", "cobots in logistics",
        "telemedicine adoption rates", "wearable health monitors", "AI in drug discovery",
        "impact investing trends", "ESG reporting standards", "sustainable supply chain",
        "micro-fulfillment centers", "last mile delivery drones", "dark stores and ghost kitchens",
        "subscription box market", "recommerce and second-hand market", "luxury brand digital strategy",
        "work-from-anywhere policies", "four-day work week trials", "employee well-being tech",
        "online tutoring platforms", "micro-learning and skill-based hiring", "LMS market trends",
        "real estate tokenization", "smart home automation", "co-living and co-working spaces",
        "hydroponics and aquaponics", "soil health monitoring tech", "livestock tracking IoT",
        "CRISPR and gene editing", "longevity and anti-aging research", "microbiome therapeutics",
        "deep sea exploration tech", "ocean plastic cleanup solutions", "water desalination tech",
        "modular construction", "3D printed houses", "smart building materials",
        "autonomous shipping", "electric planes development", "maglev train projects",
        "decentralized finance (DeFi) protocols", "stablecoin market share", "NFT utility in gaming",
        "governance tokens and DAOs", "layer 2 scaling solutions", "cross-chain interoperability",
        "generative AI for marketing", "AI video generation tools", "natural language processing news",
        "computer vision in retail", "reinforcement learning use cases", "AI hardware and chips",
        "open source software sustainability", "API economy and integration", "serverless computing",
        "containerization and kubernetes", "observability and monitoring", "site reliability engineering",
        "influencer marketing ROI", "short-form video trends", "podcast industry monetization",
        "community-led growth", "product-led growth strategies", "customer success tech",
        "B2B marketplace growth", "procurement software trends", "ERP modernization",
        "HR tech and talent acquisition", "payroll and benefits automation", "diversity and inclusion tech",
        "legaltech and contract automation", "e-discovery and litigation support", "intellectual property tech",
        "non-profit and social impact tech", "civic tech and open government", "voting technology news",
        "disaster response and relief tech", "public safety and surveillance tech", "smart grid security",
        "nuclear small modular reactors", "geothermal energy expansion", "bioenergy with carbon capture",
        "plastic recycling technology", "waste-to-energy plants", "textile recycling innovation",
        "sustainable aviation fuel", "green shipping corridors", "rail freight modernization",
        "indoor air quality tech", "smart lighting and HVAC", "energy management systems",
        "vertical farming profitability", "insect protein industry", "alternative dairy market",
        "personalized medicine for cancer", "liquid biopsy technology", "mRNA vaccine platform",
        "brain-computer interfaces", "exoskeletons for rehabilitation", "3D bioprinting of organs",
        "digital therapeutics", "remote patient monitoring", "AI in medical imaging",
        "impact of AI on job market", "universal basic income pilots", "future of unions",
        "skills gap and reskilling", "vocational training tech", "lifelong learning platforms",
        "digital nomad visas", "van life and mobile living", "sustainable tourism tech",
        "space tourism market", "lunar base construction", "mars colonization plans",
        "quantum sensors", "quantum metrology", "quantum networking",
        "post-quantum cryptography", "optical computing", "DNA data storage",
        "soft robotics", "swarm robotics", "humanoid robots in service",
        "AI for weather forecasting", "precision forestry", "wildfire detection tech",
        "illegal fishing tracking", "wildlife conservation drones", "biodiversity monitoring",
        "circular fashion", "slow fashion movement", "upcycling business models",
        "sharing economy for tools", "peer-to-peer energy trading", "community solar projects",
        "micro-mobility in cities", "bike-sharing and scooter-sharing", "pedestrian-centric urban design",
        "smart traffic management", "parking automation tech", "public transit optimization",
        "digital identity and wallets", "self-sovereign identity", "verifiable credentials",
        "biometric payments", "contactless payment trends", "buy now pay later (BNPL) news",
        "open banking adoption", "embedded finance for non-banks", "neobank profitability",
        "AI in wealth management", "robo-advisors for ESG", "fractional ownership of assets",
        "real-time payments", "cross-border payment innovation", "remittance tech",
        "centralized vs decentralized exchanges", "crypto custody for institutions", "bitcoin mining energy use",
        "ethereum staking and yield", "solana ecosystem growth", "polkadot and parachains",
        "metaverse for training", "virtual events and conferences", "digital twins of cities",
        "holographic displays", "spatial audio technology", "haptic feedback devices",
        "AI for accessibility", "assistive technology for elderly", "neurodiversity in tech",
        "ethical sourcing and fair trade", "transparency in supply chains", "conflict minerals tracking",
        "corporate social responsibility (CSR) tech", "philanthropy automation", "volunteer management platforms"
    ]
    
    # Shuffle or repeat to ensure we have enough work for 5 hours
    import random
    queries = base_queries * 2 # Double the list just in case
    random.shuffle(queries)
    
    total_data = []
    print(f"Starting EXTREME news crawl for {len(queries)} domains. Target duration: 5+ hours.")
    
    driver = get_driver()
    start_time = time.time()
    
    try:
        for i, query in enumerate(queries):
            # Check if we've been running for too long (safety check at 5.5 hours)
            elapsed = (time.time() - start_time) / 3600
            if elapsed > 5.5:
                print("Approaching 6-hour GitHub Action limit. Saving progress and exiting.")
                break
                
            print(f"[{i+1}/{len(queries)}] Processing domain: {query} (Elapsed: {elapsed:.2f}h)")
            data = scrape_news(driver, query)
            total_data.extend(data)
            
            # Save intermediate progress every 5 queries
            if (i + 1) % 5 == 0:
                temp_path = os.path.join(os.getcwd(), "raw_data.json")
                with open(temp_path, "w", encoding="utf-8") as f:
                    json.dump(total_data, f, indent=2, ensure_ascii=False)
                print(f"Checkpoint saved. Total items: {len(total_data)}")
                
            # Random delay to look more human and fill time
            time.sleep(random.uniform(5, 15))
    finally:
        driver.quit()
        
    output_path = os.path.join(os.getcwd(), "raw_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(total_data, f, indent=2, ensure_ascii=False)
        
    file_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Scraping complete. Saved {len(total_data)} items to {output_path} ({file_size:.2f} MB)")

if __name__ == "__main__":
    main()
