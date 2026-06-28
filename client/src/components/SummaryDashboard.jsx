function SummaryDashboard({ expenses, currency = "INR" }) {
  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const netSavings = Math.max(0, netBalance);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

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
    <div className="stat-grid">
      <article className="stat-card stat-card-primary" style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}>
        <span>Total Income</span>
        <strong style={{ color: "#ffffff" }}>{formatCurrency(totalIncome)}</strong>
        <small style={{ color: "rgba(255, 255, 255, 0.85)" }}>
          Total recorded earnings
        </small>
      </article>
      <article className="stat-card">
        <span>Total Expense</span>
        <strong style={{ color: "var(--rose)" }}>{formatCurrency(totalExpense)}</strong>
        <small>Total recorded spending</small>
      </article>
      <article className="stat-card">
        <span>Net Balance</span>
        <strong style={{ color: netBalance >= 0 ? "var(--accent)" : "var(--rose)" }}>
          {formatCurrency(netBalance)}
        </strong>
        <small>Income minus Expense</small>
      </article>
      <article className="stat-card">
        <span>Net Savings</span>
        <strong style={{ color: "var(--accent-strong)" }}>
          {formatCurrency(netSavings)}
        </strong>
        <small>{savingsRate}% savings rate</small>
      </article>
    </div>
  );
}

export default SummaryDashboard;
