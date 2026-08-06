const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
  process.env.DB_URI,
  neo4j.auth.basic(
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD
  )
);

async function verifyConnection() {
  await driver.verifyConnectivity();
  console.log("Connected successfully!");

  const session = driver.session();

  const result = await session.run(`
    MATCH (n)
    RETURN labels(n) AS labels, count(*) AS count
  `);

  console.log(result.records.map(r => ({
    labels: r.get("labels"),
    count: r.get("count").toNumber()
  })));

  await session.close();
}



verifyConnection().catch(console.error);

module.exports = driver;