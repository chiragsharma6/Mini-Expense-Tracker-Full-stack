const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

function ExpenseFilters({ filters, filteredCount, totalCount, onFilterChange, onClearFilters }) {
  const hasFilters = filters.category || filters.startDate || filters.endDate;

  return (
    <section className="panel filters-panel">
      <div className="section-heading filters-heading">
        <div>
          <p className="eyebrow">Filters</p>
          <h2>Find expenses</h2>
        </div>
        <span className="filter-result">
          {filteredCount} of {totalCount}
        </span>
      </div>

      <div className="filters-grid">
        <label>
          <span>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={onFilterChange}
            onInput={onFilterChange}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
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
