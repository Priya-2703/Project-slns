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
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import B2bSignUp from './Components/B2bSignUp/B2bSignup';
import B2bSignIn from './Components/B2bSignIn/B2bSignIn';

function App() {
  return (
    <Router>
      <ScrollToTop behavior="smooth" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/product-review" element={<ProductReview/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/b2b-signup" element={<B2bSignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/b2b-signin" element={<B2bSignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;