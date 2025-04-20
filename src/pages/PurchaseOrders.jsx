import React, { useState, useEffect } from 'react';
import DashboardLayout from "../components/DashboardLayout";
import PurchaseOrderForm from "../components/PurchaseOrderForm";
import PurchaseOrderList from "../components/PurchaseOrderList";

const PurchaseOrders = () => {
  const [refresh, setRefresh] = useState(false);

  const refreshList = () => {
    setRefresh(!refresh);
  };

  return (
    <DashboardLayout>
      <PurchaseOrderForm onOrderCreated={refreshList} />
      <PurchaseOrderList key={refresh} />
    </DashboardLayout>
  );
};

export default PurchaseOrders;
