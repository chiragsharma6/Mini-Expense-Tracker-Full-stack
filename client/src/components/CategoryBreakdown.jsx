function CategoryBreakdown({ expenses, currency = "INR" }) {
  const categoryTotals = expenses.reduce((totals, expense) => {
    const category = expense.category;
    totals[category] = (totals[category] || 0) + Number(expense.amount);
    return totals;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, totalA], [, totalB]) => totalB - totalA
  );
  const maxCategoryTotal = Math.max(...Object.values(categoryTotals), 0);

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

  return (
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
  );
}

export default CategoryBreakdown;
