type FilterBarProps = {
  selectedCategory?: string
  query?: string
  categories?: string[]
}

export function FilterBar({ selectedCategory = 'all', query = '', categories = [] }: FilterBarProps) {
  return (
    <form className="card mb-6" method="GET" action="/templates">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={query}
            className="input"
            placeholder="Search templates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select name="category" defaultValue={selectedCategory} className="input">
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button type="submit" className="btn btn-primary w-full">
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  )
}
