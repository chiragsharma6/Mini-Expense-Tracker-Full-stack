import { useState } from "react";
import { addExpense, updateExpense } from "../services/expenseService";

const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

const emptyForm = {
amount: "",
category: "",
date: "",
note: "",
};

const getInitialFormData = (expense) => {
if (!expense) {
return emptyForm;
}

return {
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

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

setError("");

const amount = Number(formData.amount);
const today = new Date().toISOString().split("T")[0];

// Validation
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
} catch (error) {
  console.error(error);
  setError("Could not save this expense. Please check the details.");
} finally {
  setIsSaving(false);
}


};

const handleCancelEdit = () => {
setFormData(emptyForm);
setError("");
onCancelEdit();
};

return ( <section className="panel form-panel"> <div className="section-heading"> <div> <p className="eyebrow">{isEditing ? "Edit entry" : "New entry"}</p> <h2>{isEditing ? "Update expense" : "Add expense"}</h2> </div> </div>

  <form className="expense-form" onSubmit={handleSubmit}>
    <label>
      <span>Amount</span>
      <input
        type="number"
        name="amount"
        min="1"
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
        max={new Date().toISOString().split("T")[0]}
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

    <div className="form-actions">
      <button className="primary-button" type="submit" disabled={isSaving}>
        {isSaving
          ? "Saving..."
          : isEditing
          ? "Update expense"
          : "Add expense"}
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