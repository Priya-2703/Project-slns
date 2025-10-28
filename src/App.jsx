import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  matchPath,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import CartProvider from "./Context/UseCartContext";
import WishlistProvider from "./Context/UseWishListContext";
import { ToastProvider } from "./Context/UseToastContext";
import { ReviewProvider } from "./Context/UseReviewContext";
import YellowCursor from "./Components/YellowCursor";
import ButterflyLottieFollower from "./Components/ButterflyLottieFollower";
import { assets } from "../public/assets/asset";
import BackToTopButton from "./Components/BacktoTopButton";
import LoaderAni from "./Components/LoaderAni";

const About = lazy(() => import("./Components/About/About"));
const Faq = lazy(() => import("./Components/FAQ/Faq"));
const Cart = lazy(() => import("./Components/Cart/Cart"));
const ProductDetail = lazy(() => import("./Components/Product/ProductDetail"));
const ProductReview = lazy(() => import("./Components/Product/ProductReview"));
const ContactForm = lazy(() => import("./Components/ContactForm/ContactForm"));
const SignUp = lazy(() => import("./Components/SignUp/SignUp"));
const SignIn = lazy(() => import("./Components/SignIn/SignIn"));
const ForgotPassword = lazy(() =>
  import("./Components/ForgotPassword/ForgotPassword")
);
const B2bSignUp = lazy(() => import("./Components/B2bSignUp/B2bSignup"));
const B2bSignIn = lazy(() => import("./Components/B2bSignIn/B2bSignIn"));
const Product = lazy(() => import("./Components/Product/Product"));
const CheckOut = lazy(() => import("./Components/CheckOut/CheckOut"));
const WishList = lazy(() => import("./Components/WishList/WishList"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const ErrorPage = lazy(() => import("./Components/ErrorPage/ErrorPage"));
const Privacy = lazy(() => import("./Components/Privacy/Privacy"));
const Terms = lazy(() => import("./Components/Terms/Terms"));
const Landing = lazy(() => import("./Components/pages/Landing"));

// 🎯 Create wrapper component to check route
function AppContent() {
  const location = useLocation();

  // Define exact valid routes (including dynamic routes)
  const validRoutes = [
    "/",
    "/about",
    "/product",
    "/product/:id",
    "/product/:id/product-review",
    "/profile",
    "/cart",
    "/wishlist",
    "/checkout",
    "/faq",
    "/privacy-policy",
    "/terms-and-conditions",
    "/contact",
    "/signup",
    "/b2b-signup",
    "/signin",
    "/b2b-signin",
    "/forgot-password",
  ];

  // Check if current path matches any valid route pattern
  const isValidRoute = validRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  return (
    <>
      <ScrollToTop behavior="smooth" />

      {/* Show Navbar only if valid route */}
      {isValidRoute && <Navbar />}

      <Suspense
        fallback={
          <LoaderAni/>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/product/:id/product-review"
            element={<ProductReview />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/b2b-signup" element={<B2bSignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/b2b-signin" element={<B2bSignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
              //admin new
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

          {/* 404 Error Page - Must be last */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>

      {/* Show Footer only if valid route */}
      {isValidRoute && <Footer />}
    </>
  );
}

const App = () => {
  return (
    <>
      <ReviewProvider>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <YellowCursor size={18} hideNative />
                <ButterflyLottieFollower
                  hideCursor={false}
                  animationData={assets.butterflyAnim}
                  size={80}
                  faceOffsetDeg={90}
                  wingSpeed={3}
                />
                <AppContent />
                <BackToTopButton />
              </Router>
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </ReviewProvider>
    </>
  );
};

export default App;
