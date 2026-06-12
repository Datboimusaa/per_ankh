import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ForgotPassword from './pages/ForgotPassword'
import LandingPage from "./pages/LandingPage"

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
     <Router>
      <Routes>
        <Route index element={<LandingPage/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
      </Routes>
     </Router>
    </QueryClientProvider>
  )
}

export default App
