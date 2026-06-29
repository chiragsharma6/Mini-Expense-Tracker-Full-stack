const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Expense = require("./models/Expense");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const expenseRoutes = require("./routes/expenseRoutes");

app.use("/expenses", expenseRoutes);
app.use("/", expenseRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const count = await Expense.countDocuments();
    console.log(`📦 Expenses in MongoDB: ${count}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();