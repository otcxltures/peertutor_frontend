import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch {
      setError("That username or password didn't work. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Log in to find or offer help.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:border-navy outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:border-navy outline-none"
              required
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-paper rounded-md py-2.5 font-medium hover:bg-navyDark transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6">
          New here?{" "}
          <Link to="/register" className="text-navy font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
