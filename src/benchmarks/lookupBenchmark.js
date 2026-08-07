const { lookupUser } = require("../repositories/graphRepository");

async function lookupBenchmark(iterations = 100) {
  const executionTimes = [];

  for (let i = 0; i < iterations; i++) {
    const userId = String(Math.floor(Math.random() * 8700));

    const result = await lookupUser(userId);

    executionTimes.push(result.executionTime);
  }

  return executionTimes;
}

module.exports = lookupBenchmark;