const driver = require("../config/db");

async function lookupBenchmark(userId) {
  const session = driver.session();

  const start = Date.now();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$id})
      RETURN u
      `,
      { id: userId }
    );

    const end = Date.now();

    return {
      user: userId,
      time: end - start,
      found: result.records.length > 0,
    };
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
}

module.exports = lookupBenchmark;