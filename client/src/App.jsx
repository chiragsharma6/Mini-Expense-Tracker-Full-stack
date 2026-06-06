import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import { getExpenses, updateExpense } from "./services/expenseService";
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

const EXCHANGE_RATES = {
  INR: 1.0,
  USD: 83.0,
  EUR: 90.0,
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState("INR");
  
  const [filters, setFilters] = useState(emptyFilters);

  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === currentCurrency) return;

    const rateOld = EXCHANGE_RATES[currentCurrency];
    const rateNew = EXCHANGE_RATES[newCurrency];

    const convertedExpenses = expenses.map((expense) => {
      const amountInINR = Number(expense.amount) * rateOld;
      const convertedAmount = Number((amountInINR / rateNew).toFixed(4));
      return {
        ...expense,
        amount: convertedAmount,
      };
    });

    try {
      setIsLoading(true);
      await Promise.all(
        convertedExpenses.map((exp) => updateExpense(exp.id, exp))
      );
      setExpenses(convertedExpenses);
      setCurrentCurrency(newCurrency);
      setNotice(`Switched to ${newCurrency}. All values converted.`);
      window.setTimeout(() => setNotice(""), 2200);
    } catch (err) {
      console.error("Failed to convert currency:", err);
      setError("Unable to convert expenses on the server. Please try again.");
      window.setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
        <div className="first-page">
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

        <ExpenseForm
          key={editingExpense ? editingExpense.id : "new-expense"}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onExpenseAdded={handleExpenseAdded}
          onExpenseUpdated={handleExpenseUpdated}
          currency={currentCurrency}
          onCurrencyChange={handleCurrencyChange}
        />

        <SummaryDashboard expenses={filteredExpenses} currency={currentCurrency} />

        <div className={`scroll-indicator ${!showScrollIndicator ? "scroll-indicator-hidden" : ""}`}>
          <span>Scroll down for insights & activity</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" width="16" height="16">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
      </div>

      <div className="side-by-side-grid">
        <ExpenseFilters
          filters={filters}
          filteredCount={filteredExpenses.length}
          totalCount={expenses.length}
          onClearFilters={() => setFilters(emptyFilters)}
          onFilterChange={handleFilterChange}
        />
        <ExpensePieChart expenses={filteredExpenses} />
      </div>

      <CategoryBreakdown expenses={filteredExpenses} currency={currentCurrency} />

      <ExpenseList
        expenses={filteredExpenses}
        hasActiveFilters={Boolean(hasActiveFilters)}
        isLoading={isLoading}
        onExpenseDeleted={fetchExpenses}
        onExpenseEdit={setEditingExpense}
        currency={currentCurrency}
      />

      <Footer />
    </main>
    </>
  );
}

export default App;
