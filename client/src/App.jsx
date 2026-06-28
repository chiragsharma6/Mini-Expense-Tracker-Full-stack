import { useEffect, useState, useRef } from "react";
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
  type: "",
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
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const followerRef = useRef(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;
    const circle = follower.querySelector(".cursor-follower-circle");
    if (!circle) return;

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      follower.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const target = e.target;
      if (target) {
        const isOverCard = target.closest(
          ".panel, .stat-card, .hero, .hero-badge, .navbar-sticky, .app-footer, .scroll-indicator, button, input, select, a"
        );
        if (isOverCard) {
          circle.classList.add("hidden");
        } else {
          circle.classList.remove("hidden");
        }
      }
    };

    const handleMouseLeave = () => {
      circle.classList.add("hidden");
    };

    const handleMouseEnter = () => {
      circle.classList.remove("hidden");
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);
  
  const [filters, setFilters] = useState(emptyFilters);

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

  const hasActiveFilters = filters.type || filters.category || filters.startDate || filters.endDate;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesType = !filters.type || expense.type === filters.type;
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesStartDate = !filters.startDate || expense.date >= filters.startDate;
    const matchesEndDate = !filters.endDate || expense.date <= filters.endDate;

    return matchesType && matchesCategory && matchesStartDate && matchesEndDate;
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

  const handleExpenseAdded = (newExpense) => {
    if (newExpense) {
      setExpenses((prev) => [newExpense, ...prev.filter((x) => x.id !== newExpense.id)]);
    }
    fetchExpenses();
    const msg = newExpense && newExpense.type === "income" ? "Income added successfully!" : "Expense added successfully!";
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 1000);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    if (updatedExpense) {
      setExpenses((prev) =>
        prev.map((x) => (x.id === updatedExpense.id ? updatedExpense : x))
      );
    }
    setEditingExpense(null);
    fetchExpenses();
    setNotice("Transaction updated successfully!");
    window.setTimeout(() => setNotice(""), 1000);
  };

  const handleExpenseDeleted = (deletedId) => {
    if (deletedId) {
      setExpenses((prev) => prev.filter((x) => x.id !== deletedId));
    }
    fetchExpenses();
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
      <div ref={followerRef} className="cursor-follower-wrapper">
        <div className="cursor-follower-circle hidden" />
      </div>

      {notice && (
        <div className="screen-popup-overlay">
          <div className="screen-popup-card">
            <p className="screen-popup-text">{notice}</p>
          </div>
        </div>
      )}

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

        {error && <div className="notice notice-error">{error}</div>}

        <ExpenseForm
          key={editingExpense ? editingExpense.id : "new-expense"}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onExpenseAdded={handleExpenseAdded}
          onExpenseUpdated={handleExpenseUpdated}
        />

        <SummaryDashboard expenses={filteredExpenses} />

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

      <CategoryBreakdown expenses={filteredExpenses} />

      <ExpenseList
        expenses={filteredExpenses}
        hasActiveFilters={Boolean(hasActiveFilters)}
        isLoading={isLoading}
        onExpenseDeleted={handleExpenseDeleted}
        onExpenseEdit={setEditingExpense}
      />

      <Footer />
    </main>
    </>
  );
}

export default App;
