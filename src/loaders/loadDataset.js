const fs = require("fs");
const readline = require("readline");
const driver = require("../config/db");

async function loadDataset(filePath) {
  const session = driver.session();

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let batch = [];
  let total = 0;
  const batchSize = 500;

  console.log("Loading dataset...");

  try {
    for await (const line of rl) {
      if (line.startsWith("#") || line.trim() === "") {
        continue;
      }

      const parts = line.trim().split(/\s+/);

      batch.push({
        from: parts[0],
        to: parts[1],
      });

      total++;

      if (batch.length === batchSize) {
        await session.run(
          `
          UNWIND $rows AS row
          MERGE (a:User {id: row.from})
          MERGE (b:User {id: row.to})
          MERGE (a)-[:KNOWS]->(b)
          `,
          { rows: batch }
        );

        console.log(`${total} relationships inserted`);

        batch = [];
      }

      // Use only first 120000 relationships
      if (total >= 120000) {
        break;
      }
    }

    // Insert remaining rows
    if (batch.length > 0) {
      await session.run(
        `
        UNWIND $rows AS row
        MERGE (a:User {id: row.from})
        MERGE (b:User {id: row.to})
        MERGE (a)-[:KNOWS]->(b)
        `,
        { rows: batch }
      );
    }

    console.log("--------------------------------");
    console.log("Dataset Loaded Successfully");
    console.log(`Total Relationships: ${total}`);
    console.log("--------------------------------");
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
    await driver.close();
  }
}

module.exports = loadDataset;