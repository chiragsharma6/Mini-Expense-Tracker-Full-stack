import { deleteExpense } from "../services/expenseService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "No date";

function ExpenseList({
  expenses,
  hasActiveFilters,
  isLoading,
  onExpenseDeleted,
  onExpenseEdit,
}) {
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);

      onExpenseDeleted();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="panel list-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recent activity</p>
          <h2>Expenses</h2>
        </div>
        <span className="count-pill">{expenses.length}</span>
      </div>

      {isLoading ? (
        <div className="empty-state">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <strong>
            {hasActiveFilters ? "No matching expenses" : "No expenses yet"}
          </strong>
          <span>
            {hasActiveFilters
              ? "Try changing or clearing your filters."
              : "Add your first expense to start seeing trends."}
          </span>
        </div>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li className="expense-row" key={expense.id}>
              <div className="category-mark" aria-hidden="true">
                {expense.category.slice(0, 1)}
              </div>
              <div className="expense-main">
                <div>
                  <strong>{expense.category}</strong>
                  <span>{expense.note || "No note added"}</span>
                </div>
                <small>{formatDate(expense.date)}</small>
              </div>
              <div className="expense-actions">
                <strong>{formatCurrency(expense.amount)}</strong>
              </div>
              <button
                className="secondary-button"
                onClick={() => onExpenseEdit(expense)}
                type="button"
              >
                Edit
              </button>
              <button
                className="ghost-button"
                onClick={() => handleDelete(expense.id)}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ExpenseList;
