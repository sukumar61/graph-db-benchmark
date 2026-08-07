const {
  oneHopTraversal,
  twoHopTraversal,
  threeHopTraversal,
} = require("../repositories/graphRepository");

async function traversalBenchmark(iterations = 100) {
  const oneHopResults = [];
  const twoHopResults = [];
  const threeHopResults = [];

  for (let i = 0; i < iterations; i++) {
    const userId = String(Math.floor(Math.random() * 8700));

   
    const hop1 = await oneHopTraversal(userId);
    oneHopResults.push(hop1.executionTime);

   
    const hop2 = await twoHopTraversal(userId);
    twoHopResults.push(hop2.executionTime);

   
    const hop3 = await threeHopTraversal(userId);
    threeHopResults.push(hop3.executionTime);
  }

  return {
    benchmark: "Traversal Benchmark",
    oneHop: oneHopResults,
    twoHop: twoHopResults,
    threeHop: threeHopResults,
  };
}

module.exports = traversalBenchmark;