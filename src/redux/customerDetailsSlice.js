import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { showToast } from "../modules/utils";

// ✅ Initial State
const initialState = {
  customers: [],
  purchaseOrders: [],
  invoices: [],
  loading: false,
  error: null,
};

// ✅ Thunks

// Fetch customers
export const getCustomersFromDetails = createAsyncThunk(
  "customer/getCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/customercrud/get");
      return res?.data?.list;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch customers"
      );
    }
  }
);

// Fetch purchase orders with customerId
export const getPurchaseOrdersFromDetails = createAsyncThunk(
  "purchaseOrderFromDetails/getAll",
  async (customerId, { rejectWithValue }) => {
    // Receive customerId here
    try {
      const response = await API.get("/customer-details/get-purchase-order", { params: { customerId } }); // Send customerId as query param
      return response.data?.list || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch purchase orders"
      );
    }
  }
);

// Fetch invoices with customerId
export const getInvoicesFromDetails = createAsyncThunk(
  "invoiceFromDetails/getAll",
  async (customerId, { rejectWithValue }) => {
    // Receive customerId here
    try {
      const response = await API.get("/customer-details/get-invoices", {
        params: { customerId },
      }); // Send customerId as query param
      return response?.data?.list || []; // Default empty array if no data
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch invoices");
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
      dispatch(getCustomersFromDetails());
      showToast("Customer successfully deleted!", 1);
      return sCustGUID;
    } catch (err) {
      showToast("Error while deleting customer", 2);
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
      dispatch(getCustomersFromDetails());
      showToast("Customer successfully added/updated!", 1);
    } catch (error) {
      showToast("Error while adding/updating customer", 2);
      return rejectWithValue(error.response?.data || "Add/Edit failed");
    }
  }
);

// ✅ Helper function to handle async thunk states (pending, fulfilled, rejected)
const handleAsyncThunkState = (builder, actionType, onFulfilled) => {
  builder
    .addCase(actionType.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actionType.fulfilled, (state, action) => {
      onFulfilled(state, action);
      state.loading = false;
    })
    .addCase(actionType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};

// ✅ Slice
const customerDetailsSlice = createSlice({
  name: "customerDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Use the helper for customers
    handleAsyncThunkState(builder, getCustomersFromDetails, (state, action) => {
      state.customers = action.payload;
    });

    // Use the helper for purchase orders
    handleAsyncThunkState(
      builder,
      getPurchaseOrdersFromDetails,
      (state, action) => {
        state.purchaseOrders = [...(action.payload || [])].map((po) => ({
          ...po,
          status: po.status || "Pending", // Set default status if empty
        }));
      }
    );

    // Use the helper for invoices
    handleAsyncThunkState(builder, getInvoicesFromDetails, (state, action) => {
      state.invoices = action.payload;
    });

    // Handle delete customer
    builder
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
      });

    // Handle add/edit customer
    builder
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

export default customerDetailsSlice.reducer;
