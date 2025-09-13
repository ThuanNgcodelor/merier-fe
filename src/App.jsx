import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import HomePage from "./pages/client/HomePage.jsx";
import AuthPage from "./pages/client/AuthPage.jsx";
import UserPage from "./pages/client/UserPage.jsx";
import ShopPage from "./pages/client/ShopPage.jsx";
import CartPage from "./pages/client/CartPage.jsx";
import GoogleCallback from "./pages/client/GoogleCallback.jsx";
import ForgotPasswordPage from "./pages/client/ForgotPasswordPage.jsx";
import VerifyOtpPage from "./pages/client/VerifyOtpPage.jsx";
import ResetPasswordPage from "./pages/client/ResetPasswordPage.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DataTablesPage from "./pages/admin/DataTablesPage.jsx";
import VetPortal from "./pages/vet/VetPortal.jsx";
import VetDashboard from "./pages/vet/VetDashboard.jsx";
import VetAppointments from "./pages/vet/VetAppointments.jsx";
import VetHealthRecords from "./pages/vet/VetHealthRecords.jsx";
import VetArticles from "./pages/vet/VetArticles.jsx";
import VetProfile from "./pages/vet/VetProfile.jsx";
import ChartAdmin from "./pages/admin/ChartAdmin.jsx";
import OrdersPage from "./pages/admin/OrdersPage.jsx";
import RolesPage from "./pages/admin/RolesPage.jsx";
import ShelterPage from "./pages/shelter/ShelterPage.jsx";
import PetManagementPage from "./pages/shelter/PetManagementPage.jsx";
import ShelterManagementPage from "./pages/shelter/ShelterManagementPage.jsx";
import ShelterLayout from "./components/shelter/ShelterLayout.jsx";
import AdoptionRequestsPage from "./pages/shelter/AdoptionRequestsPage.jsx";
import CategoriesPage from "./pages/admin/categoeis/CategoriesPage.jsx";
import VetFinderPage from "./pages/client/VetFinderPage.jsx"
import AdoptionListing from "./pages/client/AdoptionListing.jsx";
import ProductsPage from "./pages/admin/products/ProductsPage.jsx";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/information/*" element={<UserPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/oauth2/callback" element={<GoogleCallback />} />

          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/vets" element={<VetFinderPage />} />
          <Route path="/adoption" element={<AdoptionListing />} />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tables/datatables" element={<DataTablesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="role-request" element={<RolesPage />} />
            <Route path="charts" element={<ChartAdmin />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
          {/* Vet routes */}
          <Route
            path="/vet/*"
            element={
              <ProtectedRoute allowedRoles={["ROLE_VET"]}>
                <VetPortal />
              </ProtectedRoute>
            }
          >
            <Route index element={<VetDashboard />} />
            <Route path="appointments" element={<VetAppointments />} />
            <Route path="records" element={<VetHealthRecords />} />
            <Route path="articles" element={<VetArticles />} />
            <Route path="profile" element={<VetProfile />} />
          </Route>

          {/* Shelter routes */}
          <Route
            path="/shelter/*"
            element={
              <ProtectedRoute allowedRoles={["ROLE_SHELTER"]}>
                <ShelterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ShelterPage />} />
            <Route path="pets" element={<PetManagementPage />} />
            <Route path="pet/my" element={<Navigate to="/shelter/pets" replace />} />
            <Route path="adoption-requests" element={<AdoptionRequestsPage />} />
            <Route path="manage" element={<ShelterManagementPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
} 