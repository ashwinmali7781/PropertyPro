import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span>🏠</span> PropertyPro
            </div>
            <p className="text-sm leading-relaxed">Find your dream property. Buy, sell, or rent with confidence.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties?type=sale" className="hover:text-white transition-colors">Properties for Sale</Link></li>
              <li><Link to="/properties?type=rent" className="hover:text-white transition-colors">Properties for Rent</Link></li>
              <li><Link to="/properties?featured=true" className="hover:text-white transition-colors">Featured Listings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 hello@propertypro.in</li>
              <li>📞 +91 7058731964</li>
              <li>📍 Kolhapur, Maharashtra</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          © {new Date().getFullYear()} PropertyPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
