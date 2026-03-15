import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '../store/propertySlice'
import { CATEGORIES, SORT_OPTIONS } from '../utils/helpers'
import { FiSliders, FiX } from 'react-icons/fi'

export default function FilterSidebar({ onApply }) {
  const dispatch = useDispatch()
  const { filters } = useSelector((s) => s.properties)

  const update = (key, val) => dispatch(setFilters({ [key]: val }))

  const handleApply = () => {
    if (onApply) onApply()
  }

  const handleClear = () => {
    dispatch(clearFilters())
    if (onApply) onApply()
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FiSliders className="w-4 h-4" /> Filters
        </h3>
        <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
          <FiX className="w-3 h-3" /> Clear all
        </button>
      </div>

      {/* Sort */}
      <div>
        <label className="filter-label">Sort By</label>
        <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className="input-field text-sm">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="filter-label">Property Type</label>
        <div className="flex gap-2">
          {['', 'sale', 'rent'].map((t) => (
            <button key={t} onClick={() => update('type', t)}
              className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors
                ${filters.type === t ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
              {t === '' ? 'All' : t === 'sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="filter-label">Category</label>
        <select value={filters.category} onChange={(e) => update('category', e.target.value)} className="input-field text-sm">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="filter-label">City</label>
        <input value={filters.city} onChange={(e) => update('city', e.target.value)}
          placeholder="e.g. Pune" className="input-field text-sm" />
      </div>

      {/* Price Range */}
      <div>
        <label className="filter-label">Price Range</label>
        <div className="flex gap-2">
          <input type="number" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)}
            placeholder="Min" className="input-field text-sm" />
          <input type="number" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)}
            placeholder="Max" className="input-field text-sm" />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="filter-label">Min Bedrooms</label>
        <div className="flex gap-2">
          {['', '1', '2', '3', '4'].map((b) => (
            <button key={b} onClick={() => update('bedrooms', b)}
              className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors
                ${filters.bedrooms === b ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
              {b === '' ? 'Any' : b + '+'}
            </button>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <label className="filter-label">Furnished</label>
        <select value={filters.furnished} onChange={(e) => update('furnished', e.target.value)} className="input-field text-sm">
          <option value="">Any</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="fully-furnished">Fully Furnished</option>
        </select>
      </div>

      {/* Parking */}
      <div className="flex items-center gap-2">
        <input type="checkbox" id="parking" checked={filters.parking === 'true'}
          onChange={(e) => update('parking', e.target.checked ? 'true' : '')}
          className="w-4 h-4 accent-primary-600" />
        <label htmlFor="parking" className="text-sm text-gray-700">Parking Available</label>
      </div>

      <button onClick={handleApply} className="btn-primary w-full text-sm">Apply Filters</button>
    </aside>
  )
}
