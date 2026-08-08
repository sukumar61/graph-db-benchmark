const fs = require("fs");
const readline = require("readline");
const driver = require("./config/cognodb");

const DATASET =
  "datasets/soc-pokec-relationships/soc-pokec-subset.txt";

const BATCH_SIZE = 500;
const ITERATIONS = 100;

async function runQuery(session, query, params = {}) {
  const start = process.hrtime.bigint();

  const result = await session.run(query, params);

  const end = process.hrtime.bigint();

  return {
    executionTime: Number(end - start) / 1_000_000,
    records: result.records,
  };
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function clearDatabase(session) {
  console.log("🧹 Clearing CognoDB...");

  await session.run(`
    MATCH (n)
    DETACH DELETE n
  `);

  console.log("✅ CognoDB cleared");
}

async function loadDataset(session) {
  console.log("\n📥 Loading dataset...");

  const fileStream = fs.createReadStream(DATASET);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let batch = [];
  let total = 0;

  for await (const line of rl) {
    if (line.startsWith("#") || line.trim() === "") {
      continue;
    }

    const [from, to] = line.trim().split(/\s+/);

    batch.push({ from, to });
    total++;

    if (batch.length === BATCH_SIZE) {
      await insertBatch(session, batch);

      console.log(`${total} relationships processed`);

      batch = [];
    }

    if (total >= 5000) {
      break;
    }
  }

  if (batch.length > 0) {
    await insertBatch(session, batch);
  }

  console.log(`✅ Loaded ${total} relationships`);

  return total;
}

async function insertBatch(session, rows) {
  await session.run(
    `
    UNWIND $rows AS row

    MERGE (a:User {id: row.from})
    MERGE (b:User {id: row.to})
    MERGE (a)-[:KNOWS]->(b)
    `,
    { rows }
  );
}

async function benchmark(session) {
  console.log("\n🚀 Starting CognoDB benchmark...\n");

  const lookup = [];
  const oneHop = [];
  const twoHop = [];
  const threeHop = [];
  const aggregation = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const userId = String(Math.floor(Math.random() * 3706));

    let result;

    result = await runQuery(
      session,
      `
      MATCH (u:User {id: $id})
      RETURN u
      `,
      { id: userId }
    );

    lookup.push(result.executionTime);

    result = await runQuery(
      session,
      `
      MATCH (u:User {id: $id})-[:KNOWS]->(f)
      RETURN f
      `,
      { id: userId }
    );

    oneHop.push(result.executionTime);

    result = await runQuery(
      session,
      `
      MATCH (u:User {id: $id})-[:KNOWS]->()-[:KNOWS]->(f)
      RETURN DISTINCT f
      `,
      { id: userId }
    );

    twoHop.push(result.executionTime);

    result = await runQuery(
      session,
      `
      MATCH (u:User {id: $id})-[:KNOWS*3]->(f)
      RETURN DISTINCT f
      `,
      { id: userId }
    );

    threeHop.push(result.executionTime);

    result = await runQuery(
      session,
      `
      MATCH (u:User)-[:KNOWS]->()
      RETURN count(u) AS totalUsers
      `
    );

    aggregation.push(result.executionTime);
  }

  return {
    database: "CognoDB",
    iterations: ITERATIONS,

    averages: {
      lookup: average(lookup),
      oneHop: average(oneHop),
      twoHop: average(twoHop),
      threeHop: average(threeHop),
      aggregation: average(aggregation),
    },

    timings: {
      lookup,
      oneHop,
      twoHop,
      threeHop,
      aggregation,
    },
  };
}

async function main() {
  const driverSession = driver.session();

  try {
    console.log("Connecting to CognoDB...\n");

    const connectionTest = await driverSession.run(
      "RETURN 1 AS test"
    );

    console.log(
      "✅ Connected:",
      connectionTest.records[0].get("test").toNumber()
    );

    // Clear existing benchmark data
    await clearDatabase(driverSession);

    // Load the same dataset used for the benchmark
    await loadDataset(driverSession);

    // Run benchmark
    const results = await benchmark(driverSession);

    // Save results
    fs.mkdirSync("results", { recursive: true });

    fs.writeFileSync(
      "results/cognodb-results.json",
      JSON.stringify(results, null, 2)
    );

    console.log("\n📊 CognoDB Averages:");

    console.log(
      "Lookup:",
      results.averages.lookup.toFixed(3),
      "ms"
    );

    console.log(
      "1-Hop:",
      results.averages.oneHop.toFixed(3),
      "ms"
    );

    console.log(
      "2-Hop:",
      results.averages.twoHop.toFixed(3),
      "ms"
    );

    console.log(
      "3-Hop:",
      results.averages.threeHop.toFixed(3),
      "ms"
    );

    console.log(
      "Aggregation:",
      results.averages.aggregation.toFixed(3),
      "ms"
    );

    console.log(
      "\n💾 Saved to results/cognodb-results.json"
    );

  } catch (error) {
    console.error("\n❌ CognoDB Benchmark Failed");
    console.error(error);
  } finally {
    await driverSession.close();
    await driver.close();
  }
}

main();
