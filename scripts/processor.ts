import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function processRawData() {
  const rawDataPath = path.join(process.cwd(), 'raw_data.json');
  if (!fs.existsSync(rawDataPath)) {
    console.error("No raw data found to process.");
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));
  console.log(`Processing ${rawData.length} items...`);

  // We'll use Gemini to summarize the raw data into trends and signals
  const sample = rawData.slice(0, 20);
  
  const prompt = `
    Analyze the following raw market data (Reddit/Twitter posts) and extract:
    1. Top 5 Trends (keyword, volume estimate, growth sentiment)
    2. Top 5 Buying Signals (intent, text, category)
    3. 3 Market Predictions based on this data.

    Data: ${JSON.stringify(sample)}

    Return ONLY a JSON object with this structure:
    {
      "trends": [],
      "signals": [],
      "predictions": []
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    
    const text = response.text || "";
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const processedData = JSON.parse(cleanedText);
    
    const outputPath = path.join(process.cwd(), 'src/processedData.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));
    console.log(`Processed data saved to ${outputPath}`);
  } catch (error) {
    console.error("Error processing data with Gemini:", error);
  }
}

processRawData().catch(console.error);
