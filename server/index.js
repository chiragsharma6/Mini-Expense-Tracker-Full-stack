const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const expenseRoutes = require("./routes/expenseRoutes");

app.use("/expenses", expenseRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});