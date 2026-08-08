const db = require("../config/arango");

async function executeQuery(query, bindVars = {}) {
  const start = process.hrtime.bigint();

  try {
    const cursor = await db.query(query, bindVars);
    const records = await cursor.all();

    const end = process.hrtime.bigint();

    const executionTime = Number(end - start) / 1000000;

    return {
      executionTime,
      records,
    };
  } catch (error) {
    console.error("ArangoDB Query Error:", error);
    throw error;
  }
}

async function lookupUser(userId) {
  return executeQuery(
    `
    FOR u IN users
      FILTER u._key == @id
      RETURN u
    `,
    { id: userId }
  );
}

async function oneHopTraversal(userId) {
  return executeQuery(
    `
    FOR v, e, p IN 1..1 OUTBOUND
      DOCUMENT("users", @id)
      knows
      RETURN v
    `,
    { id: userId }
  );
}

async function twoHopTraversal(userId) {
  return executeQuery(
    `
    FOR v, e, p IN 2..2 OUTBOUND
      DOCUMENT("users", @id)
      knows
      RETURN DISTINCT v
    `,
    { id: userId }
  );
}

async function threeHopTraversal(userId) {
  return executeQuery(
    `
    FOR v, e, p IN 3..3 OUTBOUND
      DOCUMENT("users", @id)
      knows
      RETURN DISTINCT v
    `,
    { id: userId }
  );
}

async function aggregationBenchmark() {
  return executeQuery(
    `
    FOR e IN knows
      COLLECT WITH COUNT INTO totalUsers
      RETURN totalUsers
    `
  );
}

module.exports = {
  lookupUser,
  oneHopTraversal,
  twoHopTraversal,
  threeHopTraversal,
  aggregationBenchmark,
};