const { FalkorDB } = require("falkordb");

const client = new FalkorDB({
  host: process.env.FALKOR_HOST,
  port: Number(process.env.FALKOR_PORT),
  username: process.env.FALKOR_USERNAME,
  password: process.env.FALKOR_PASSWORD,
});

module.exports = client;