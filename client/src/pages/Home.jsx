import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatured } from '../store/propertySlice'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getCategoryIcon, CATEGORIES } from '../utils/helpers'
import { FiArrowRight, FiShield, FiStar, FiUsers } from 'react-icons/fi'

const STATS = [
  { icon: '🏠', value: '10,000+', label: 'Properties Listed' },
  { icon: '👥', value: '5,000+', label: 'Happy Clients' },
  { icon: '🏙️', value: '50+', label: 'Cities Covered' },
  { icon: '⭐', value: '4.9/5', label: 'Average Rating' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { featured, loading } = useSelector((s) => s.properties)

  useEffect(() => { dispatch(fetchFeatured()) }, [dispatch])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[580px] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center py-20">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            🏆 India's #1 Real Estate Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your <span className="text-accent-500">Dream</span><br />Property Today
          </h1>
          <p className="text-primary-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Browse thousands of verified listings. Buy, sell, or rent with complete confidence.
          </p>
          <SearchBar />
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {['Apartments', 'Villas', 'Offices', 'Land'].map((c) => (
              <Link key={c} to={`/properties?category=${c.toLowerCase()}`}
                className="text-primary-200 hover:text-white text-sm flex items-center gap-1 transition-colors">
                <FiArrowRight className="w-3 h-3" /> {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-500">Find properties that fit your lifestyle</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/properties?category=${cat}`}
              className="card p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-pointer">
              <div className="text-3xl mb-2">{getCategoryIcon(cat)}</div>
              <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-primary-600 transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Listings ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Properties</h2>
              <p className="text-gray-500">Handpicked listings just for you</p>
            </div>
            <Link to="/properties?featured=true"
              className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-200" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No featured properties yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/properties" className="btn-primary inline-flex items-center gap-2">
              Explore All Properties <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose PropertyPro?</h2>
          <p className="text-gray-500">We make property search simple, fast, and trustworthy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FiShield className="w-7 h-7" />, title: 'Verified Listings', desc: 'All properties are manually verified by our team to ensure accuracy and safety.' },
            { icon: <FiStar className="w-7 h-7" />, title: 'Best Properties', desc: 'Curated selection of top properties across residential, commercial and more.' },
            { icon: <FiUsers className="w-7 h-7" />, title: 'Expert Agents', desc: 'Connect directly with experienced local agents who understand the market.' },
          ].map((item) => (
            <div key={item.title} className="card p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to List Your Property?</h2>
          <p className="text-primary-200 mb-8">Reach thousands of verified buyers and renters. It's free to get started.</p>
          <Link to="/create-property" className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Post Your Property
          </Link>
        </div>
      </section>
    </div>
  )
}
