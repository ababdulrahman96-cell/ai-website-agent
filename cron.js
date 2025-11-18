import cron from "node-cron";
import { runAgent } from "./agent.js";

console.log("⏱ Cron job running...");

// Run at 3:00 AM daily
cron.schedule("0 3 * * *", () => {
  console.log("🔁 Running daily AI job...");
  runAgent();
});
