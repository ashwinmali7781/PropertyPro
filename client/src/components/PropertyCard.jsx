import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSaveProperty } from '../store/authSlice'
import { formatPrice, timeAgo } from '../utils/helpers'
import { FiHeart, FiMapPin, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function PropertyCard({ property }) {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const isSaved = user?.savedProperties?.includes(property._id)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to save properties'); return }
    await dispatch(toggleSaveProperty(property._id))
    toast.success(isSaved ? 'Removed from saved' : 'Property saved!')
  }

  const img = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'

  return (
    <Link to={`/properties/${property._id}`} className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img src={img} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge text-white font-semibold ${property.type === 'sale' ? 'bg-primary-600' : 'bg-emerald-500'}`}>
            For {property.type === 'sale' ? 'Sale' : 'Rent'}
          </span>
          {property.featured && (
            <span className="badge bg-accent-500 text-white">⭐ Featured</span>
          )}
        </div>

        <button onClick={handleSave}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors
            ${isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}>
          <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {property.status !== 'available' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-gray-800 text-white text-sm px-4 py-1.5 uppercase tracking-wider">
              {property.status}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <FiMapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.location.address}, {property.location.city}</span>
        </div>

        {/* Features — using emoji to avoid icon version issues */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
          {property.features.bedrooms > 0 && (
            <span className="flex items-center gap-1">🛏️ {property.features.bedrooms} Bed</span>
          )}
          {property.features.bathrooms > 0 && (
            <span className="flex items-center gap-1">🚿 {property.features.bathrooms} Bath</span>
          )}
          <span className="flex items-center gap-1">📐 {property.features.area} sqft</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-primary-700 font-bold text-lg">
            {formatPrice(property.price, property.type)}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <FiEye className="w-3 h-3" />{property.views}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src={property.owner?.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-xs text-gray-500">{property.owner?.name}</span>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(property.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
