import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-amber/20 text-amberDark",
  accepted: "bg-navy/10 text-navy",
  declined: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-800",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const load = async () => {
    const res = await client.get("/sessions/");
    setSessions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const runAction = async (id, action) => {
    setActionError("");
    try {
      await client.patch(`/sessions/${id}/${action}/`);
      load();
    } catch {
      setActionError("That action didn't go through. Try again.");
    }
  };

  const now = new Date();
  const upcoming = sessions.filter(
    (s) => new Date(s.proposed_time) >= now && s.status !== "completed" && s.status !== "declined"
  );
  const past = sessions.filter(
    (s) => new Date(s.proposed_time) < now || s.status === "completed" || s.status === "declined"
  );

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl text-ink mb-1">Your dashboard</h1>
        <p className="text-muted text-sm mb-8">
          {user?.is_tutor ? "Sessions you're tutoring and requesting." : "Sessions you've requested."}
        </p>

        {actionError && <p className="text-sm text-red-700 mb-4">{actionError}</p>}

        {loading ? (
          <p className="text-muted text-sm">Loading sessions...</p>
        ) : (
          <>
            <Section title="Upcoming" sessions={upcoming} user={user} onAction={runAction} empty="Nothing scheduled yet." />
            <Section title="Past & closed" sessions={past} user={user} onAction={runAction} empty="No history yet." />
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, sessions, user, onAction, empty }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-lg text-ink mb-3">{title}</h2>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const isTutorSide = user?.username === s.tutor_username;
            return (
              <div key={s.id} className="border border-line bg-white rounded-lg p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ink">
                    <span className="font-medium">{s.subject_name}</span>{" "}
                    <span className="text-muted">
                      · {isTutorSide ? `with ${s.student_username}` : `with ${s.tutor_username}`}
                    </span>
                  </p>
                  <p className="text-xs text-muted font-mono mt-1">
                    {new Date(s.proposed_time).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {s.notes && <p className="text-xs text-muted mt-1">{s.notes}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs rounded-full px-2.5 py-1 font-medium ${STATUS_STYLES[s.status]}`}>
                    {s.status}
                  </span>
                  {isTutorSide && s.status === "pending" && (
                    <>
                      <button
                        onClick={() => onAction(s.id, "accept")}
                        className="text-xs border border-navy text-navy rounded-md px-3 py-1.5 hover:bg-navy hover:text-paper transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onAction(s.id, "decline")}
                        className="text-xs border border-line text-muted rounded-md px-3 py-1.5 hover:bg-paper transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {isTutorSide && s.status === "accepted" && (
                    <button
                      onClick={() => onAction(s.id, "complete")}
                      className="text-xs border border-navy text-navy rounded-md px-3 py-1.5 hover:bg-navy hover:text-paper transition-colors"
                    >
                      Mark complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
