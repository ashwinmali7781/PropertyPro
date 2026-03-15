import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProperty, deleteProperty, clearCurrent } from '../store/propertySlice'
import { toggleSaveProperty } from '../store/authSlice'
import PropertyCard from '../components/PropertyCard'
import { formatPrice, timeAgo } from '../utils/helpers'
import { FiHeart, FiMapPin, FiEye, FiEdit2, FiTrash2, FiPhone, FiMail, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function PropertyDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: property, recommendations, loading } = useSelector((s) => s.properties)
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [imgIdx, setImgIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchProperty(id))
    return () => dispatch(clearCurrent())
  }, [id, dispatch])

  const isSaved = user?.savedProperties?.includes(id)
  const isOwner = user?._id === property?.owner?._id

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save'); return }
    await dispatch(toggleSaveProperty(id))
    toast.success(isSaved ? 'Removed from saved' : 'Saved!')
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return
    setDeleting(true)
    const result = await dispatch(deleteProperty(id))
    if (deleteProperty.fulfilled.match(result)) {
      toast.success('Property deleted')
      navigate('/dashboard')
    } else {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  if (loading || !property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-96 bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    )
  }

  const images = property.images || []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FiChevronLeft className="w-4 h-4" /> Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Image gallery */}
          <div className="card overflow-hidden">
            <div className="relative h-72 md:h-96 bg-gray-100">
              {images.length > 0 ? (
                <>
                  <img src={images[imgIdx]?.url} alt={property.title}
                    className="w-full h-full object-cover" />
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button key={i} onClick={() => setImgIdx(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-5xl">🏠</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors
                      ${i === imgIdx ? 'border-primary-500' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex gap-2 flex-wrap">
                <span className={`badge text-white ${property.type === 'sale' ? 'bg-primary-600' : 'bg-emerald-500'}`}>
                  For {property.type === 'sale' ? 'Sale' : 'Rent'}
                </span>
                <span className="badge bg-gray-100 text-gray-600 capitalize">{property.category}</span>
                <span className={`badge capitalize ${
                  property.status === 'available' ? 'bg-green-100 text-green-700' :
                  property.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>{property.status}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <FiEye className="w-3.5 h-3.5" /> {property.views} views
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>

            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
              <FiMapPin className="w-4 h-4" />
              {property.location.address}, {property.location.city}, {property.location.state}
            </div>

            <div className="text-3xl font-bold text-primary-700 mb-6">
              {formatPrice(property.price, property.type)}
            </div>

            {/* Feature chips — using emoji instead of broken icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {property.features.bedrooms > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                  <span className="text-lg">🛏️</span>
                  <div><div className="font-semibold text-sm">{property.features.bedrooms}</div><div className="text-xs text-gray-500">Bedrooms</div></div>
                </div>
              )}
              {property.features.bathrooms > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                  <span className="text-lg">🚿</span>
                  <div><div className="font-semibold text-sm">{property.features.bathrooms}</div><div className="text-xs text-gray-500">Bathrooms</div></div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <span className="text-lg">📐</span>
                <div><div className="font-semibold text-sm">{property.features.area}</div><div className="text-xs text-gray-500">Sq. Ft.</div></div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <span className="text-lg">🚗</span>
                <div><div className="font-semibold text-sm capitalize">{property.features.furnished}</div><div className="text-xs text-gray-500">Furnished</div></div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.features.amenities?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-2xl font-bold text-primary-700 mb-4">
              {formatPrice(property.price, property.type)}
            </div>
            <button onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm mb-3 transition-colors border
                ${isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-300'}`}>
              <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save Property'}
            </button>

            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/edit-property/${property._id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-lg py-2 text-sm font-medium hover:bg-primary-100 transition-colors">
                  <FiEdit2 className="w-3.5 h-3.5" /> Edit
                </Link>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg py-2 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
                  <FiTrash2 className="w-3.5 h-3.5" /> {deleting ? '...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {/* Agent card */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Listed By</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={property.owner?.avatar} alt={property.owner?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
              <div>
                <div className="font-semibold text-gray-900 text-sm">{property.owner?.name}</div>
                <div className="text-xs text-gray-500">Member since {new Date(property.owner?.createdAt).getFullYear()}</div>
              </div>
            </div>
            {property.owner?.phone && (
              <a href={`tel:${property.owner.phone}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 mb-2 transition-colors">
                <FiPhone className="w-4 h-4" /> {property.owner.phone}
              </a>
            )}
            {property.owner?.email && (
              <a href={`mailto:${property.owner.email}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors">
                <FiMail className="w-4 h-4" /> {property.owner.email}
              </a>
            )}
          </div>

          {/* Location */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiMapPin className="w-4 h-4" /> Location
            </h3>
            <p className="text-sm text-gray-600">{property.location.address}</p>
            <p className="text-sm text-gray-600">{property.location.city}, {property.location.state}</p>
            {property.location.pincode && <p className="text-sm text-gray-500">PIN: {property.location.pincode}</p>}
          </div>

          <div className="text-xs text-gray-400 px-1">
            Listed {timeAgo(property.createdAt)}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
