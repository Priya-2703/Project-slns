import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import ContactForm from './Components/ContactForm/ContactForm'

function App() {
  

  return (
    <>
    <Router>
    <Routes>
        <Route path="/contact" element={<ContactForm />} />

      </Routes>
      </Router>
    </>
  )
}

export default App
