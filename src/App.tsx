import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Admin from "./pages/Admin"
import Guest from "./pages/Guest"
import CreatePoll from "./pages/CreatePoll"
import PollResult from "./pages/PollResult"
import ProtectRoute from "./ProtectRoutes"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/guest" element={<ProtectRoute><Guest /></ProtectRoute>} />
          <Route path="/admin-dashboard" element={<ProtectRoute><Admin /></ProtectRoute>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin-dashboard/create-poll" element={<ProtectRoute><CreatePoll /></ProtectRoute>} />
          <Route path="/result" element={<ProtectRoute><PollResult /></ProtectRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
