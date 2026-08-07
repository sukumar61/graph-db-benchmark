const runAllBenchmarks = require("../services/benchmarkService");

async function benchmarkController(req, res) {
  try {
    const result = await runAllBenchmarks();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Benchmark Failed",
    });
  }
}

module.exports = benchmarkController;