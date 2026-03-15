import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyProperties, deleteProperty } from '../store/propertySlice'
import { updateProfile } from '../store/authSlice'
import { useForm } from 'react-hook-form'
import { formatPrice, timeAgo } from '../utils/helpers'
import { FiEdit2, FiTrash2, FiPlus, FiUser, FiHome, FiHeart, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const TABS = ['My Listings', 'Saved Properties', 'Profile']

export default function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { myProperties, loading } = useSelector((s) => s.properties)
  const [tab, setTab] = useState(0)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    dispatch(fetchMyProperties())
  }, [dispatch])

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone || '' })
  }, [user, reset])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    const result = await dispatch(deleteProperty(id))
    if (deleteProperty.fulfilled.match(result)) toast.success('Deleted!')
    else toast.error('Failed to delete')
  }

  const onProfileSave = async (data) => {
    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) toast.success('Profile updated!')
    else toast.error('Update failed')
  }

  const stats = [
    { icon: <FiHome />, label: 'My Listings', value: myProperties.length, color: 'bg-blue-50 text-blue-600' },
    { icon: <FiHeart />, label: 'Saved', value: user?.savedProperties?.length || 0, color: 'bg-red-50 text-red-600' },
    { icon: <FiEye />, label: 'Total Views', value: myProperties.reduce((s, p) => s + p.views, 0), color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img src={user?.avatar} alt={user?.name}
            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <Link to="/create-property" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${tab === i ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* My Listings */}
      {tab === 0 && (
        <div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-gray-200" />)}</div>
          ) : myProperties.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🏚️</span>
              <p className="text-gray-600 mt-3 font-medium">No listings yet</p>
              <Link to="/create-property" className="btn-primary inline-block mt-4 text-sm">Post First Property</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProperties.map((p) => (
                <div key={p._id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                    alt={p.title} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/properties/${p._id}`} className="font-semibold text-gray-900 text-sm hover:text-primary-600 line-clamp-1 transition-colors">
                      {p.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{p.location.city}, {p.location.state}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-primary-700 font-semibold text-sm">{formatPrice(p.price, p.type)}</span>
                      <span className={`badge text-xs ${p.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiEye className="w-3 h-3" />{p.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/edit-property/${p._id}`}
                      className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors">
                      <FiEdit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p._id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0 hidden md:block">{timeAgo(p.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Properties */}
      {tab === 1 && (
        <div>
          {!user?.savedProperties?.length ? (
            <div className="text-center py-16">
              <span className="text-5xl">❤️</span>
              <p className="text-gray-600 mt-3 font-medium">No saved properties</p>
              <Link to="/properties" className="btn-primary inline-block mt-4 text-sm">Browse Properties</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {user.savedProperties.map((p) =>
                typeof p === 'object' ? (
                  <div key={p._id} className="card p-4 flex items-center gap-3">
                    <img src={p.images?.[0]?.url} alt={p.title} className="w-16 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <Link to={`/properties/${p._id}`} className="font-medium text-sm text-gray-900 hover:text-primary-600 line-clamp-1">{p.title}</Link>
                      <p className="text-xs text-gray-500">{p.location?.city}</p>
                      <p className="text-sm font-semibold text-primary-700 mt-0.5">{formatPrice(p.price, p.type)}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === 2 && (
        <div className="max-w-lg">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <img src={user?.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-gray-100" />
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="badge bg-primary-100 text-primary-700 capitalize mt-1">{user?.role}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
              <div>
                <label className="label-text">Full Name</label>
                <input className="input-field" {...register('name', { required: true })} />
              </div>
              <div>
                <label className="label-text">Phone</label>
                <input className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
              </div>
              <div>
                <label className="label-text">Avatar URL</label>
                <input className="input-field" placeholder="https://..." {...register('avatar')} />
              </div>
              <button type="submit" className="btn-primary w-full">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
