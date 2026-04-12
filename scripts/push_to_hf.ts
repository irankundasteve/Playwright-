import { uploadFile } from "@huggingface/hub";
import fs from "fs";
import path from "path";

async function pushToHuggingFace() {
  const token = process.env.HF_TOKEN;
  const repo = process.env.HF_REPO; // e.g., "username/dataset-name"

  if (!token || !repo) {
    console.error("HF_TOKEN or HF_REPO environment variables are missing.");
    return;
  }

  const filePath = path.join(process.cwd(), "raw_data.json");
  if (!fs.existsSync(filePath)) {
    console.error("raw_data.json not found.");
    return;
  }

  const content = fs.readFileSync(filePath);
  const date = new Date().toISOString().split('T')[0];

  console.log(`Uploading raw_data.json to HuggingFace repo: ${repo}...`);

  try {
    await uploadFile({
      repo: { type: "dataset", name: repo },
      credentials: { accessToken: token },
      file: {
        path: `data/raw_${date}.json`,
        content: new Blob([content]),
      },
    });
    console.log("Upload successful!");
  } catch (error) {
    console.error("Error uploading to HuggingFace:", error);
  }
}

pushToHuggingFace().catch(console.error);
