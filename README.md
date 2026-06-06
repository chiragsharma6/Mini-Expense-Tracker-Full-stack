## 💸 EXPENDEE — Smart Personal Expense Tracker

A modern full-stack expense tracking application built using React and Node.js that helps users monitor daily spending, understand where their money goes, and make better financial decisions through visual insights and analytics.

Built as part of the Studio Graphene Full Stack Developer Assessment (Exercise 2 – Mini Expense Tracker).
---

## Live Demo Links

https://mini-expense-tracker-full-stack.vercel.app/

---

## Tech Stack

### Frontend

* **React.js** – Component-based UI development
* **Vite** – Fast development server and build tool
* **Axios** – API communication with backend
* **Chart.js** – Expense distribution pie chart visualization
* **CSS3** – Custom responsive styling

### Backend

* **Node.js** – Runtime environment
* **Express.js** – REST API development
* **CORS** – Cross-origin request handling

### Deployment

* **Vercel** – Frontend hosting
* **Render** – Backend hosting

### Why These Tools?

React provides reusable UI components, Express offers a lightweight backend for REST APIs, Axios simplifies API calls, and Recharts provides easy-to-read visual analytics for expenses.

---

## Features

### Implemented Features

* Add new expenses
* Edit existing expenses
* Delete expenses
* View all expenses
* Category filtering
* Date range filtering
* Dashboard summary cards
* Current month spending calculation
* Category-wise expense breakdown
* Expense distribution pie chart
* Currency switcher (₹, $, €, £)
* Form validation
* Responsive UI
* Full-stack deployment

---

## How to Run Locally Hosting 🚀

### Prerequisites

* Node.js installed

### 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd Expense-Tracker
```

### 2. Start Backend

```bash
cd server
npm install
npm start
```

Backend runs at:

```bash
http://localhost:5001
```

### 3. Start Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

## 📡 API Documentation

### Get All Expenses

**Method**

```http
GET /expenses
```

**Response**

```json
[
  {
    "id": "123",
    "amount": 500,
    "category": "Food",
    "date": "2026-06-05",
    "note": "Lunch"
  }
]
```

---

### Create Expense

**Method**

```http
POST /expenses
```

**Request Body**

```json
{
  "amount": 500,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Lunch"
}
```

**Response**

```json
{
  "id": "generated-id",
  "amount": 500,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Lunch"
}
```

---

### Update Expense

**Method**

```http
PUT /expenses/:id
```

**Request Body**

```json
{
  "amount": 700,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Dinner"
}
```

**Response**

```json
{
  "message": "Expense updated successfully"
}
```

---

### Delete Expense

**Method**

```http
DELETE /expenses/:id
```

**Response**

```json
{
  "message": "Expense deleted successfully"
}
```

---

## Project Structure

```text
Expense-Tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseFilters.jsx
│   │   │   ├── SummaryDashboard.jsx
│   │   │   └── ExpensePieChart.jsx
│   │   │
│   │   ├── services/
│   │   │   └── expenseService.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── data/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## What Works

* Expense CRUD operations
* Dashboard analytics
* Pie chart visualization
* Currency switching
* Filtering by category and date
* Responsive interface


---

## ⚠️ What Does Not Work

* Expenses are stored in memory / local data file instead of a production database
* Currency switching changes display currency only and does not perform real-time conversion rates
* No user authentication system


---

## Next Steps

🔮 Given more time, I would implement:

1. User authentication and personal accounts
2. MongoDB/PostgreSQL database integration
3. Real-time currency conversion APIs
4. Monthly budget goals and alerts
5. Dark mode support
6. Advanced analytics and spending trends
7. Recurring expense management
8. Expense search functionality


---

## 💡 Development Notes

This project was intentionally built as a lightweight full-stack application with a strong focus on:

Clean component structure
RESTful API design
Responsive UI
Maintainable code
Incremental Git commits
End-to-end functionality

Rather than adding unnecessary complexity, I focused on delivering a polished and fully working solution that satisfies the assessment requirements while providing a good user experience.

## Author

Chirag Sharma

