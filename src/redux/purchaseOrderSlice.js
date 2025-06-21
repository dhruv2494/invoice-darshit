// redux/purchaseOrderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { showToast } from "../modules/utils";

// Async Thunks
export const getPurchaseOrders = createAsyncThunk(
  "purchaseOrder/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/po/Get");
      return response.data?.list || [];
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch purchase orders");
    }
  }
);

export const getPurchaseOrderById = createAsyncThunk(
  "purchaseOrder/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/po/Get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching purchase order ${id}:`, error);
      return rejectWithValue(error.response?.data || "Failed to fetch purchase order");
    }
  }
);

export const getPurchaseOrdersByCustomer = createAsyncThunk(
  "purchaseOrder/getByCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/po/customer/${customerId}`);
      return response.data?.list || [];
    } catch (error) {
      console.error(`Error fetching purchase orders for customer ${customerId}:`, error);
      return rejectWithValue(error.response?.data || "Failed to fetch customer's purchase orders");
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrder/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await API.post("/po/AddUpdate", orderData);
      showToast("Purchase order created successfully!", "success");
      return response.data;
    } catch (error) {
      console.error("Error creating purchase order:", error);
      showToast(error.response?.data?.message || "Failed to create purchase order", "error");
      return rejectWithValue(error.response?.data || "Failed to create purchase order");
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  "purchaseOrder/update",
  async ({ id, ...orderData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/po/AddUpdate/${id}`, orderData);
      showToast("Purchase order updated successfully!", "success");
      return response.data;
    } catch (error) {
      console.error(`Error updating purchase order ${id}:`, error);
      showToast(error.response?.data?.message || "Failed to update purchase order", "error");
      return rejectWithValue(error.response?.data || "Failed to update purchase order");
    }
  }
);

export const addEditPurchaseOrder = createAsyncThunk(
  "purchaseOrder/addEdit",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const { id, ...data } = orderData;
      let response;
      
      if (id) {
        // Update existing order
        response = await API.put(`/po/AddUpdate/${id}`, data);
        showToast("Purchase order updated successfully!", "success");
      } else {
        // Create new order
        response = await API.post("/po/AddUpdate", data);
        showToast("Purchase order created successfully!", "success");
      }
      
      // Refresh the orders list
      dispatch(getPurchaseOrders());
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (orderData.id ? "Failed to update purchase order" : "Failed to create purchase order");
      showToast(errorMessage, "error");
      return rejectWithValue(error.response?.data || errorMessage);
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrder/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/po/Delete/${id}`);
      showToast("Purchase order deleted successfully!", "success");
      return id;
    } catch (error) {
      console.error(`Error deleting purchase order ${id}:`, error);
      showToast("Failed to delete purchase order", "error");
      return rejectWithValue(error.response?.data || "Failed to delete purchase order");
    }
  }
);

// Initial state
const initialState = {
  purchaseOrders: [],
  currentOrder: null,
  loading: false,
  loadingList: false, 
  error: null,
  status: ["draft", "pending", "approved", "completed", "cancelled"],
  filters: {
    status: "",
    dateRange: {
      from: "",
      to: ""
    },
    search: ""
  },
  lastFetched: null,
  customerOrders: [],
};

// Slice
const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    // Get all purchase orders
    builder
      .addCase(getPurchaseOrders.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(getPurchaseOrders.fulfilled, (state, action) => {
        state.loadingList = false;
        state.purchaseOrders = action.payload || [];
        state.lastFetched = new Date().toISOString();
        
        // Extract unique statuses
        const statuses = new Set();
        action.payload.forEach(order => {
          if (order.status) statuses.add(order.status);
        });
        state.status = Array.from(statuses);
      })
      .addCase(getPurchaseOrders.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload || "Failed to load purchase orders";
      })

      // Get purchase order by ID
      .addCase(getPurchaseOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getPurchaseOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load purchase order";
      })

      // Create purchase order
      .addCase(createPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders.push(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create purchase order";
      })

      // Update purchase order
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.purchaseOrders.findIndex(po => po.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update purchase order";
      })

      // Delete purchase order
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders = state.purchaseOrders.filter(po => po.id !== action.payload);
        if (state.currentOrder?.id === action.payload) {
          state.currentOrder = null;
        }
      });
  },
});

// Export actions
export const { setCurrentOrder, setFilters, resetCurrentOrder } = purchaseOrderSlice.actions;

// Selectors
export const selectAllPurchaseOrders = (state) => state.purchaseOrder.purchaseOrders;
export const selectCustomerOrders = (state) => state.purchaseOrder.customerOrders;
export const selectCurrentOrder = (state) => state.purchaseOrder.currentOrder;
export const selectLoading = (state) => state.purchaseOrder.loading;
export const selectLoadingList = (state) => state.purchaseOrder.loadingList;
export const selectError = (state) => state.purchaseOrder.error;
export const selectStatuses = (state) => state.purchaseOrder.status;
export const selectFilters = (state) => state.purchaseOrder.filters;
export const selectLastFetched = (state) => state.purchaseOrder.lastFetched;

export default purchaseOrderSlice.reducer;
