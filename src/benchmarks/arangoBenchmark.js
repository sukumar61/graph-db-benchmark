const {
  lookupUser,
  oneHopTraversal,
  twoHopTraversal,
  threeHopTraversal,
  aggregationBenchmark,
} = require("../repositories/arangoRepository");

async function arangoBenchmark(iterations = 100) {
  const lookupResults = [];
  const oneHopResults = [];
  const twoHopResults = [];
  const threeHopResults = [];
  const aggregationResults = [];

  for (let i = 0; i < iterations; i++) {
    const userId = String(Math.floor(Math.random() * 8700));

    const lookup = await lookupUser(userId);
    lookupResults.push(lookup.executionTime);

    const hop1 = await oneHopTraversal(userId);
    oneHopResults.push(hop1.executionTime);

    const hop2 = await twoHopTraversal(userId);
    twoHopResults.push(hop2.executionTime);

    const hop3 = await threeHopTraversal(userId);
    threeHopResults.push(hop3.executionTime);

    const aggregation = await aggregationBenchmark();
    aggregationResults.push(aggregation.executionTime);
  }

  return {
    database: "ArangoDB",
    iterations,

    lookup: lookupResults,

    oneHop: oneHopResults,

    twoHop: twoHopResults,

    threeHop: threeHopResults,

    aggregation: aggregationResults,
  };
}

module.exports = arangoBenchmark;