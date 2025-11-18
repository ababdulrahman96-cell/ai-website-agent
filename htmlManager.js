import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

export default class HTMLManager {
  constructor() {
    this.path = process.env.HTML_PATH;
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async optimize(task) {
    const html = fs.readFileSync(this.path, "utf8");
    const updated = await this.aiRewrite(html, task);
    fs.writeFileSync(this.path, updated);
    return { status: "HTML optimized" };
  }

  async aiRewrite(html, task) {
    const prompt = `
Improve SEO, mobile responsiveness, design, spacing, accessibility, and UX.
Task: ${task}
Rewrite this HTML:

${html}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You rewrite HTML safely." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  }
}
