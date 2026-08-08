const { Database } = require("arangojs");

const db = new Database({
  url: process.env.ARANGO_URL,
  databaseName: "_system",
  auth: {
    username: process.env.ARANGO_USERNAME,
    password: process.env.ARANGO_PASSWORD,
  },
});

module.exports = db;