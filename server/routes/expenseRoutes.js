const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(__dirname, "../data/expenses.json");

const getExpenses = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const saveExpenses = (expenses) => {
  fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
};

// GET all expenses
router.get("/", (req, res) => {
  const expenses = getExpenses();
  res.json(expenses);
});

// POST new expense
router.post("/", (req, res) => {
  const { amount, category, date, note } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({
      message: "Amount, category and date are required"
    });
  }

  const expenses = getExpenses();

  const newExpense = {
    id: uuidv4(),
    amount,
    category,
    date,
    note: note || ""
  };

  expenses.push(newExpense);

  saveExpenses(expenses);

  res.status(201).json(newExpense);
});

// UPDATE expense
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, date, note } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({
      message: "Amount, category and date are required"
    });
  }

  const expenses = getExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);

  if (expenseIndex === -1) {
    return res.status(404).json({
      message: "Expense not found"
    });
  }

  const updatedExpense = {
    ...expenses[expenseIndex],
    amount,
    category,
    date,
    note: note || ""
  };

  expenses[expenseIndex] = updatedExpense;
  saveExpenses(expenses);

  res.json(updatedExpense);
});

// DELETE expense
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const expenses = getExpenses();

  const updatedExpenses = expenses.filter(
    (expense) => expense.id !== id
  );

  saveExpenses(updatedExpenses);

  res.json({
    message: "Expense deleted successfully"
  });
});

module.exports = router;
