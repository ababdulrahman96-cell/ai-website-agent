import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const wp = axios.create({
  baseURL: `${process.env.WP_URL}/wp-json/wp/v2`,
  auth: {
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASSWORD
  }
});

export async function optimizeWordPressPages() {
  console.log("🔍 Fetching WordPress pages...");

  const pages = await wp.get("/pages");

  for (const page of pages.data) {
    console.log(`✏️ Optimizing: ${page.title.rendered}`);

    const prompt = `
      You are an SEO expert AI.
      Improve this WordPress page.

      Title: ${page.title.rendered}
      Content: ${page.content.rendered}

      Return JSON ONLY with:
      {
        "title": "New title",
        "content": "Improved HTML content",
        "metaDescription": "SEO meta description"
      }
    `;

    const result = await client.responses.create({
      model: "gpt-4.1",
      input: prompt
    });

    const output = JSON.parse(result.output_text);

    await wp.post(`/pages/${page.id}`, {
      title: output.title,
      content: output.content,
      meta: {
        _yoast_wpseo_metadesc: output.metaDescription
      }
    });

    console.log(`✅ Updated WordPress page: ${page.title.rendered}`);
  }
}
