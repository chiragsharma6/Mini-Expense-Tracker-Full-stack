import { useState } from "react";
import { addExpense } from "../services/expenseService";

const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await addExpense(formData);
      await onExpenseAdded();

      setFormData({
        amount: "",
        category: "",
        date: "",
        note: "",
      });
    } catch (error) {
      console.error(error);
      setError("Could not add this expense. Please check the details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">New entry</p>
          <h2>Add expense</h2>
        </div>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            placeholder="2500"
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
            {categories.map((category) => (
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
            required
          />
        </label>

        <label className="form-wide">
          <span>Note</span>
          <input
            type="text"
            name="note"
            placeholder="Dinner, cab, subscription..."
            value={formData.note}
            onChange={handleChange}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? "Adding..." : "Add expense"}
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;
