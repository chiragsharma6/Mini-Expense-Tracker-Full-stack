import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./services/expenseService";
import SummaryDashboard from "./components/SummaryDashboard";

function App() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>

      <SummaryDashboard expenses={expenses} />

      <ExpenseForm onExpenseAdded={fetchExpenses} />

      <ExpenseList
  expenses={expenses}
  onExpenseDeleted={fetchExpenses}
/>
    </div>
  );
}

export default App;