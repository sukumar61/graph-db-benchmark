const { FalkorDB } = require("falkordb");

async function connectFalkor() {
  const client = await FalkorDB.connect({
    username: process.env.FALKOR_USERNAME,
    password: process.env.FALKOR_PASSWORD,
    socket: {
      host: process.env.FALKOR_HOST,
      port: Number(process.env.FALKOR_PORT),
    },
  });

  return client;
}

module.exports = connectFalkor;