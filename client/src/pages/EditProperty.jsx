import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { fetchProperty, updateProperty } from '../store/propertySlice'
import ImageUpload from '../components/ImageUpload'
import { CATEGORIES, AMENITIES } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function EditProperty() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: property, loading } = useSelector((s) => s.properties)
  const [newImages, setNewImages] = useState([])
  const [deleteImages, setDeleteImages] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    dispatch(fetchProperty(id))
  }, [id, dispatch])

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        price: property.price,
        type: property.type,
        category: property.category,
        status: property.status,
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        country: property.location.country,
        pincode: property.location.pincode,
        bedrooms: property.features.bedrooms,
        bathrooms: property.features.bathrooms,
        area: property.features.area,
        parking: String(property.features.parking),
        furnished: property.features.furnished,
      })
      setSelectedAmenities(property.features.amenities || [])
    }
  }, [property, reset])

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])

  const handleDeleteExisting = (filename) => {
    setDeleteImages((prev) => [...prev, filename])
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      type: data.type,
      category: data.category,
      status: data.status,
      location: { address: data.address, city: data.city, state: data.state, country: data.country, pincode: data.pincode },
      features: {
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        area: Number(data.area),
        parking: data.parking === 'true',
        furnished: data.furnished,
        amenities: selectedAmenities,
      },
      deleteImages,
    }

    formData.append('data', JSON.stringify(payload))
    newImages.forEach((img) => formData.append('images', img))

    const result = await dispatch(updateProperty({ id, formData }))
    if (updateProperty.fulfilled.match(result)) {
      toast.success('Property updated!')
      navigate(`/properties/${id}`)
    } else {
      toast.error(result.payload || 'Update failed')
    }
  }

  const existingImages = (property?.images || []).filter((img) => !deleteImages.includes(img.filename))

  if (!property) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-500 text-sm mt-1">Update your property listing details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Basic Information</h2>
          <div>
            <label className="label-text">Title *</label>
            <input className={`input-field ${errors.title ? 'border-red-400' : ''}`}
              {...register('title', { required: true, minLength: 5 })} />
          </div>
          <div>
            <label className="label-text">Description *</label>
            <textarea rows={4} className="input-field" {...register('description', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Listing Type</label>
              <select className="input-field" {...register('type')}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="label-text">Category</label>
              <select className="input-field" {...register('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Price (₹) *</label>
              <input type="number" className="input-field" {...register('price', { required: true })} />
            </div>
            <div>
              <label className="label-text">Status</label>
              <select className="input-field" {...register('status')}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Location</h2>
          <div>
            <label className="label-text">Address *</label>
            <input className="input-field" {...register('address', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">City *</label><input className="input-field" {...register('city', { required: true })} /></div>
            <div><label className="label-text">State *</label><input className="input-field" {...register('state', { required: true })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Country</label><input className="input-field" {...register('country')} /></div>
            <div><label className="label-text">PIN Code</label><input className="input-field" {...register('pincode')} /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Features</h2>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-text">Bedrooms</label><input type="number" min="0" className="input-field" {...register('bedrooms')} /></div>
            <div><label className="label-text">Bathrooms</label><input type="number" min="0" className="input-field" {...register('bathrooms')} /></div>
            <div><label className="label-text">Area (sqft) *</label><input type="number" className="input-field" {...register('area', { required: true })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Furnished</label>
              <select className="input-field" {...register('furnished')}>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="fully-furnished">Fully Furnished</option>
              </select>
            </div>
            <div>
              <label className="label-text">Parking</label>
              <select className="input-field" {...register('parking')}>
                <option value="false">No Parking</option>
                <option value="true">Parking Available</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-text">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AMENITIES.map((a) => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors
                    ${selectedAmenities.includes(a) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Property Images</h2>
          <ImageUpload images={newImages} onChange={setNewImages}
            existingImages={existingImages} onDeleteExisting={handleDeleteExisting} />
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
