import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpensePieChart({ expenses }) {
  const expenseOnly = expenses.filter((item) => item.type === "expense");
  const categoryTotals = expenseOnly.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + Number(expense.amount);

    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),

    datasets: [
      {
        data: Object.values(categoryTotals),

        backgroundColor: [
          "#2563eb", // Sapphire Blue
          "#d97706", // Amber Gold
          "#7c3aed", // Royal Purple
          "#0891b2", // Ocean Cyan
          "#4f46e5", // Electric Indigo
        ],
      },
    ],
  };

  if (expenses.length === 0) {
    return (
      <div className="panel chart-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Insights</p>
            <h2>Expense Distribution</h2>
          </div>
        </div>
        <div className="empty-state compact" style={{ minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <strong>No expense data yet</strong>
          <span>Add some transactions to see your spending breakdown.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Expense Distribution</h2>
        </div>
      </div>

      <div style={{ maxWidth: "420px", margin: "0 auto", padding: "12px 0" }}>
        <Pie data={data} />
      </div>
    </div>
  );
}

export default ExpensePieChart;