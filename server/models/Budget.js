const mongoose = require("mongoose");

if (mongoose.models.Budget) {
  delete mongoose.models.Budget;
}

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    budgets: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        Food: 6000,
        Transport: 3000,
        Bills: 5000,
        Entertainment: 2500,
        Other: 2000,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);
