import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import PlantDetailsPage from "./pages/PlantDetailsPage";
import CheckoutAddressPage from "./pages/CheckoutAddressPage";
import CheckoutPaymentPage from "./pages/CheckoutPaymentPage";
import CheckoutSummaryPage from "./pages/CheckoutSummaryPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import SavedAddressesPage from "./pages/SavedAddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { useWishlistStore } from "./store/wishlistStore";
import { useCartStore } from "./store/cartStore";
export default function App() {
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
const fetchCartCount = useCartStore((s) => s.fetchCartCount);

useEffect(() => {
  fetchWishlist();
  fetchCartCount();
}, [fetchWishlist, fetchCartCount]);
  
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants/:slug"
        element={
          <ProtectedRoute>
            <PlantDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/address"
        element={
          <ProtectedRoute>
            <CheckoutAddressPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/payment"
        element={
          <ProtectedRoute>
            <CheckoutPaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/summary"
        element={
          <ProtectedRoute>
            <CheckoutSummaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout/success"
        element={
          <ProtectedRoute>
            <CheckoutSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/addresses"
        element={
          <ProtectedRoute>
            <SavedAddressesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/payments"
        element={
          <ProtectedRoute>
            <PaymentMethodsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}