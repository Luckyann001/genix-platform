'use client'

import { useState } from 'react'

export function MarketplaceFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'All Templates', count: 124 },
    { value: 'saas', label: 'SaaS', count: 45 },
    { value: 'ecommerce', label: 'E-commerce', count: 32 },
    { value: 'portfolio', label: 'Portfolio', count: 28 },
    { value: 'landing', label: 'Landing Pages', count: 19 },
  ]

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-100', label: 'Under $100' },
    { value: '100-300', label: '$100 - $300' },
    { value: '300+', label: '$300+' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>

      {/* Use Case */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Use Case</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                selectedCategory === category.value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.label}</span>
              <span className="text-sm text-gray-500">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                priceRange === range.value
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Features</h4>
        <div className="space-y-2">
          {['Authentication', 'Database', 'Payments', 'Email', 'Dashboard'].map((feature) => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className="w-full btn btn-ghost text-sm">
        Reset Filters
      </button>
    </div>
  )
}
