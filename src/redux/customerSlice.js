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

// Fetch all customers
export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/customers");
      return res?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customers");
    }
  }
);

// Get a single customer by ID
export const getCustomerById = createAsyncThunk(
  "customer/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/customers/${id}`);
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer");
    }
  }
);

// Delete a customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (customerId, { rejectWithValue, dispatch }) => {
    try {
      await API.delete(`/api/customers/${customerId}`);
      dispatch(getCustomers()); // Refresh list after delete
      showToast("Customer successfully deleted!", "success");
      return customerId;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Create or update a customer
export const addEditCustomer = createAsyncThunk(
  "customer/addEditCustomer",
  async (customerData, { rejectWithValue, dispatch }) => {
    try {
      const { id, ...data } = customerData;
      const response = id
        ? await API.put(`/api/customers/${id}`, data) // Update
        : await API.post("/api/customers", data);   // Create

      dispatch(getCustomers()); // Refresh list after add/edit
      showToast(response.data.message || "Customer saved successfully!", "success");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save customer";
      showToast(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Slice Definition
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // Reducer to manually set the selected customer, useful for clearing the form
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all customers
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
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove from local state without refetching
        state.customers = state.customers.filter(c => c.id !== action.payload);
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
        state.selectedCustomer = null; // Reset form state
      })
      .addCase(addEditCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomer } = customerSlice.actions;

export default customerSlice.reducer;
