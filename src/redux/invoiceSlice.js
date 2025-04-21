// src/redux/features/invoice/invoiceSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"; // use the same API instance as in purchaseOrderSlice

// Async thunk to fetch only completed purchase orders
export const getInvoices = createAsyncThunk("invoice/getAllCompleted", async () => {
  const response = await API.get("/invoice/get-completed-purchase-orders");
  // Filter for only completed purchase orders
  return response?.data?.list
});

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
