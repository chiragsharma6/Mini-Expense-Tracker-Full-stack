import { useState, useEffect, useRef } from "react";
import { addExpense, updateExpense } from "../services/expenseService";

const expenseCategories = ["Food", "Transport", "Bills", "Entertainment", "Other"];
const incomeCategories = ["Salary", "Freelancing", "Bonus", "Investment"];

const emptyForm = {
  type: "expense",
  amount: "",
  category: "",
  date: "",
  note: "",
};

const getInitialFormData = (expense) => {
  if (!expense) {
    return emptyForm;
  }

  const type = expense.type || (incomeCategories.includes(expense.category) ? "income" : "expense");

  return {
    type,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    note: expense.note || "",
  };
};

function ExpenseForm({
  editingExpense,
  onCancelEdit,
  onExpenseAdded,
  onExpenseUpdated,
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(editingExpense)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(editingExpense);

  useEffect(() => {
    if (editingExpense) {
      setFormData(getInitialFormData(editingExpense));
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (newType) => {
    if (formData.type === newType) return;
    setFormData({
      ...formData,
      type: newType,
      category: "", // Reset category when switching type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(formData.amount);
    const today = new Date().toISOString().split("T")[0];

    if (amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    if (formData.date > today) {
      setError("Future dates are not allowed.");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        await updateExpense(editingExpense.id, formData);
        await onExpenseUpdated();
      } else {
        await addExpense(formData);
        await onExpenseAdded();
      }

      setFormData(emptyForm);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not save this entry. Please check the details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    setError("");
    onCancelEdit();
  };

  const activeCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isEditing ? "Edit entry" : "New entry"}</p>
          <h2>{isEditing ? `Update ${formData.type}` : "Add transaction"}</h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <button
          type="button"
          className={formData.type === "expense" ? "primary-button" : "secondary-button"}
          onClick={() => handleTypeChange("expense")}
          style={{
            flex: 1,
            minHeight: "38px",
            backgroundColor: formData.type === "expense" ? "var(--rose)" : "var(--surface)",
            borderColor: formData.type === "expense" ? "var(--rose)" : "var(--border)",
            color: formData.type === "expense" ? "#ffffff" : "var(--text-strong)",
          }}
        >
          Expense
        </button>
        <button
          type="button"
          className={formData.type === "income" ? "primary-button" : "secondary-button"}
          onClick={() => handleTypeChange("income")}
          style={{
            flex: 1,
            minHeight: "38px",
            backgroundColor: formData.type === "income" ? "var(--accent)" : "var(--surface)",
            borderColor: formData.type === "income" ? "var(--accent)" : "var(--border)",
            color: formData.type === "income" ? "#ffffff" : "var(--text-strong)",
          }}
        >
          Income
        </button>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            min="1"
            step="0.01"
            placeholder={formData.type === "income" ? "50000" : "2500"}
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Category</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {activeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Date</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </label>

        <label className="form-wide">
          <span>Note</span>
          <input
            type="text"
            name="note"
            placeholder={formData.type === "income" ? "Monthly salary, project payment..." : "Dinner, cab, subscription..."}
            value={formData.note}
            onChange={handleChange}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditing
              ? `Update ${formData.type}`
              : `Add ${formData.type}`}
          </button>

          {isEditing && (
            <button
              className="secondary-button"
              onClick={handleCancelEdit}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ExpenseForm;