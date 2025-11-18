import cron from "node-cron";
import axios from "axios";

cron.schedule("0 */6 * * *", async () => {
  try {
    await axios.post(`${process.env.AI_WEBHOOK_URL}/optimize`, {
      task: "maintain SEO, improve UX, speed and mobile layout"
    });
    console.log("Auto-optimization completed.");
  } catch (err) {
    console.log("Cron failed:", err.message);
  }
});
