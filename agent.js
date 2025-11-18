import { optimizeWordPressPages } from "./wordpress.js";
import { optimizeHtmlFile } from "./htmlManager.js";

export async function runAgent() {
  console.log("🤖 Starting Website AI Agent...");

  try {
    await optimizeWordPressPages();
    await optimizeHtmlFile("/public_html/index.html");
    await optimizeHtmlFile("/public_html/about.html");
  } catch (error) {
    console.error("❌ Agent Error:", error);
  }

  console.log("✅ AI Agent Finished");
}

runAgent();
