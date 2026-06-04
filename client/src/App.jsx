import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./services/expenseService";

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

      <ExpenseForm onExpenseAdded={fetchExpenses} />

      <ExpenseList
  expenses={expenses}
  onExpenseDeleted={fetchExpenses}
/>
    </div>
  );
}

export default App;