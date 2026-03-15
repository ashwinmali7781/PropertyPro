import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

// Load user from token on app start
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data.user
  } catch (err) {
    localStorage.removeItem('token')
    return rejectWithValue(err.response?.data?.message || 'Session expired')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', formData)
    localStorage.setItem('token', data.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', formData)
    localStorage.setItem('token', data.token)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/me', formData)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const toggleSaveProperty = createAsyncThunk('auth/toggleSave', async (propertyId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/auth/save-property/${propertyId}`)
    return data.savedProperties
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError(state) { state.error = null },
    setTokenFromOAuth(state, action) {
      localStorage.setItem('token', action.payload)
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(loadUser.pending, pending)
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true
      })
      .addCase(loadUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, rejected)

      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })

      .addCase(toggleSaveProperty.fulfilled, (state, action) => {
        if (state.user) state.user.savedProperties = action.payload
      })
  },
})

export const { logout, clearError, setTokenFromOAuth } = authSlice.actions
export default authSlice.reducer
