
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactForm from './Components/ContactForm/ContactForm'
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import B2bSignUp from './Components/B2bSignUp/B2bSignup';
import B2bSignIn from './Components/B2bSignIn/B2bSignIn';
function App() {

  return (
    <>
    <Router>
    <Routes>
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/b2b-signup" element={<B2bSignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/b2b-signin" element={<B2bSignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
      </Router>
<Navbar/>
    </>
  )
}

export default App
