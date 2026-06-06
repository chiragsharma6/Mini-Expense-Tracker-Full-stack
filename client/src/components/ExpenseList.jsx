import { deleteExpense } from "../services/expenseService";

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
  currency = "INR",
}) {
  const formatCurrency = (amount) => {
    let locale = "en-IN";
    if (currency === "USD") locale = "en-US";
    else if (currency === "EUR") locale = "de-DE";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);

      onExpenseDeleted();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert("add expenses to download");
      return;
    }

    const headers = ["ID", "Category", "Amount", "Date", "Note"];
    const csvRows = [headers.join(",")];

    expenses.forEach((expense) => {
      const row = [
        expense.id,
        expense.category,
        expense.amount,
        expense.date,
        (expense.note || "").replace(/"/g, '""'),
      ];
      csvRows.push(row.map(field => `"${field}"`).join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="panel list-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recent activity</p>
          <h2>Expenses</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className="secondary-button"
            onClick={handleExportCSV}
            type="button"
            style={{
              minHeight: "34px",
              padding: "0 12px",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <span className="count-pill">{expenses.length}</span>
        </div>
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
