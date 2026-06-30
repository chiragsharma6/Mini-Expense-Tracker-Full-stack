const Expense = require("../models/expense");
const Budget = require("../models/Budget");


// GET ALL EXPENSES
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE EXPENSE
const addExpense = async (req, res) => {
  try {
    const { amount, category, date, note, type } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({
        message: "Amount, category and date are required",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      type: type || "expense",
      date,
      note: note || "",
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE EXPENSE
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    expense.amount = req.body.amount ?? expense.amount;
    expense.category = req.body.category ?? expense.category;
    expense.date = req.body.date ?? expense.date;
    expense.note = req.body.note ?? expense.note;
    expense.type = req.body.type ?? expense.type;

    const updatedExpense = await expense.save();

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE EXPENSE
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET BUDGETS
const getBudgets = async (req, res) => {
  try {
    let budgetDoc = await Budget.findOne({ user: req.user._id });
    if (!budgetDoc) {
      budgetDoc = await Budget.create({ user: req.user._id });
    }
    let result = budgetDoc.budgets;
    if (result instanceof Map) {
      result = Object.fromEntries(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE BUDGETS
const updateBudgets = async (req, res) => {
  try {
    const budgetDoc = await Budget.findOneAndUpdate(
      { user: req.user._id },
      { $set: { budgets: req.body } },
      { new: true, upsert: true, runValidators: true }
    );
    let result = budgetDoc.budgets;
    if (result instanceof Map) {
      result = Object.fromEntries(result);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getBudgets,
  updateBudgets,
};