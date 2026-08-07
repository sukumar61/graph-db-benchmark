require("dotenv").config();

const connectFalkor = require("./config/falkordb");

async function testConnection() {
  try {
    const client = await connectFalkor();

    const graph = client.selectGraph("benchmark");

    const result = await graph.query("RETURN 1");

    console.log("FalkorDB Connected Successfully!");
    console.log(result);

    await client.close();
  } catch (error) {
    console.error(" Connection Failed");
    console.error(error);
  }
}

testConnection();