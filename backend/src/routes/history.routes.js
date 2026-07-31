const express = require("express");
const router = express.Router();

const { getHistory } = require("../controller/history.controller");

router.get("/history", getHistory);

module.exports = router