const express = require("express");
const router = express.Router()

const { generateCode, history } = require("../controller/generate.controller");

router.post("/generate", generateCode);
router.post("/history", history);

module.exports = router