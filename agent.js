import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import WordPressManager from "./wordpress.js";
import HTMLManager from "./htmlManager.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/optimize", async (req, res) => {
  try {
    const task = req.body.task || "improve seo and ux";

    if (process.env.WEBSITE_TYPE === "wordpress") {
      const wp = new WordPressManager();
      const result = await wp.optimize(task);
      return res.json(result);
    }

    if (process.env.WEBSITE_TYPE === "html") {
      const html = new HTMLManager();
      const result = await html.optimize(task);
      return res.json(result);
    }

    res.json({ error: "Invalid WEBSITE_TYPE in .env" });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Agent running on port ${PORT}`);
});
