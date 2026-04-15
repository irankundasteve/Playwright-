# TrendPulse AI Project Context

## Overview
TrendPulse AI is a market intelligence platform that automates the collection and analysis of public internet data to surface trends and buying signals.

## Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Recharts, Motion.
- **AI**: Gemini 1.5 Flash (via @google/genai).
- **Scraping**: Python 3.10 with Selenium.
- **Automation**: GitHub Actions (commits data back to repo).
- **Storage**: GitHub Repository (`raw_data.json`).

## Key Files
- `scripts/scraper.py`: The core scraping engine (Python).
- `.github/workflows/scrape.yml`: The CI/CD pipeline for daily data collection.

## Configuration Requirements
The following environment variables/secrets are required for full functionality:
- `GEMINI_API_KEY` (for the Dashboard AI assistant)

## Development Rules
- Always use absolute path aliases (`@/components/...`) for imports.
- Maintain the "Technical Dashboard" aesthetic (dark mode, monospace fonts for data).
- Ensure all new UI components are responsive and accessible.
