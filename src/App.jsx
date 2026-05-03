import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { FilterProvider } from './context/FilterContext.jsx';
import MainLayout from './components/MainLayout/MainLayout.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './Component/Homepage.jsx';
import NewArrivals from './components/NewArrivals/NewArrivals.jsx';
import AllProducts from './components/AllProducts/AllProducts.jsx';
import FeaturedStories from './components/FeaturedStories/FeaturedStories.jsx';
import Contact from './components/Contact/Contact.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart/Cart.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Login/Signup.jsx';
import About from './components/Aboutpage/About.jsx';
import Profile from './Component/Profile/Profile.jsx';
import MyOrders from './Component/Orders/MyOrders';
import Settings from './Component/Settings/Settings';
import Notifications from './Component/Notifications/Notifications';
import ChangePassword from './components/ChangePassword.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NewArrivalsWish from './components/NewArrivalsWish/NewArrivalsWish.jsx';
import ScrollToTop from './components/ScrollToTop';
import TermsAndConditions from './components/Login/TermsAndConditions';
import PrivacyPolicy from './components/Login/PrivacyPolicy';
import OrderTracking from './pages/OrderTracking.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import DashboardOverview from './components/Admin/DashboardOverview.jsx';
import Orders from './components/Admin/Orders.jsx';
import Analytics from './components/Admin/Analytics.jsx';
import NotificationsAdmin from './components/Admin/Notifications.jsx';
import Users from './components/Admin/Users.jsx';
import Categories from './components/Admin/Categories.jsx';
import Products from './components/Admin/Products.jsx';
import ReturnsExchange from './pages/ReturnsExchange.jsx';
import WishGenieProducts from './components/Admin/WishGenieProducts.jsx';
import ProductDetailWish from './components/ProductDetailWish/ProductDetailWish';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import AddressManagement from './Component/AddressManagement/AddressManagement.jsx';
import OrderDeliveryManagement from './components/Admin/OrderDeliveryManagement.jsx';
import SavedCart from './Component/SavedCart/SavedCart.jsx';
import CartManagement from './components/Admin/CartManagement';
import WishlistManagement from './components/Admin/WishlistManagement.jsx';
import TestimonialsManagement from './components/Admin/TestimonialsManagement.jsx';
import BlogDetail from './components/Blog/BlogDetail.jsx';
import Checkout from './components/Checkout/Checkout.jsx';
import BulkOrder from './pages/BulkOrder.jsx';
import SocialMedia from './components/Admin/SocialMedia.jsx';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};



function App() {
  return (
    <GoogleOAuthProvider clientId="727732829380-un80uanpnh4rra3sfjr59a48et2rph38.apps.googleusercontent.com">
      <AuthProvider>
        <ProductProvider>
          <FilterProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <ScrollToTop />
                  <ToastContainer position="bottom-right" autoClose={3000} />
                  <Routes>
                    <Route path="/" element={<MainLayout><Homepage /></MainLayout>} />
                    <Route path="/new-arrivals" element={<MainLayout><NewArrivals /></MainLayout>} />
                    <Route path="/all-products" element={<MainLayout><AllProducts /></MainLayout>} />
                    <Route path="/featured-stories" element={<MainLayout><FeaturedStories /></MainLayout>} />
                    <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                    <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                    <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
                    <Route path="/blog/:id" element={<MainLayout><BlogDetail /></MainLayout>} />
                    <Route path="/category/:categoryName" element={<MainLayout><AllProducts /></MainLayout>} />
                    <Route path="/terms" element={<MainLayout><TermsAndConditions /></MainLayout>} />
                    <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
                    <Route path="/track-order" element={<MainLayout><OrderTracking /></MainLayout>} />
                    <Route path="/new-arrivals-wish" element={<MainLayout><NewArrivalsWish /></MainLayout>} />
                    <Route path="/returns-exchange" element={<MainLayout><ReturnsExchange /></MainLayout>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/addresses" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
                    <Route path="/saved-cart" element={<ProtectedRoute><SavedCart /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path="/change-password" element={<MainLayout><ChangePassword /></MainLayout>} />
                    <Route path="/bulk-order" element={<MainLayout><BulkOrder /></MainLayout>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
                      <Route index element={<DashboardOverview />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="delivery-management" element={<OrderDeliveryManagement />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="notifications" element={<NotificationsAdmin />} />
                      <Route path="users" element={<Users />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="products" element={<Products />} />
                      <Route path="wish-genie" element={<WishGenieProducts />} />
                      <Route path="cart-management" element={<CartManagement />} />
                      <Route path="wishlist-management" element={<WishlistManagement />} />
                      <Route path="testimonials" element={<TestimonialsManagement />} />
                      <Route path="social-media" element={<SocialMedia />} />
                    </Route>
                    <Route path="/product-wish/:id" element={<MainLayout><ProductDetailWish /></MainLayout>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </WishlistProvider>
            </CartProvider>
          </FilterProvider>
        </ProductProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
