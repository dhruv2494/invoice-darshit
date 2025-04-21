// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

// Create a slice here or import one
import authReducer from './authSlice';
import customerReducer from './customerSlice';
import purchaseOrderReducer from './purchaseOrderSlice';
import invoiceReducer from './invoiceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,  // Reducer for the counter slice
    customer: customerReducer,  // Reducer for the counter slice
    purchaseOrder: purchaseOrderReducer,  // Reducer for the counter slice
    invoice: invoiceReducer,
  },
});

export default store;
