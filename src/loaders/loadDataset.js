const fs = require("fs");
const readline = require("readline");
const driver = require("../config/db");

async function loadDataset(filePath) {
  const session = driver.session({
    database: "neo4j", 
  });

  try {
    // Check connection
    const test = await session.run("RETURN 1 AS test");
    console.log("Database Connected:", test.records[0].get("test").toNumber());

    // Check nodes before import
    const before = await session.run(`
      MATCH (n)
      RETURN count(n) AS total
    `);

    console.log(
      "Before import:",
      before.records[0].get("total").toNumber()
    );

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let batch = [];
    let total = 0;
    const batchSize = 500;

    console.log("\nLoading dataset...\n");

    for await (const line of rl) {
      if (line.startsWith("#") || line.trim() === "") {
        continue;
      }

      const [from, to] = line.trim().split(/\s+/);

      batch.push({
        from,
        to,
      });

      total++;

      if (batch.length === batchSize) {
        const result = await session.run(
          `
          UNWIND $rows AS row
          MERGE (a:User {id: row.from})
          MERGE (b:User {id: row.to})
          MERGE (a)-[:KNOWS]->(b)
          `,
          { rows: batch }
        );

        
        console.log(`${total} relationships processed`);
        console.log(result.summary.counters.updates());
        

        batch = [];
      }

      if (total >= 5000) {
        break;
      }
    }

    if (batch.length > 0) {
      const result = await session.run(
        `
        UNWIND $rows AS row
        MERGE (a:User {id: row.from})
        MERGE (b:User {id: row.to})
        MERGE (a)-[:KNOWS]->(b)
        `,
        { rows: batch }
      );

      console.log(result.summary.counters.updates());
    }

    // Check nodes after import
    const after = await session.run(`
      MATCH (n)
      RETURN count(n) AS total
    `);

    console.log(
      "After import:",
      after.records[0].get("total").toNumber()
    );

    
    console.log("Dataset Loaded Successfully");
    console.log(`Total Relationships: ${total}`);
    

  } catch (err) {
    console.error(err);
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = loadDataset;