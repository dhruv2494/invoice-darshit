import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

// ✅ Initial State
const initialState = {
  customers: [],
  loading: false,
  error: null,
};

// ✅ Thunks

// Fetch customers
export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/customercrud/get");
      return res?.data?.list;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch customers");
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (sCustGUID, { rejectWithValue, dispatch }) => {
    try {
      await API.delete(`/customercrud/delete/${sCustGUID}`);
      // Refresh list after delete
      dispatch(getCustomers());
      return sCustGUID;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

// Add or edit customer
export const addEditCustomer = createAsyncThunk(
  "customer/addEditCustomer",
  async (customerData, { rejectWithValue, dispatch }) => {
    try {
      await API.post("/customercrud/add-update", customerData);
      // Refresh list after add/edit
      dispatch(getCustomers());
    } catch (error) {
      return rejectWithValue(error.response?.data || "Add/Edit failed");
    }
  }
);

// ✅ Slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get customers
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
        state.loading = false;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add/Edit customer
      .addCase(addEditCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditCustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addEditCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
