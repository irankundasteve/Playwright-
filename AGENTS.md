# TrendPulse AI Project Context

## Overview
TrendPulse AI is a market intelligence platform that automates the collection and analysis of public internet data to surface trends and buying signals.

## Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Recharts, Motion.
- **AI**: Gemini 1.5 Flash (via @google/genai).
- **Scraping**: Playwright (with stealth plugin).
- **Automation**: GitHub Actions.
- **Storage**: HuggingFace Datasets.

## Key Files
- `scripts/scraper.ts`: The core scraping engine.
- `scripts/processor.ts`: Transforms raw data into insights using Gemini.
- `scripts/push_to_hf.ts`: Handles data persistence to HuggingFace.
- `.github/workflows/scrape.yml`: The CI/CD pipeline for daily data collection.

## Configuration Requirements
The following environment variables/secrets are required for full functionality:
- `GEMINI_API_KEY`
- `HF_TOKEN`
- `HF_REPO`

## Development Rules
- Always use absolute path aliases (`@/components/...`) for imports.
- Maintain the "Technical Dashboard" aesthetic (dark mode, monospace fonts for data).
- Ensure all new UI components are responsive and accessible.
