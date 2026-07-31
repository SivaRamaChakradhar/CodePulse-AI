const express = require("express");
const router = express.Router();

const { analyzeCode } = require("../controller/analyze.controller");

router.post("/analyze", analyzeCode);

module.exports = router

