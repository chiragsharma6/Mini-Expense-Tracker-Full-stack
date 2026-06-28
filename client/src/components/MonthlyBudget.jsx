import { useState, useEffect } from "react";
import { getBudgets, updateBudgets } from "../services/expenseService";

const expenseCategories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

const defaultBudgets = {
  Food: 6000,
  Transport: 3000,
  Bills: 5000,
  Entertainment: 2500,
  Other: 2000,
};

function MonthlyBudget({ expenses, currency = "INR" }) {
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultBudgets);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getBudgets().then((data) => {
      if (data && typeof data === "object") {
        setBudgets((prev) => ({ ...prev, ...data }));
        setEditForm((prev) => ({ ...prev, ...data }));
      }
    });
  }, []);

  const currentDate = new Date();

  // STRICT FILTERING: Income kabhi bhi budget me count na ho!
  const currentMonthExpenses = expenses.filter((item) => {
    if (item.type !== "expense") return false;
    const expenseDate = new Date(item.date);
    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const categorySpent = currentMonthExpenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    let locale = "en-IN";
    if (currency === "USD") locale = "en-US";
    else if (currency === "EUR") locale = "de-DE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleEditChange = (category, val) => {
    setEditForm((prev) => ({
      ...prev,
      [category]: Math.max(0, Number(val) || 0),
    }));
  };

  const handleSaveBudgets = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await updateBudgets(editForm);
      setBudgets(saved);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="panel budget-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Monthly Budget Target</h2>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setEditForm(budgets);
            setIsEditing(!isEditing);
          }}
          style={{ minHeight: "34px", padding: "0 14px", fontSize: "0.85rem" }}
        >
          {isEditing ? "Close" : "Set Budgets"}
        </button>
      </div>

      {isEditing ? (
        <form className="budget-edit-form" onSubmit={handleSaveBudgets} style={{ display: "grid", gap: "14px", marginTop: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            {expenseCategories.map((cat) => (
              <label key={cat} style={{ display: "grid", gap: "4px", fontSize: "0.88rem", fontWeight: "700" }}>
                <span>{cat}</span>
                <input
                  type="number"
                  min="0"
                  value={editForm[cat] ?? 0}
                  onChange={(e) => handleEditChange(cat, e.target.value)}
                  style={{ minHeight: "38px", padding: "6px 10px" }}
                />
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Budgets"}
            </button>
          </div>
        </form>
      ) : (
        <div className="budget-list" style={{ display: "grid", gap: "16px", marginTop: "8px" }}>
          {expenseCategories.map((category) => {
            const spent = categorySpent[category] || 0;
            const budget = budgets[category] || 0;
            const percentage = budget > 0 ? Math.round((spent / budget) * 100) : spent > 0 ? 100 : 0;
            const isOver = budget > 0 && spent > budget;

            let progressColor = "var(--accent)";
            if (percentage > 80 && percentage <= 100) progressColor = "var(--amber)";
            if (isOver) progressColor = "var(--rose)";

            return (
              <div key={category} className="budget-item" style={{ display: "grid", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.92rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong>{category}</strong>
                    {isOver && (
                      <span style={{ background: "var(--rose-soft)", color: "var(--rose)", fontSize: "0.75rem", fontWeight: "800", padding: "2px 8px", borderRadius: "999px" }}>
                        Exceeded by {formatCurrency(spent - budget)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--muted)", fontWeight: "700" }}>
                    <span style={{ color: isOver ? "var(--rose)" : "var(--text-strong)" }}>{formatCurrency(spent)}</span> / {formatCurrency(budget)}
                    <span style={{ marginLeft: "8px", fontWeight: "800" }}>({percentage}%)</span>
                  </div>
                </div>
                <div className="progress-track" style={{ height: "10px", background: "var(--surface-soft)", borderRadius: "999px", overflow: "hidden", position: "relative" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: "100%",
                      backgroundColor: progressColor,
                      borderRadius: "999px",
                      transition: "width 0.4s ease, background-color 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MonthlyBudget;
