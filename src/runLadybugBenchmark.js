const fs = require("fs");
const lbug = require("@ladybugdb/wasm-core/nodejs");

async function measureQuery(conn, query) {
  const start = process.hrtime.bigint();

  await conn.query(query);

  const end = process.hrtime.bigint();

  return Number(end - start) / 1_000_000;
}

const average = (arr) =>
  arr.reduce((sum, value) => sum + value, 0) / arr.length;

async function runBenchmark(iterations = 100) {
  await lbug.init();

  const db = new lbug.Database("./data/ladybug.db");
  const conn = new lbug.Connection(db);

  try {
    console.log("🚀 Starting LadybugDB Benchmark...\n");

    const lookup = [];
    const oneHop = [];
    const twoHop = [];
    const threeHop = [];
    const aggregation = [];

    for (let i = 0; i < iterations; i++) {
      const userId = String(Math.floor(Math.random() * 3706));

      lookup.push(
        await measureQuery(
          conn,
          `MATCH (u:User {id: '${userId}'}) RETURN u`
        )
      );

      oneHop.push(
        await measureQuery(
          conn,
          `MATCH (u:User {id: '${userId}'})-[:KNOWS]->(f:User) RETURN f`
        )
      );

      twoHop.push(
        await measureQuery(
          conn,
          `MATCH (u:User {id: '${userId}'})-[:KNOWS]->()-[:KNOWS]->(f:User)
           RETURN DISTINCT f`
        )
      );

      threeHop.push(
        await measureQuery(
          conn,
          `MATCH (u:User {id: '${userId}'})-[:KNOWS*3]->(f:User)
           RETURN DISTINCT f`
        )
      );

      aggregation.push(
        await measureQuery(
          conn,
          `MATCH (u:User)-[:KNOWS]->()
           RETURN count(u) AS totalUsers`
        )
      );
    }

    const results = {
      database: "LadybugDB",
      iterations,
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

    fs.mkdirSync("results", { recursive: true });

    fs.writeFileSync(
      "results/ladybug-results.json",
      JSON.stringify(results, null, 2)
    );

    console.log("✅ LadybugDB Benchmark Completed\n");

    console.log("Database:", results.database);
    console.log("Iterations:", results.iterations);

    console.log("\n📊 Averages:");
    console.log("Lookup:", results.averages.lookup.toFixed(3), "ms");
    console.log("1-Hop:", results.averages.oneHop.toFixed(3), "ms");
    console.log("2-Hop:", results.averages.twoHop.toFixed(3), "ms");
    console.log("3-Hop:", results.averages.threeHop.toFixed(3), "ms");
    console.log(
      "Aggregation:",
      results.averages.aggregation.toFixed(3),
      "ms"
    );

    console.log("\n💾 Saved to results/ladybug-results.json");

  } catch (error) {
    console.error("❌ LadybugDB Benchmark Failed");
    console.error(error);
  } finally {
    conn.close();
    db.close();
  }
}

runBenchmark();