import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchProperties = createAsyncThunk(
  'properties/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/properties', { params })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch properties')
    }
  }
)

export const fetchFeatured = createAsyncThunk('properties/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/properties/featured')
    return data.properties
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchProperty = createAsyncThunk('properties/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/properties/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Property not found')
  }
})

export const createProperty = createAsyncThunk('properties/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.property
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create property')
  }
})

export const updateProperty = createAsyncThunk('properties/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.property
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update property')
  }
})

export const deleteProperty = createAsyncThunk('properties/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/properties/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete property')
  }
})

export const fetchMyProperties = createAsyncThunk('properties/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/properties/user/my-properties')
    return data.properties
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    list: [],
    featured: [],
    current: null,
    recommendations: [],
    myProperties: [],
    total: 0,
    pages: 1,
    page: 1,
    loading: false,
    error: null,
    filters: {
      keyword: '', type: '', category: '', city: '',
      minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '',
      furnished: '', parking: '', sort: '-createdAt',
    },
  },
  reducers: {
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload } },
    clearFilters(state) {
      state.filters = {
        keyword: '', type: '', category: '', city: '',
        minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '',
        furnished: '', parking: '', sort: '-createdAt',
      }
    },
    clearCurrent(state) { state.current = null },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.properties
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.page = action.payload.page
      })
      .addCase(fetchProperties.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload })

      .addCase(fetchProperty.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProperty.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.property
        state.recommendations = action.payload.recommendations
      })
      .addCase(fetchProperty.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createProperty.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
        state.myProperties.unshift(action.payload)
      })

      .addCase(updateProperty.fulfilled, (state, action) => {
        state.current = action.payload
        state.list = state.list.map((p) => p._id === action.payload._id ? action.payload : p)
        state.myProperties = state.myProperties.map((p) => p._id === action.payload._id ? action.payload : p)
      })

      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload)
        state.myProperties = state.myProperties.filter((p) => p._id !== action.payload)
      })

      .addCase(fetchMyProperties.fulfilled, (state, action) => { state.myProperties = action.payload })
  },
})

export const { setFilters, clearFilters, clearCurrent, clearError } = propertySlice.actions
export default propertySlice.reducer
