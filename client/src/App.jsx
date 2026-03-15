import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, setTokenFromOAuth } from './store/authSlice'
import { useLocation, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import CreateProperty from './pages/CreateProperty'
import EditProperty from './pages/EditProperty'
import Dashboard from './pages/Dashboard'
import OAuthSuccess from './pages/OAuthSuccess'
import NotFound from './pages/NotFound'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth)
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) dispatch(loadUser())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/login"             element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register"          element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/properties"        element={<Properties />} />
          <Route path="/properties/:id"    element={<PropertyDetail />} />
          <Route path="/oauth-success"     element={<OAuthSuccess />} />
          <Route path="/create-property"   element={<PrivateRoute><CreateProperty /></PrivateRoute>} />
          <Route path="/edit-property/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
          <Route path="/dashboard"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
