const express = require("express");

const benchmarkRoutes = require("./routes/benchmarkRoutes");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/benchmark", benchmarkRoutes);

app.get("/", (req, res) => {
  res.send("Graph Database Benchmark API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});