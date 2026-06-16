import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/AuthContext"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from "./pages/VerifyEmail"
import PublicRoute from "./components/layout/PublicRoute"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Home"

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
