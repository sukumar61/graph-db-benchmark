const driver = require("../config/db");

async function aggregationBenchmark() {
  const session = driver.session();

  const start = Date.now();

  try {
    const result = await session.run(`
      MATCH (u:User)
      RETURN count(u) AS totalUsers
    `);

    const end = Date.now();

    return {
      totalUsers: result.records[0].get("totalUsers").toNumber(),
      time: end - start,
    };
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
}

module.exports = aggregationBenchmark;