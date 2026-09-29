const express = require("express");
const router = express.Router();

const { generateCode } = require("../controller/generate.controller");

router.post("/generate", generateCode);

module.exports = router;