import "dotenv/config";
import { runNewsScraper } from "../lib/scraper/service";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  const countArg = args.find((a) => a.startsWith("--count="));
  const count = countArg ? parseInt(countArg.split("=")[1], 10) : 3;

  console.log("==========================================");
  console.log(" 🌞 Energy Guide - Solar News Scraper Test ");
  console.log("==========================================");
  console.log(`Count: ${count} | DryRun: ${dryRun} | Force: ${force}`);
  console.log(`Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log("------------------------------------------\n");

  const startTime = Date.now();
  const result = await runNewsScraper({
    limit: count,
    dryRun,
    force,
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n------------------------------------------");
  console.log(`Finished in ${duration}s.`);
  console.log(`Status: ${result.success ? "SUCCESS" : "FAILED"}`);
  console.log(`Message: ${result.message}`);
  console.log(`Articles Count: ${result.insertedCount}`);

  if (result.articles.length > 0) {
    console.log("\nProcessed Articles:");
    for (const [idx, a] of result.articles.entries()) {
      console.log(`\n[${idx + 1}] ${a.title}`);
      console.log(`    Slug: ${a.slug}`);
      console.log(`    Status: ${a.published ? "Published" : "Draft"}`);
      console.log(`    Image: ${a.imageUrl || "None"}`);
      console.log(`    Excerpt: ${a.excerpt}`);
    }
  }

  console.log("\n==========================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
