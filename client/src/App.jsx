import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./services/expenseService";
import SummaryDashboard from "./components/SummaryDashboard";

const emptyFilters = {
  category: "",
  startDate: "",
  endDate: "",
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);
  const hasActiveFilters = filters.category || filters.startDate || filters.endDate;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      !filters.category || expense.category === filters.category;
    const matchesStartDate =
      !filters.startDate || expense.date >= filters.startDate;
    const matchesEndDate = !filters.endDate || expense.date <= filters.endDate;

    return matchesCategory && matchesStartDate && matchesEndDate;
  });

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load expenses. Make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getExpenses()
      .then((data) => {
        if (!isMounted) return;
        setExpenses(data);
        setError("");
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError("Unable to load expenses. Make sure the server is running.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExpenseAdded = async () => {
    await fetchExpenses();
    setNotice("Expense added");
    window.setTimeout(() => setNotice(""), 2200);
  };

  const handleExpenseUpdated = async () => {
    await fetchExpenses();
    setEditingExpense(null);
    setNotice("Expense updated");
    window.setTimeout(() => setNotice(""), 2200);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Personal finance</p>
          <h1>Expense Tracker</h1>
          <p className="hero-copy">
            Track daily spending, see category pressure, and keep recent
            transactions tidy.
          </p>
        </div>
        <div className="hero-badge" aria-label={`${expenses.length} recorded expenses`}>
          <span>{expenses.length}</span>
          <small>records</small>
        </div>
      </header>

      {notice && <div className="notice">{notice}</div>}
      {error && <div className="notice notice-error">{error}</div>}

      <ExpenseFilters
        filters={filters}
        filteredCount={filteredExpenses.length}
        totalCount={expenses.length}
        onClearFilters={() => setFilters(emptyFilters)}
        onFilterChange={handleFilterChange}
      />

      <SummaryDashboard expenses={filteredExpenses} />

      <section className="workspace-grid">
        <ExpenseForm
          key={editingExpense ? editingExpense.id : "new-expense"}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onExpenseAdded={handleExpenseAdded}
          onExpenseUpdated={handleExpenseUpdated}
        />
        <ExpenseList
          expenses={filteredExpenses}
          hasActiveFilters={Boolean(hasActiveFilters)}
          isLoading={isLoading}
          onExpenseDeleted={fetchExpenses}
          onExpenseEdit={setEditingExpense}
        />
      </section>
    </main>
  );
}

export default App;
