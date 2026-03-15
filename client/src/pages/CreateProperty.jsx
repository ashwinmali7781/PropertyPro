import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createProperty } from '../store/propertySlice'
import ImageUpload from '../components/ImageUpload'
import { CATEGORIES, AMENITIES } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function CreateProperty() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.properties)
  const [images, setImages] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm()

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])

  const onSubmit = async (data) => {
    const formData = new FormData()

    // Build nested JSON and append as 'data' field
    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      type: data.type,
      category: data.category,
      status: data.status,
      location: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || 'India',
        pincode: data.pincode,
      },
      features: {
        bedrooms: Number(data.bedrooms) || 0,
        bathrooms: Number(data.bathrooms) || 0,
        area: Number(data.area),
        parking: data.parking === 'true',
        furnished: data.furnished,
        amenities: selectedAmenities,
      },
      featured: data.featured === 'true',
    }

    formData.append('data', JSON.stringify(payload))
    images.forEach((img) => formData.append('images', img))

    const result = await dispatch(createProperty(formData))
    if (createProperty.fulfilled.match(result)) {
      toast.success('Property listed successfully!')
      navigate(`/properties/${result.payload._id}`)
    } else {
      toast.error(result.payload || 'Failed to create listing')
    }
  }

  const inputClass = (err) => `input-field ${err ? 'border-red-400' : ''}`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">List a Property</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to publish your property listing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Basic Information</h2>

          <div>
            <label className="label-text">Title *</label>
            <input placeholder="e.g. Luxury 3BHK Apartment in Baner" className={inputClass(errors.title)}
              {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Min 5 characters' } })} />
            {errors.title && <p className="err-msg">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-text">Description *</label>
            <textarea rows={4} placeholder="Describe your property in detail..." className={inputClass(errors.description)}
              {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Min 20 characters' } })} />
            {errors.description && <p className="err-msg">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Listing Type *</label>
              <select className={inputClass(errors.type)} {...register('type', { required: true })}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="label-text">Category *</label>
              <select className={inputClass(errors.category)} {...register('category', { required: true })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Price (₹) *</label>
              <input type="number" placeholder="e.g. 5000000" className={inputClass(errors.price)}
                {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be positive' } })} />
              {errors.price && <p className="err-msg">{errors.price.message}</p>}
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

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Location</h2>

          <div>
            <label className="label-text">Address *</label>
            <input placeholder="Street, Society, Area" className={inputClass(errors.address)}
              {...register('address', { required: 'Address is required' })} />
            {errors.address && <p className="err-msg">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">City *</label>
              <input placeholder="Pune" className={inputClass(errors.city)}
                {...register('city', { required: 'City is required' })} />
              {errors.city && <p className="err-msg">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label-text">State *</label>
              <input placeholder="Maharashtra" className={inputClass(errors.state)}
                {...register('state', { required: 'State is required' })} />
              {errors.state && <p className="err-msg">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Country</label>
              <input placeholder="India" className="input-field" defaultValue="India" {...register('country')} />
            </div>
            <div>
              <label className="label-text">PIN Code</label>
              <input placeholder="411001" className="input-field" {...register('pincode')} />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Features</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-text">Bedrooms</label>
              <input type="number" min="0" placeholder="0" className="input-field" {...register('bedrooms')} />
            </div>
            <div>
              <label className="label-text">Bathrooms</label>
              <input type="number" min="0" placeholder="0" className="input-field" {...register('bathrooms')} />
            </div>
            <div>
              <label className="label-text">Area (sqft) *</label>
              <input type="number" placeholder="1200" className={inputClass(errors.area)}
                {...register('area', { required: 'Area is required', min: { value: 1, message: 'Must be positive' } })} />
              {errors.area && <p className="err-msg">{errors.area.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Furnished Status</label>
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

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" value="true" {...register('featured')}
              className="w-4 h-4 accent-primary-600" />
            <label htmlFor="featured" className="text-sm text-gray-700 font-medium">Mark as Featured listing</label>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-gray-900 text-lg border-b pb-3">Property Images</h2>
          <ImageUpload images={images} onChange={setImages} />
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
