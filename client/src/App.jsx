import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./services/expenseService";
import SummaryDashboard from "./components/SummaryDashboard";
import ExpensePieChart from "./components/ExpensePieChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
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
  }).sort((a, b) => b.date.localeCompare(a.date));

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
    <>
      <Navbar />
      <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Personal finance</p>
          <h1 className="brand-title">EXPENDEE</h1>
          <p className="hero-copy">
            Expense Tracker — Spend smarter. Save better. Grow faster.
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

      <div className="side-by-side-grid">
        <ExpenseForm
          key={editingExpense ? editingExpense.id : "new-expense"}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onExpenseAdded={handleExpenseAdded}
          onExpenseUpdated={handleExpenseUpdated}
        />
        <ExpensePieChart expenses={filteredExpenses} />
      </div>

      <CategoryBreakdown expenses={filteredExpenses} />

      <ExpenseList
        expenses={filteredExpenses}
        hasActiveFilters={Boolean(hasActiveFilters)}
        isLoading={isLoading}
        onExpenseDeleted={fetchExpenses}
        onExpenseEdit={setEditingExpense}
      />

      <Footer />
    </main>
    </>
  );
}

export default App;
