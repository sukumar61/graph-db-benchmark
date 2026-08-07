const driver = require("../config/db");

async function executeQuery(query, params = {}) {
  const session = driver.session();

  try {
    const start = process.hrtime.bigint();

    const result = await session.run(query, params);

    const end = process.hrtime.bigint();

    const executionTime = Number(end - start) / 1000000; // milliseconds

    return {
      executionTime,
      records: result.records,
    };
  } finally {
    await session.close();
  }
}

async function lookupUser(userId) {
  return executeQuery(
    `
    MATCH (u:User {id:$id})
    RETURN u
    `,
    { id: userId }
  );
}

async function oneHopTraversal(userId) {
  return executeQuery(
    `
    MATCH (u:User {id:$id})-[:KNOWS]->(f)
    RETURN f
    `,
    { id: userId }
  );
}

async function twoHopTraversal(userId) {
  return executeQuery(
    `
    MATCH (u:User {id:$id})-[:KNOWS]->()-[:KNOWS]->(f)
    RETURN DISTINCT f
    `,
    { id: userId }
  );
}

async function threeHopTraversal(userId) {
  return executeQuery(
    `
    MATCH (u:User {id:$id})-[:KNOWS*3]->(f)
    RETURN DISTINCT f
    `,
    { id: userId }
  );
}

async function aggregationBenchmark() {
  return executeQuery(`
    MATCH (u:User)-[:KNOWS]->()
    RETURN count(u) AS totalUsers
  `);
}

module.exports = {
  lookupUser,
  oneHopTraversal,
  twoHopTraversal,
  threeHopTraversal,
  aggregationBenchmark,
};