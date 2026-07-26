import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TutorBrowse from "./pages/TutorBrowse";
import Dashboard from "./pages/Dashboard";
import TutorProfileEdit from "./pages/TutorProfileEdit";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/tutors"
        element={
          <ProtectedRoute>
            <TutorBrowse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <TutorProfileEdit />
          </ProtectedRoute>
        }
      />
    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} /> 
    </Routes>
  );
}
