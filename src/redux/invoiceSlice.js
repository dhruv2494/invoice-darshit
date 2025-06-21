// src/redux/features/invoice/invoiceSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"; // Reusing the same API instance as in purchaseOrderSlice
import { showToast } from "../modules/utils";

// Async thunk to fetch all completed purchase orders
export const getCompletedPurchaseOrder = createAsyncThunk(
  "invoice/getCompleted",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/po/get-completed-purchase-orders");
      return response?.data?.list || []; // Ensure default value if response is empty
    } catch (error) {
      return rejectWithValue(error.message); // Capture error
    }
  }
);

// Async thunk to fetch paginated invoices
export const getInvoices = createAsyncThunk(
  "invoice/getAll",
  async ({ page = 1, pageSize = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await API.get("/invoice/Get", {
        params: {
          page,
          pageSize,
          ...filters
        }
      });
      return {
        data: response?.data?.list || [],
        total: response?.data?.total || 0,
        page,
        pageSize
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getInvoicesByCustomer = createAsyncThunk(
  "invoice/getByCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/invoice/customer/${customerId}`);
      return response?.data?.list || [];
    } catch (error) {
      console.error(`Error fetching invoices for customer ${customerId}:`, error);
      return rejectWithValue(error.response?.data || "Failed to fetch customer's invoices");
    }
  }
);

// Async thunk to add or edit invoices
export const addEditInvoices = createAsyncThunk(
  "invoice/addEdit",
  async (order, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.post("/invoice/AddUpdate", order);
      // After the API call, refresh the invoice list
      dispatch(getInvoices());
      showToast("Invoice successfully added/updated!", 1);

      return response.data;
    } catch (error) {
      showToast("Error While add/update! Invoice", 1);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInvoices = createAsyncThunk(
  "invoice/delete",
  async (uuid, { dispatch }) => {
    try {
      await API.delete(`/invoice/Delete/${uuid}`);
      // After the API call, we dispatch getPurchaseOrders to refresh the list
      dispatch(getInvoices());
      showToast("Invoice successfully deleted!",1);

      return uuid;
    } catch (error) {
      console.log(error);
      showToast("error while delete Invoice",2);
    }
  }
);

// Initial state
const initialState = {
  completedPurchaseOrders: [],
  invoices: [],
  customerInvoices: [],
  loading: false,
  loadingList: false,
  error: null,
  selectedInvoice: null,
  status: ["draft", "pending", "paid", "overdue", "cancelled"],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1
  },
  filters: {
    status: "",
    dateRange: {
      from: "",
      to: ""
    },
    search: ""
  },
  lastFetched: null
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {}, // No additional reducers needed here
  extraReducers: (builder) => {
    // Get completed purchase orders
    builder.addCase(getCompletedPurchaseOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCompletedPurchaseOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.completedPurchaseOrders = action.payload;
    });
    builder.addCase(getCompletedPurchaseOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get all invoices
    builder.addCase(getInvoices.pending, (state) => {
      state.loadingList = true;
      state.error = null;
    });
    builder.addCase(getInvoices.fulfilled, (state, action) => {
      state.loadingList = false;
      state.invoices = action.payload.data;
      state.pagination = {
        currentPage: action.payload.page,
        pageSize: action.payload.pageSize,
        totalItems: action.payload.total,
        totalPages: Math.ceil(action.payload.total / action.payload.pageSize)
      };
      state.error = null;
      state.lastFetched = new Date().toISOString();
    });
    builder.addCase(getInvoices.rejected, (state, action) => {
      state.loadingList = false;
      state.error = action.payload;
    });

    // Get invoices by customer
    builder.addCase(getInvoicesByCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getInvoicesByCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.customerInvoices = action.payload;
    });
    builder.addCase(getInvoicesByCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add/Edit invoice
    builder.addCase(addEditInvoices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addEditInvoices.fulfilled, (state, action) => {
      state.loading = false;
      // Update the invoice in the list if it exists, otherwise add it
      const index = state.invoices.findIndex(
        (invoice) => invoice.uuid === action.payload.uuid
      );
      if (index !== -1) {
        state.invoices[index] = action.payload;
      } else {
        state.invoices.push(action.payload);
      }
    });
    builder.addCase(addEditInvoices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Selectors
export const selectAllInvoices = (state) => state.invoice.invoices || [];
export const selectCustomerInvoices = (state) => state.invoice.customerInvoices;
export const selectLoading = (state) => state.invoice.loading;
export const selectError = (state) => state.invoice.error;

export default invoiceSlice.reducer;
