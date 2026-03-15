import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProperties, setFilters } from '../store/propertySlice'
import PropertyCard from '../components/PropertyCard'
import FilterSidebar from '../components/FilterSidebar'
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi'

export default function Properties() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { list, loading, total, pages, page, filters } = useSelector((s) => s.properties)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Sync URL params → filters on first load
  useEffect(() => {
    const urlFilters = {}
    searchParams.forEach((val, key) => { urlFilters[key] = val })
    if (Object.keys(urlFilters).length > 0) dispatch(setFilters(urlFilters))
  }, []) // eslint-disable-line

  // Fetch when filters or page changes
  useEffect(() => {
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    dispatch(fetchProperties({ ...clean, page: currentPage, limit: 12 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters, currentPage, dispatch])

  const handleApply = () => {
    setCurrentPage(1)
    setShowFilters(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? 'Loading...' : `${total} properties found`}
          </p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary flex items-center gap-2 text-sm">
          {showFilters ? <FiX className="w-4 h-4" /> : <FiFilter className="w-4 h-4" />}
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop always visible, mobile toggleable */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
          <FilterSidebar onApply={handleApply} />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-200 rounded-2xl" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">🏚️</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {list.map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
                    className="btn-secondary text-sm disabled:opacity-40">← Prev</button>

                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                        ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'}`}>
                      {i + 1}
                    </button>
                  ))}

                  <button disabled={currentPage === pages} onClick={() => setCurrentPage((p) => p + 1)}
                    className="btn-secondary text-sm disabled:opacity-40">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
