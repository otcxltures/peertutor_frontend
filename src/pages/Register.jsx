import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    is_tutor: false,
    is_student: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate(form.is_tutor ? "/profile" : "/tutors");
    } catch (err) {
      const data = err.response?.data;
      const message = data ? Object.values(data).flat().join(" ") : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-1">Join PeerTutor Connect</h1>
        <p className="text-muted text-sm mb-8">Get help, or offer it. You can be both.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:border-navy outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:border-navy outline-none"
              required
            />
          </div>

          <fieldset className="border border-line rounded-md px-3 py-3">
            <legend className="text-sm text-ink px-1">I want to</legend>
            <label className="flex items-center gap-2 text-sm text-ink py-1">
              <input
                type="checkbox"
                checked={form.is_student}
                onChange={(e) => update("is_student", e.target.checked)}
              />
              Find a tutor for a subject
            </label>
            <label className="flex items-center gap-2 text-sm text-ink py-1">
              <input
                type="checkbox"
                checked={form.is_tutor}
                onChange={(e) => update("is_tutor", e.target.checked)}
              />
              Offer tutoring to others
            </label>
          </fieldset>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-paper rounded-md py-2.5 font-medium hover:bg-navyDark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-navy font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
