import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Admin from "./pages/Admin"
import Guest from "./pages/Guest"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
