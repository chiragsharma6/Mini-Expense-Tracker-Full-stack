const allCategories = [
  "Food", "Transport", "Bills", "Entertainment", "Other",
  "Salary", "Freelancing", "Bonus", "Investment"
];

function ExpenseFilters({ filters, filteredCount, totalCount, onFilterChange, onClearFilters }) {
  const hasFilters = filters.type || filters.category || filters.startDate || filters.endDate;

  return (
    <section className="panel filters-panel">
      <div className="section-heading filters-heading">
        <div>
          <p className="eyebrow">Filters</p>
          <h2>Find transactions</h2>
        </div>
        <span className="filter-result">
          {filteredCount} of {totalCount}
        </span>
      </div>

      <div className="filters-grid">
        <label>
          <span>Type</span>
          <select
            name="type"
            value={filters.type || ""}
            onChange={onFilterChange}
            onInput={onFilterChange}
          >
            <option value="">All types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          <span>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={onFilterChange}
            onInput={onFilterChange}
          >
            <option value="">All categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>From</span>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            onInput={onFilterChange}
          />
        </label>

        <label>
          <span>To</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            onInput={onFilterChange}
          />
        </label>

        <button
          className="secondary-button clear-filter-button"
          disabled={!hasFilters}
          onClick={onClearFilters}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="filters-illustration-container">
        <img
          src="/mockup.png"
          alt="Mockup of EXPENDEE on smartphone and laptop"
          className="filters-illustration"
        />
      </div>
    </section>
  );
}

export default ExpenseFilters;
