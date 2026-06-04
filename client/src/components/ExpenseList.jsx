import { deleteExpense } from "../services/expenseService";

function ExpenseList({ expenses, onExpenseDeleted }) {
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);

      onExpenseDeleted();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              ₹{expense.amount} | {expense.category} | {expense.date} | {expense.note}

              <button
                onClick={() => handleDelete(expense.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;