import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import PurchaseOrderList from "../components/purchase-orders/PurchaseOrderList";
import PurchaseOrderForm from "../components/purchase-orders/PurchaseOrderForm";
import PurchaseOrderDetails from "../pages/PurchaseOrderDetails";
import Customers from "../pages/Customers";
import CustomerFormPage from "../pages/CustomerFormPage";
import Invoices from "../pages/Invoices";
import InvoiceNewPage from "../pages/InvoiceNewPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/home";
import CustomerDetails from "../pages/CustomerDetails";
import InvoiceDetailsPage from "../pages/InvoiceDetailsPage";
import DashboardLayout from "../components/DashboardLayout";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import InvoiceEditPage from "../pages/InvoiceEditPage";

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
            path=":uuid" 
            element={
              <PurchaseOrderDetails />
            } 
          />
          <Route 
            path=":uuid/edit" 
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
        
        <Route path="/customer-details/:uuid" element={
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
          <Route path="new" element={<InvoiceNewPage />} />
          <Route path=":uuid" element={<InvoiceDetailsPage />} />
          <Route path=":uuid/edit" element={<InvoiceNewPage isEdit={true} />} />
        </Route>

        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Settings Route */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteContainer;
