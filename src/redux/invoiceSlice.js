// src/redux/features/invoice/invoiceSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"; // use the same API instance as in purchaseOrderSlice

// Async thunk to fetch only completed purchase orders
export const getCompletedPurchaseOrder = createAsyncThunk("invoice/getAllCompleted", async () => {
  const response = await API.get("/po/get-completed-purchase-orders");
  // Filter for only completed purchase orders
  return response?.data?.list
});

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    completedPurchaseOrder: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
