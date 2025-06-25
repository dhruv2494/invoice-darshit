import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API from '../services/api';

const initialState = {
  invoices: [],
  invoice: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/invoices');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices');
  }
});

export const fetchInvoiceById = createAsyncThunk('invoices/fetchInvoiceById', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice');
  }
});

export const createInvoice = createAsyncThunk('invoices/createInvoice', async (invoiceData, thunkAPI) => {
  try {
    const response = await API.post('/api/invoices', invoiceData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
  }
});

export const updateInvoice = createAsyncThunk('invoices/updateInvoice', async ({ id, invoiceData }, thunkAPI) => {
  try {
    const response = await API.put(`/api/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update invoice');
  }
});

export const deleteInvoice = createAsyncThunk('invoices/deleteInvoice', async (id, thunkAPI) => {
  try {
    await API.delete(`/api/invoices/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete invoice');
  }
});

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearInvoice: (state) => {
      state.invoice = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload?.data
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.map((inv) => (inv.id === action.payload.id ? action.payload : inv));
        if (state.invoice && state.invoice.id === action.payload.id) {
          state.invoice = action.payload;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter((inv) => inv.id !== action.payload);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;

