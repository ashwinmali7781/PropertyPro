import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiMapPin } from 'react-icons/fi'

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState('')
  const [city, setCity] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (type) params.set('type', type)
    if (city) params.set('city', city)
    navigate(`/properties?${params.toString()}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search properties..." className="input-field pl-9 text-sm" />
        </div>
        <button type="submit" className="btn-primary text-sm">Search</button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-4 items-end max-w-4xl mx-auto">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Keyword</label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Villa, apartment, office..." className="input-field pl-9" />
        </div>
      </div>

      <div className="w-full md:w-44">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
          <option value="">Buy or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">City</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="Pune, Mumbai, Delhi..." className="input-field pl-9" />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full md:w-auto px-8 py-2.5 text-base">
        Search
      </button>
    </form>
  )
}
