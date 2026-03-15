export const formatPrice = (price, type) => {
  if (type === 'rent') return `₹${price.toLocaleString('en-IN')}/mo`
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000)   return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date)
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30)  return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export const getCategoryIcon = (category) => {
  const icons = { apartment: '🏢', house: '🏠', villa: '🏡', office: '🏗️', land: '🌳', commercial: '🏪' }
  return icons[category] || '🏠'
}

export const CATEGORIES = ['apartment','house','villa','office','land','commercial']
export const AMENITIES   = ['Gym','Swimming Pool','Clubhouse','Power Backup','Security','Lift','Parking','Garden','Terrace','CCTV','WiFi','Intercom']
export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt',  label: 'Oldest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-views',     label: 'Most Viewed' },
]
