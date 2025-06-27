// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

// Create a slice here or import one
import authReducer from './authSlice';
import customerReducer from './customerSlice';
import customerDetailsReducer from './customerDetailsSlice';
import purchaseOrderReducer from './purchaseOrderSlice';
import invoiceReducer from './invoiceSlice';
import profileReducer from './profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,  // Reducer for the counter slice
    customer: customerReducer,  // Reducer for the counter slice
    customerDetails: customerDetailsReducer,  // Reducer for the counter slice
    purchaseOrder: purchaseOrderReducer,  // Reducer for the counter slice
    invoice: invoiceReducer,
    profile: profileReducer,
  },
});

export default store;
