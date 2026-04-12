# TrendPulse AI - Market Intelligence Platform

A full-stack market intelligence platform that scrapes public data, analyzes it with Gemini AI, and visualizes insights.

## Features
- **Daily Scraper**: Uses Playwright to collect data from Reddit and other sources.
- **Automated Storage**: Saves raw data directly to your GitHub repository as `raw_data.json`.
- **Interactive Dashboard**: Visualizes market trends, audience sentiment, and buying signals.

## Setup Instructions

### 1. GitHub Configuration
The scraper runs automatically via GitHub Actions.
- Ensure the GitHub Action has **Read and Write permissions** (Settings > Actions > General > Workflow permissions).
- The scraper runs daily at 00:00 UTC and commits `raw_data.json` back to the repo.

### 2. Local Development
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Run a manual scrape: `npm run scrape`

### 3. Deployment
The app is ready for deployment to Cloud Run or any static hosting provider. The automation runs independently via GitHub Actions.

## Project Structure
- `scripts/scraper.ts`: Playwright scraping logic.
- `src/App.tsx`: Main dashboard UI.
- `.github/workflows/scrape.yml`: Automation pipeline.
