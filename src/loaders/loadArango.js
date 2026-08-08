require("dotenv").config();

const fs = require("fs");
const readline = require("readline");
const db = require("../config/arango");

async function loadArango() {
  try {
    console.log("Connecting to ArangoDB...");

    // -----------------------------------
    // Users collection
    // -----------------------------------
    const users = db.collection("users");

    if (await users.exists()) {
      console.log("ℹ️ users collection already exists");
    } else {
      await users.create();
      console.log("✅ Created users collection");
    }

    // -----------------------------------
    // KNOWS edge collection
    // -----------------------------------
    const knows = db.collection("knows");

    if (await knows.exists()) {
      console.log("ℹ️ knows collection already exists");
    } else {
      await knows.create({ type: 3 });
      console.log("✅ Created knows edge collection");
    }

    // -----------------------------------
    // Dataset
    // -----------------------------------
    const filePath =
      "datasets/soc-pokec-relationships/soc-pokec-relationships.txt";

    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const usersMap = new Set();
    const edges = [];

    let total = 0;

    console.log("\nLoading dataset...\n");

    for await (const line of rl) {
      if (line.startsWith("#") || line.trim() === "") {
        continue;
      }

      const [from, to] = line.trim().split(/\s+/);

      if (!from || !to) {
        continue;
      }

      usersMap.add(from);
      usersMap.add(to);

      edges.push({
        _from: `users/${from}`,
        _to: `users/${to}`,
      });

      total++;

      // Same limit used by the existing Neo4j benchmark
      if (total >= 5000) {
        break;
      }
    }

    console.log(`Users found: ${usersMap.size}`);
    console.log(`Relationships found: ${edges.length}`);

    // -----------------------------------
    // Insert users
    // -----------------------------------
    const userDocuments = Array.from(usersMap).map((id) => ({
      _key: id,
      id,
    }));

    if (userDocuments.length > 0) {
      await users.import(userDocuments, {
        overwrite: true,
      });
    }

    console.log(`✅ Inserted ${userDocuments.length} users`);

    // -----------------------------------
    // Insert relationships
    // -----------------------------------
    if (edges.length > 0) {
      await knows.import(edges, {
        overwrite: true,
      });
    }

    console.log(`✅ Inserted ${edges.length} relationships`);

    console.log("\n🎉 ArangoDB Dataset Loaded Successfully!");
  } catch (error) {
    console.error("\n❌ ArangoDB Dataset Loading Failed");
    console.error(error);
  }
}

loadArango();