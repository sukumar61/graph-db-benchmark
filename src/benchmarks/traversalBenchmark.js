const driver = require("../config/db");

async function traversalBenchmark(userId) {
  const session = driver.session();

  const start = Date.now();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id:$id})-[:KNOWS]->(friend)
      RETURN friend
      `,
      { id: userId }
    );

    const end = Date.now();

    return {
      user: userId,
      friends: result.records.length,
      time: end - start,
    };
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
}

module.exports = traversalBenchmark;