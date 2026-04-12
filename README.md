# TrendPulse AI - Market Intelligence Platform

A full-stack market intelligence platform that scrapes public data, analyzes it with Gemini AI, and visualizes insights.

## Features
- **Daily Scraper**: Uses Playwright to collect data from Reddit and other sources.
- **AI Processor**: Uses Gemini 1.5 Flash to transform raw data into trends, buying signals, and predictions.
- **HuggingFace Integration**: Automatically archives raw and processed data to HuggingFace Datasets.
- **Interactive Dashboard**: Visualizes market trends, audience sentiment, and buying signals.

## Setup Instructions

### 1. GitHub Secrets
To enable the daily automation, add the following secrets to your GitHub repository:
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `HF_TOKEN`: Your HuggingFace Write Token.
- `HF_REPO`: Your HuggingFace dataset repository (e.g., `username/dataset-name`).

### 2. Local Development
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Run a manual scrape: `npm run scrape`
4. Process data: `npx tsx scripts/processor.ts`

### 3. Deployment
The app is ready for deployment to Cloud Run or any static hosting provider. The automation runs independently via GitHub Actions.

## Project Structure
- `scripts/scraper.ts`: Playwright scraping logic.
- `scripts/processor.ts`: AI data processing logic.
- `scripts/push_to_hf.ts`: HuggingFace upload logic.
- `src/App.tsx`: Main dashboard UI.
- `.github/workflows/scrape.yml`: Automation pipeline.
