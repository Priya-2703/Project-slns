
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactForm from './Components/ContactForm/ContactForm'
function App() {

  return (
    <>
    <Router>
    <Routes>
        <Route path="/contact" element={<ContactForm />} />

      </Routes>
      </Router>
<Navbar/>
    </>
  )
}

export default App
