import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Admin from "./pages/Admin"
import Guest from "./pages/Guest"
import CreatePoll from "./pages/CreatePoll"
import PollResult from "./pages/PollResult"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin/create-poll" element={<CreatePoll />} />
          <Route path="/admin/result" element={<PollResult />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
