# TrendPulse AI - Market Intelligence Platform

A full-stack market intelligence platform that scrapes public data, analyzes it with Gemini AI, and visualizes insights.

## Features
- **Daily Scraper**: Uses Python and Selenium to search DuckDuckGo for the latest tech news.
- **Deep Crawling**: Automatically visits top news sites to extract article content.
- **Automated Storage**: Saves raw data directly to your GitHub repository as `raw_data.json`.
- **Interactive Dashboard**: Visualizes market trends, audience sentiment, and buying signals.

## Setup Instructions

### 1. GitHub Configuration
The scraper runs automatically via GitHub Actions.
- **Workflow Permissions**: Ensure the GitHub Action has **Read and Write permissions**. 
    - Go to **Settings > Actions > General**.
    - Scroll down to **Workflow permissions**.
    - Select **"Read and write permissions"** and click **Save**.
- The scraper runs daily at 00:00 UTC, searches for tech news, and commits `raw_data.json` back to the repo.

### 2. Local Development
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Run a manual scrape: `npm run scrape`

### 3. Deployment
The app is ready for deployment to Cloud Run or any static hosting provider. The automation runs independently via GitHub Actions.

## Project Structure
- `scripts/scraper.py`: Python Selenium scraping logic.
- `src/App.tsx`: Main dashboard UI.
- `.github/workflows/scrape.yml`: Automation pipeline.
