// redux/purchaseOrderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";
import { showToast } from "../modules/utils";

export const getPurchaseOrders = createAsyncThunk(
  "purchaseOrder/getAll",
  async () => {
    try {
      const response = await API.get("/po/Get");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addEditPurchaseOrder = createAsyncThunk(
  "purchaseOrder/addEdit",
  async (order, { dispatch }) => {
    try {
      const response = await API.post("/po/AddUpdate", order);
      // After the API call, we dispatch getPurchaseOrders to refresh the list
      dispatch(getPurchaseOrders());
      showToast("Purchase Order successfully added/updated!", 1);

      return response.data;
    } catch (error) {
      console.log(error);
      showToast("Error While add/update Purchase Order", 2);
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrder/delete",
  async (uuid, { dispatch }) => {
    try {
      await API.delete(`/po/Delete/${uuid}`);
      // After the API call, we dispatch getPurchaseOrders to refresh the list
      dispatch(getPurchaseOrders());
      showToast("Purchase Order successfully deleted!", 1);
      return uuid;
    } catch (error) {
      console.log(error);
      showToast("Error While delete Purchase Order", 2);
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState: {
    purchaseOrders: [],
    status: ["created", "pending", "completed"], // predefined statuses
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPurchaseOrders.fulfilled, (state, action) => {
        // Assuming the API response is under action.payload.list
        state.purchaseOrders = action.payload.list.map((po) => ({
          ...po,
          status: po.status || "Pending", // Set default status if empty
        }));
      })
      .addCase(addEditPurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex(
          (po) => po.uuid === action.payload.uuid
        );
        if (index !== -1) {
          // Ensure status exists before updating
          const updatedOrder = {
            ...action.payload,
            status: action.payload.status || "Pending",
          };
          state.purchaseOrders[index] = updatedOrder;
        } else {
          state.purchaseOrders.push({
            ...action.payload,
            status: action.payload.status || "Pending",
          });
        }
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        // Remove the deleted purchase order from the list (if not fetched again)
      });
  },
});

export default purchaseOrderSlice.reducer;
