import React from 'react';
import { Outlet } from 'react-router-dom';

// This component is now just a wrapper for the new routing structure
const PurchaseOrders = () => {
  return <Outlet />;
};

export default PurchaseOrders;
