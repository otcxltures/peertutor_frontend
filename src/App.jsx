import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TutorBrowse from "./pages/TutorBrowse";
import Dashboard from "./pages/Dashboard";
import TutorProfileEdit from "./pages/TutorProfileEdit";
import ProtectedRoute from "./components/ProtectedRoute";

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
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
