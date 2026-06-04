const express = require("express");
const router = express.Router();

const expenses = require("../data/expenses.json");

router.get("/", (req, res) => {
  res.json(expenses);
});

module.exports = router;