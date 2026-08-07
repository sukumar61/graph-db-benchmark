const runLookupBenchmark = require("../benchmarks/lookupBenchmark");
const runTraversalBenchmark = require("../benchmarks/traversalBenchmark");
const runAggregationBenchmark = require("../benchmarks/aggregationBenchmark");

const calculateMetrics = require("../utils/metrics");

async function runAllBenchmarks() {
  console.log("Running Lookup Benchmark...");
  const lookupTimes = await runLookupBenchmark();

  console.log("Running Traversal Benchmark...");
  const traversal = await runTraversalBenchmark();

  console.log("Running Aggregation Benchmark...");
  const aggregation = await runAggregationBenchmark();

  return {
    lookup: calculateMetrics(lookupTimes),

    oneHop: calculateMetrics(traversal.oneHop),

    twoHop: calculateMetrics(traversal.twoHop),

    threeHop: calculateMetrics(traversal.threeHop),

    aggregation: calculateMetrics(
      aggregation.executionTimes
    ),
  };
}

module.exports = runAllBenchmarks;