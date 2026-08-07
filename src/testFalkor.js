require("dotenv").config();

const client = require("./config/falkordb");

async function testConnection() {
  try {
    // Connect to the default graph
    const graph = client.selectGraph("benchmark");

    // Simple test query
    const result = await graph.query("RETURN 1");

    console.log("✅ FalkorDB Connected Successfully!");
    console.log(result);
  } catch (error) {
    console.error("❌ Connection Failed");
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testConnection();