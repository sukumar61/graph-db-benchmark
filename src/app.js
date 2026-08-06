const express = require("express");
const loadDataset = require("./loaders/loadDataset");

const app = express();

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await loadDataset(
    "./datasets/soc-pokec-relationships/soc-pokec-subset.txt"
  );
});