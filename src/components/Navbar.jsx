import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-line bg-paper">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg text-navy tracking-tight">
          PeerTutor <span className="text-amberDark">Connect</span>
        </Link>
        {user && (
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/tutors" className="text-ink hover:text-navy transition-colors">
              Find a tutor
            </Link>
            <Link to="/dashboard" className="text-ink hover:text-navy transition-colors">
              Dashboard
            </Link>
            {user.is_tutor && (
              <Link to="/profile" className="text-ink hover:text-navy transition-colors">
                My tutor profile
              </Link>
            )}
            <span className="text-muted font-mono text-xs">{user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-navy border border-navy rounded-md px-3 py-1.5 hover:bg-navy hover:text-paper transition-colors"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
