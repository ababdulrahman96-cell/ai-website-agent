import { optimizeWordPressPages } from "./wordpress.js";

export async function runAgent() {
  console.log("🤖 Starting WordPress AI Agent...");

  try {
    await optimizeWordPressPages();
  } catch (error) {
    console.error("❌ Agent Error:", error);
  }

  console.log("✅ AI Agent Finished");
}

runAgent();
