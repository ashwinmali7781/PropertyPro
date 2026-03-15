import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setTokenFromOAuth, loadUser } from '../store/authSlice'

export default function OAuthSuccess() {
  const [params] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      dispatch(setTokenFromOAuth(token))
      dispatch(loadUser()).then(() => navigate('/'))
    } else {
      navigate('/login?error=oauth')
    }
  }, []) // eslint-disable-line

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}
