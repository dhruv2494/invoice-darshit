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

// Async thunk to fetch all invoices
export const getInvoices = createAsyncThunk(
  "invoice/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/invoice/Get");
      return response?.data?.list || []; // Default empty array if no data
    } catch (error) {
      return rejectWithValue(error.message);
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

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    completedPurchaseOrder: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No additional reducers needed here
  extraReducers: (builder) => {
    builder
      // Handle fetching completed purchase orders
      .addCase(getCompletedPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompletedPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.completedPurchaseOrder = action.payload;
      })
      .addCase(getCompletedPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Handle error properly
      })

      // Handle fetching invoices
      .addCase(getInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handle adding or editing an invoice
      .addCase(addEditInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEditInvoices.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure the updated invoice is in the list (or push it if new)
        const index = state.invoices.findIndex(
          (invoice) => invoice.uuid === action.payload.uuid
        );
        if (index !== -1) {
          state.invoices[index] = action.payload; // Replace existing
        } else {
          state.invoices.push(action.payload); // Add new
        }
      })
      .addCase(addEditInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
