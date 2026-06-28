const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(__dirname, "../data/expenses.json");
const budgetFilePath = path.join(__dirname, "../data/budgets.json");

const incomeCategoriesList = ["Salary", "Freelancing", "Bonus", "Investment"];

const determineType = (type, category) => {
  if (incomeCategoriesList.includes(category)) return "income";
  if (type === "income" || type === "expense") return type;
  return "expense";
};

// JSON file read karo aur expenses laao
const getExpenses = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath);
  const parsed = JSON.parse(data);
  return parsed.map((item) => ({
    ...item,
    type: determineType(item.type, item.category)
  }));
};

// Updated expenses ko file me save karna
const saveExpenses = (expenses) => {
  fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
};

// JSON file read budgets
const getBudgets = () => {
  if (!fs.existsSync(budgetFilePath)) {
    return { Food: 6000, Transport: 3000, Bills: 5000, Entertainment: 2500, Other: 2000 };
  }
  const data = fs.readFileSync(budgetFilePath);
  return JSON.parse(data);
};

// Save budgets to file
const saveBudgets = (budgets) => {
  fs.writeFileSync(budgetFilePath, JSON.stringify(budgets, null, 2));
};

// GET budgets
router.get("/budgets", (req, res) => {
  const budgets = getBudgets();
  res.json(budgets);
});

// POST update budgets
router.post("/budgets", (req, res) => {
  const newBudgets = req.body;
  saveBudgets(newBudgets);
  res.json(newBudgets);
});

// GET all expenses
router.get("/", (req, res) => {
  const expenses = getExpenses();
  res.json(expenses);
});

// POST new expense/income
router.post("/", (req, res) => {
  const { amount, category, date, note, type } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({
      message: "Amount, category and date are required"
    });
  }

  const expenses = getExpenses();
  const finalType = determineType(type, category);

  const newExpense = {
    id: uuidv4(),
    type: finalType,
    amount,
    category,
    date,
    note: note || ""
  };

  expenses.push(newExpense);
  saveExpenses(expenses);

  res.status(201).json(newExpense);
});

// UPDATE expense/income
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, date, note, type } = req.body;

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

  const finalType = determineType(type || expenses[expenseIndex].type, category);

  const updatedExpense = {
    ...expenses[expenseIndex],
    type: finalType,
    amount,
    category,
    date,
    note: note || ""
  };

  expenses[expenseIndex] = updatedExpense;
  saveExpenses(expenses);

  res.json(updatedExpense);
});

// DELETE expense/income
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter((expense) => expense.id !== id);

  saveExpenses(updatedExpenses);

  res.json({
    message: "Expense deleted successfully"
  });
});

module.exports = router;
