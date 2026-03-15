const seedProperties = [
  {
    title: 'Luxury 3BHK Apartment in Baner',
    description: 'Spacious 3BHK apartment with modern amenities in the heart of Baner. Features include a large balcony, modular kitchen, and 24/7 security.',
    price: 8500000, type: 'sale', category: 'apartment', status: 'available',
    location: { address: '12, Palm Grove Society, Baner Road', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
    features: { bedrooms: 3, bathrooms: 2, area: 1450, parking: true, furnished: 'semi-furnished', amenities: ['Gym', 'Swimming Pool', 'Clubhouse'] },
    images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', filename: 'apt1' }],
    featured: true,
  },
  {
    title: 'Modern Villa in Koregaon Park',
    description: 'Elegant 4BHK villa with private garden and premium finishes in the most sought-after locality of Pune.',
    price: 25000000, type: 'sale', category: 'villa', status: 'available',
    location: { address: '7, Rose Lane, Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    features: { bedrooms: 4, bathrooms: 4, area: 3200, parking: true, furnished: 'fully-furnished', amenities: ['Private Garden', 'Jacuzzi', 'Home Theater'] },
    images: [{ url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', filename: 'villa1' }],
    featured: true,
  },
  {
    title: '2BHK for Rent in Hinjewadi',
    description: 'Fully furnished 2BHK near IT hub in Hinjewadi. Ideal for IT professionals. Close to all major tech parks.',
    price: 25000, type: 'rent', category: 'apartment', status: 'available',
    location: { address: '45, Phase 1, Hinjewadi', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
    features: { bedrooms: 2, bathrooms: 2, area: 1100, parking: true, furnished: 'fully-furnished', amenities: ['Power Backup', 'Security', 'Lift'] },
    images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', filename: 'apt2' }],
    featured: false,
  },
  {
    title: 'Commercial Office in Viman Nagar',
    description: 'Prime commercial space ideal for startups with excellent connectivity.',
    price: 45000, type: 'rent', category: 'office', status: 'available',
    location: { address: 'Business Hub, Viman Nagar', city: 'Pune', state: 'Maharashtra', pincode: '411014' },
    features: { bedrooms: 0, bathrooms: 2, area: 2000, parking: true, furnished: 'semi-furnished', amenities: ['Conference Room', 'Cafeteria', '24x7 Access'] },
    images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', filename: 'office1' }],
    featured: false,
  },
  {
    title: 'Affordable 1BHK in Wakad',
    description: 'Compact and affordable 1BHK apartment perfect for bachelors and small families.',
    price: 3800000, type: 'sale', category: 'apartment', status: 'available',
    location: { address: 'Sunrise Society, Wakad', city: 'Pune', state: 'Maharashtra', pincode: '411057' },
    features: { bedrooms: 1, bathrooms: 1, area: 650, parking: false, furnished: 'unfurnished', amenities: ['Security', 'Lift'] },
    images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', filename: 'apt3' }],
    featured: false,
  },
];

module.exports = { seedProperties };
