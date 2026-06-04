function SummaryDashboard({ expenses }) {
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category;

    totals[category] =
      (totals[category] || 0) + Number(expense.amount);

    return totals;
  }, {});

  return (
    <div>
      <h2>Summary Dashboard</h2>

      <p>
        <strong>Total Spent:</strong> ₹{totalSpent}
      </p>

      <p>
        <strong>Highest Expense:</strong> ₹{highestExpense}
      </p>

      <h3>Category Totals</h3>

      <ul>
        {Object.entries(categoryTotals).map(([category, total]) => (
          <li key={category}>
            {category}: ₹{total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SummaryDashboard;