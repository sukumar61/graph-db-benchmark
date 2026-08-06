const express = require("express");
const driver = require("./config/db");

const app = express();
const PORT = 3000;

async function testConnection() {
  let session;

  try {
    session = driver.session();

    const result = await session.run("RETURN 1 AS test");

    console.log("✅Connected to CognoDB");
    console.log(result.records[0].get("test"));
  } catch (error) {
    console.error(" Connection Failed");
    console.error(error.message);
  } finally {
    if (session) {
      await session.close();
    }
  }
}

testConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});