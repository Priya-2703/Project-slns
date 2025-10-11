import { Home } from "lucide-react";

import "./App.css";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Landing from "./Components/pages/Landing";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactForm from "./Components/ContactForm/ContactForm";
function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<ContactForm />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
