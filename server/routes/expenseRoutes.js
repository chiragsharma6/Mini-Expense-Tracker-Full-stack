const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getBudgets,
  updateBudgets,
} = require("../controllers/expenseController");

router.get("/budgets", protect, getBudgets);
router.post("/budgets", protect, updateBudgets);

router.get("/", protect, getExpenses);
router.post("/", protect, addExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;