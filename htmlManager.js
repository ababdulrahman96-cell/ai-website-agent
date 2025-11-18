import { Client } from "basic-ftp";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function download(path) {
  const ftp = new Client();
  await ftp.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });

  await ftp.downloadTo("./temp.html", path);
  ftp.close();

  return fs.readFileSync("./temp.html", "utf8");
}

async function upload(path, content) {
  const ftp = new Client();
  await ftp.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS
  });

  fs.writeFileSync("./temp.html", content);
  await ftp.uploadFrom("./temp.html", path);

  ftp.close();
}

export async function optimizeHtmlFile(path) {
  console.log("🗂 Downloading HTML:", path);

  const html = await download(path);

  const result = await client.responses.create({
    model: "gpt-4.1",
    input: `
      Improve this HTML for SEO, structure, accessibility.

      Return ONLY improved HTML.

      HTML:
      ${html}
    `
  });

  console.log("⬆️ Uploading optimized HTML...");
  await upload(path, result.output_text);

  console.log("✅ Updated:", path);
}
