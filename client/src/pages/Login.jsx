// import { useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { useDispatch, useSelector } from 'react-redux'
// import { loginUser, clearError } from '../store/authSlice'
// import toast from 'react-hot-toast'
// import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
// import { useState } from 'react'

// export default function Login() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { loading, error } = useSelector((s) => s.auth)
//   const [showPw, setShowPw] = useState(false)

//   const { register, handleSubmit, formState: { errors } } = useForm()

//   useEffect(() => { dispatch(clearError()) }, [dispatch])

//   const onSubmit = async (data) => {
//     const result = await dispatch(loginUser(data))
//     if (loginUser.fulfilled.match(result)) {
//       toast.success('Welcome back!')
//       navigate('/')
//     } else {
//       toast.error(result.payload || 'Login failed')
//     }
//   }

//   const handleGoogleLogin = () => {
//     window.location.href = '/api/auth/google'
//   }

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="text-4xl mb-3">🏠</div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
//           <p className="text-gray-500 mt-1">Sign in to your PropertyPro account</p>
//         </div>

//         <div className="card p-8">
//           {/* Google OAuth */}
//           {/* <button onClick={handleGoogleLogin}
//             className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition-colors mb-6 text-sm font-medium text-gray-700">
//             <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
//             Continue with Google
//           </button>

//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
//             <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or sign in with email</span></div>
//           </div> */}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
//               <div className="relative">
//                 <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input type="email" placeholder="you@example.com"
//                   className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`}
//                   {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
//               </div>
//               {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
//               <div className="relative">
//                 <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
//                   className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
//                   {...register('password', { required: 'Password is required' })} />
//                 <button type="button" onClick={() => setShowPw(!showPw)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                   {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
//             </div>

//             {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">{error}</div>}

//             <button type="submit" disabled={loading} className="btn-primary w-full">
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-500 mt-6">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up free</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../store/authSlice'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => { dispatch(clearError()) }, [dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  const handleGithubLogin = () => {
    window.location.href = '/api/auth/github'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your PropertyPro account</p>
        </div>

        <div className="card p-8">
          {/* GitHub OAuth */}
          <button onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition-colors mb-6 text-sm font-medium text-gray-700">
            {/* GitHub SVG icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            {/* <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or sign in with email</span></div> */}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" placeholder="you@example.com"
                  className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', { required: 'Password is required' })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
