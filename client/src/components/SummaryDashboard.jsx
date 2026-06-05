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

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, totalA], [, totalB]) => totalB - totalA
  );
  const topCategory = sortedCategories[0]?.[0] || "None";
  const maxCategoryTotal = Math.max(...Object.values(categoryTotals), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <section className="summary-section">
      <div className="stat-grid">
        <article className="stat-card stat-card-primary">
          <span>Total spent</span>
          <strong>{formatCurrency(totalSpent)}</strong>
          <small>Across {expenses.length} expenses</small>
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

      <div className="panel category-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Breakdown</p>
            <h2>Category totals</h2>
          </div>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="empty-state compact">No category data yet</div>
        ) : (
          <div className="category-list">
            {sortedCategories.map(([category, total]) => (
              <div className="category-item" key={category}>
                <div className="category-label">
                  <strong>{category}</strong>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max((total / maxCategoryTotal) * 100, 8)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SummaryDashboard;
