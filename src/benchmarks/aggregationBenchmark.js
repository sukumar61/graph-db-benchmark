const { aggregationBenchmark } = require("../repositories/graphRepository");

async function runAggregationBenchmark(iterations = 100) {
  const executionTimes = [];

  for (let i = 0; i < iterations; i++) {
    const result = await aggregationBenchmark();
    executionTimes.push(result.executionTime);
  }

  return {
    benchmark: "Aggregation Benchmark",
    executionTimes,
  };
}

module.exports = runAggregationBenchmark;