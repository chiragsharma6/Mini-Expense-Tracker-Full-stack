function SummaryDashboard({ expenses }) {
  const currentDate = new Date();

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

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
    totals[category] = (totals[category] || 0) + Number(expense.amount);
    return totals;
  }, {});

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, totalA], [, totalB]) => totalB - totalA
  );
  const topCategory = sortedCategories[0]?.[0] || "None";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="stat-grid">
      <article className="stat-card stat-card-primary">
        <span>This Month Spend</span>
        <strong>{formatCurrency(currentMonthTotal)}</strong>
        <small>
          This month ({currentMonthExpenses.length} expenses)
        </small>
      </article>
      <article className="stat-card">
        <span>Highest expense</span>
        <strong>{formatCurrency(highestExpense)}</strong>
        <small>Largest single transaction</small>
      </article>
      <article className="stat-card">
        <span>Average spend</span>
        <strong>{formatCurrency(averageExpense)}</strong>
        <small>Per recorded expense</small>
      </article>
      <article className="stat-card">
        <span>Top category</span>
        <strong>{topCategory}</strong>
        <small>Highest category total</small>
      </article>
    </div>
  );
}

export default SummaryDashboard;
