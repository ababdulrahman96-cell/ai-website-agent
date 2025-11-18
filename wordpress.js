import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export default class WordPressManager {
  constructor() {
    this.themePath = process.env.THEME_PATH;
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  async optimize(task) {
    const phpFiles = fs
      .readdirSync(this.themePath)
      .filter(f => f.endsWith(".php"));

    for (const file of phpFiles) {
      const filePath = `${this.themePath}/${file}`;
      let content = fs.readFileSync(filePath, "utf8");

      const updated = await this.aiRewrite(content, task);

      fs.writeFileSync(filePath, updated);
    }

    return { status: "WordPress theme updated" };
  }

  async aiRewrite(content, task) {
    const prompt = `
You are an expert WordPress developer and SEO/UI specialist.
Task: ${task}
Rewrite or improve the following code while keeping it functional:

${content}
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You improve code safely." },
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
