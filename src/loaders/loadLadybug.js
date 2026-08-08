const fs = require("fs");
const readline = require("readline");
const lbug = require("@ladybugdb/wasm-core/nodejs");

async function loadLadybug(filePath) {
  await lbug.init();

  const db = new lbug.Database("./data/ladybug.db");
  const conn = new lbug.Connection(db);

  try {
    console.log("Connecting to LadybugDB...");

    await conn.query(`
      CREATE NODE TABLE IF NOT EXISTS User(
        id STRING PRIMARY KEY
      )
    `);

    await conn.query(`
      CREATE REL TABLE IF NOT EXISTS KNOWS(
        FROM User TO User
      )
    `);

    console.log("✅ Tables created");

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let rows = [];
    let total = 0;
    const batchSize = 500;

    console.log("\nLoading dataset...\n");

    for await (const line of rl) {
      if (line.startsWith("#") || line.trim() === "") {
        continue;
      }

      const [from, to] = line.trim().split(/\s+/);

      rows.push({ from, to });
      total++;

      if (rows.length === batchSize) {
        for (const row of rows) {
          await conn.query(
            `MERGE (u:User {id: '${row.from}'})`
          );

          await conn.query(
            `MERGE (u:User {id: '${row.to}'})`
          );

          await conn.query(
            `MATCH (a:User {id: '${row.from}'}),
                   (b:User {id: '${row.to}'})
             CREATE (a)-[:KNOWS]->(b)`
          );
        }

        console.log(`${total} relationships processed`);

        rows = [];
      }

      if (total >= 5000) {
        break;
      }
    }

    // Remaining rows
    for (const row of rows) {
      await conn.query(
        `MERGE (u:User {id: '${row.from}'})`
      );

      await conn.query(
        `MERGE (u:User {id: '${row.to}'})`
      );

      await conn.query(
        `MATCH (a:User {id: '${row.from}'}),
               (b:User {id: '${row.to}'})
         CREATE (a)-[:KNOWS]->(b)`
      );
    }

    console.log("\n LadybugDB Dataset Loaded Successfully!");
    console.log(`Users/relationships processed: ${total}`);

  } catch (error) {
    console.error(" LadybugDB Dataset Loading Failed");
    console.error(error);
  } finally {
    conn.close();
    db.close();
  }
}

const dataset =
  "datasets/soc-pokec-relationships/soc-pokec-subset.txt";

loadLadybug(dataset);