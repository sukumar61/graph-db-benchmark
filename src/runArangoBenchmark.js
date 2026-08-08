require("dotenv").config();

const fs = require("fs");
const arangoBenchmark = require("./benchmarks/arangoBenchmark");

async function run() {
  try {
    console.log("🚀 Starting ArangoDB Benchmark...\n");

    const results = await arangoBenchmark(100);

    fs.mkdirSync("results", { recursive: true });

    fs.writeFileSync(
      "results/arango-results.json",
      JSON.stringify(results, null, 2)
    );

    console.log("\n ArangoDB Benchmark Completed");
    console.log(" Saved to: results/arango-results.json");

  } catch (error) {
    console.error(" ArangoDB Benchmark Failed");
    console.error(error);
  }
}

run();