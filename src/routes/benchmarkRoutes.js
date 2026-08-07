const express = require("express");

const benchmarkController = require("../controllers/benchmarkController");

const router = express.Router();

router.get("/", benchmarkController);

module.exports = router;