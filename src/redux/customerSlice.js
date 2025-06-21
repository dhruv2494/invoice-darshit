import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { showToast } from "../modules/utils";

// ✅ Initial State
const initialState = {
  customers: [],
  selectedCustomer: null,
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

// Get customer by ID
export const getCustomerById = createAsyncThunk(
  "customer/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/customercrud/get/${id}`);
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch customer");
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
      showToast("Customer successfully deleted!",1)
      return sCustGUID;
    } catch (err) {
      showToast("Error while delete Customer",2)
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
      showToast("Customer successfully added/updated!",1)
    } catch (error) {
      showToast("Error While added/updated Customer",2)
      return rejectWithValue(error.response?.data || "Add/Edit failed");
    }
  }
);

// Slice
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
        state.loading = false;
        state.customers = action.payload || [];
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get customer by ID
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload || null;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
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
        state.selectedCustomer = null; // Reset selected customer after successful save
      })
      .addCase(addEditCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
