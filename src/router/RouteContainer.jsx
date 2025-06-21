import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PurchaseOrderList from "../components/purchase-orders/PurchaseOrderList";
import PurchaseOrderForm from "../components/purchase-orders/PurchaseOrderForm";
import PurchaseOrderDetails from "../pages/PurchaseOrderDetails";
import Customers from "../pages/Customers";
import CustomerFormPage from "../pages/CustomerFormPage";
import Invoices from "../pages/Invoices";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/home";
import CustomerDetails from "../pages/CustomerDetails";
import InvoiceDetailsPage from "../pages/InvoiceDetailsPage";
import DashboardLayout from "../components/DashboardLayout";

const RouteContainer = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Purchase Orders Routes */}
        <Route path="/purchase-orders" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route index element={<PurchaseOrderList />} />
          <Route 
            path="new" 
            element={
              <PurchaseOrderForm 
                onClose={() => window.history.back()}
                onSuccess={() => window.location.href = '/purchase-orders'}
              />
            } 
          />
          <Route 
            path=":id" 
            element={
              <PurchaseOrderDetails />
            } 
          />
          <Route 
            path=":id/edit" 
            element={
              <PurchaseOrderForm 
                isEdit={true}
                onClose={() => window.history.back()}
                onSuccess={() => window.location.href = '/purchase-orders'}
              />
            } 
          />
        </Route>
        {/* Customers Routes */}
        <Route path="/customers" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route index element={<Customers />} />
          <Route path="new" element={<CustomerFormPage />} />
          <Route path=":id" element={<CustomerFormPage />} />
        </Route>
        
        <Route path="/customer-details/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CustomerDetails />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirect old customer form route to new one */}
        <Route path="/customers/edit/:id" element={
          <Navigate to="/customers/:id" replace />
        } />
        
        {/* Invoices Routes */}
        <Route path="/invoices" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route index element={<Invoices />} />
          <Route path=":id" element={<InvoiceDetailsPage />} />
          <Route 
            path=":id/edit" 
            element={
              <InvoiceDetailsPage isEdit={true} />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteContainer;
