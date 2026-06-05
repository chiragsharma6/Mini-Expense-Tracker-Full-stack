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
  const categoryTotals = expenses.reduce((acc, expense) => {
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
          "#6366f1",
          "#22c55e",
          "#f97316",
          "#ef4444",
          "#06b6d4",
        ],
      },
    ],
  };

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Expense Distribution</h2>
        </div>
      </div>

     <div style={{ maxWidth: "420px", margin: "0 auto" }}>
  <Pie data={data} />
</div>
    </div>
  );
}

export default ExpensePieChart;