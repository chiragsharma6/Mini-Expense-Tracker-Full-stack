import axios from "axios";


// const isLocal = typeof window !== "undefined" && (
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1" ||
//   window.location.port === "5173" ||
//   window.location.port === "5174"
// );

// const API_URL = isLocal
//   ? "http://localhost:5001/expenses"
//   : "https://mini-expense-tracker-full-stack.onrender.com/expenses";

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const incomeCategories = ["Salary", "Freelancing", "Bonus", "Investment"];

const normalizeExpense = (item) => {
  if (!item) return item;
  let type = item.type;
  if (type !== "income" && type !== "expense") {
    if (incomeCategories.includes(item.category)) {
      type = "income";
    } else {
      type = "expense";
    }
  }
  const id = item.id || item._id;
  return { ...item, type, id };
};


export const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    if (Array.isArray(response.data)) {
      return response.data.map(normalizeExpense);
    }
    return [];
  } catch (err) {
    console.error("Error fetching expenses from API:", err);
    throw err;
  }
};

export const addExpense = async (expenseData) => {
  const payload = normalizeExpense(expenseData);
  try {
    const response = await axios.post(API_URL, payload, getAuthConfig());
    return normalizeExpense(response.data || payload);
  } catch (err) {
    console.error("Error adding expense:", err);
    throw err;
  }
};

export const updateExpense = async (id, expenseData) => {
  const payload = normalizeExpense(expenseData);
  try {
    const response = await axios.put(`${API_URL}/${id}`, payload, getAuthConfig());
    return normalizeExpense(response.data || payload);
  } catch (err) {
    console.error("Error updating expense:", err);
    throw err;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (err) {
    console.error("Error deleting expense:", err);
    throw err;
  }
};

export const getBudgets = async () => {
  try {
    const response = await axios.get(`${API_URL}/budgets`, getAuthConfig());
    return response.data;
  } catch (err) {
    return { Food: 6000, Transport: 3000, Bills: 5000, Entertainment: 2500, Other: 2000 };
  }
};

export const updateBudgets = async (budgetData) => {
  try {
    const response = await axios.post(`${API_URL}/budgets`, budgetData, getAuthConfig());
    return response.data;
  } catch (err) {
    console.error("Error saving budgets:", err);
    throw err;
  }
};
