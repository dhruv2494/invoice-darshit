import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../services/api';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  dashboardData: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await API.put('/api/profile', profileData);
    thunkAPI.dispatch(updateProfileInRedux(profileData));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

export const updatePassword = createAsyncThunk('profile/updatePassword', async (passwordData, thunkAPI) => {
  try {
    const response = await API.post('/api/profile/update-password', passwordData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update password');
  }
});
export const getDashboardData = createAsyncThunk('profile/getDashboardData', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/dashboard');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
});
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.dashboardData = null;
    },
    updateProfileInRedux: (state, action) => {
      state.profile = {...state.profile, ...action.payload};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data[0]||null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        // state.profile = action.payload?.data
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Dashboard Data
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload?.data;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearProfile ,updateProfileInRedux} = profileSlice.actions;
export default profileSlice.reducer;

