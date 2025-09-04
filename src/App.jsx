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


export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
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
          {/* <Route path="/cart" element={<CartPage />} />

            {/* Protected routes */}
          {/* <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminPage />
              </ProtectedRoute>
            } 
          /> */}
          {/* <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <UserPage />
              </ProtectedRoute>
            } 
          /> */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
} 