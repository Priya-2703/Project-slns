// App.tsx
import "./App.css";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Landing from "./Components/pages/Landing";
import ContactForm from "./Components/ContactForm/ContactForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./Components/About/About";
import Faq from "./Components/FAQ/Faq";
import Cart from "./Components/Cart/Cart";
import ProductDetail from "./Components/Product/ProductDetail";
import ProductReview from "./Components/Product/ProductReview";
import ScrollToTop from "./Components/ScrollToTop";
import SignUp from "./Components/SignUp/SignUp";
import SignIn from "./Components/SignIn/SignIn";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import B2bSignUp from "./Components/B2bSignUp/B2bSignup";
import B2bSignIn from "./Components/B2bSignIn/B2bSignIn";
import Product from "./Components/Product/Product";
import CartProvider from "./Context/UseCartContext";
import CheckOut from "./Components/CheckOut/CheckOut";
import WishList from "./Components/WishList/WishList";
import WishlistProvider from "./Context/UseWishListContext";
import { ToastProvider } from "./Context/UseToastContext";
import BackToTopButton from "./Components/BacktoTopButton";
import Profile from "./Components/Profile/Profile";

import ProtectedAdminRoute, { RedirectIfAdmin } from './Components/Auth/ProtectedAdminRoute';

import AdminDashboard from "./Components/Admin/AdminDashboard";
import AddProduct from "./Components/Admin/AddProduct";
import BulkImport from "./Components/Admin/BulkImport";


function App() {
  return (
    <>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <ScrollToTop behavior="smooth" />
              <Navbar />
              <Routes>
                {/* ========================================
                    PUBLIC ROUTES (Everyone can access)
                  ======================================== */}
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/product" element={<Product />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/product/product-review" element={<ProductReview />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<WishList />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<ContactForm />} />

              {/* ========================================
                AUTH ROUTES (Redirect admin if already logged in)
                ======================================== */}
                <Route path="/signin" element={<RedirectIfAdmin ><SignIn /></RedirectIfAdmin >} />
                <Route path="/signup" element={<RedirectIfAdmin ><SignUp /></RedirectIfAdmin >} />
                <Route path="/b2b-signup" element={<B2bSignUp />} />
                <Route path="/b2b-signin" element={<B2bSignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                 {/* ========================================
                      ADMIN ROUTES (Protected - Admin Only)
                    ======================================== */}
                <Route path="/admin/dashboard" element={ <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute> }  />
                <Route path="/admin/products/add" element={<ProtectedAdminRoute><AddProduct /></ProtectedAdminRoute>  } />
                <Route path="/admin/import" element={ <ProtectedAdminRoute><BulkImport /></ProtectedAdminRoute> } />

                {/* ========================================
                  404 NOT FOUND
                ======================================== */}
                <Route path="*" element={
                  <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-white text-xl">Page not found</p>
                  </div>
                  </div>
                } />
              </Routes>
              <Footer />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
      <BackToTopButton/>
    </>
  );
}

export default App;
