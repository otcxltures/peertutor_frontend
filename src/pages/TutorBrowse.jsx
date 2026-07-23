import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TutorBrowse() {
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestTarget, setRequestTarget] = useState(null);

  const loadTutors = async (query = "") => {
    setLoading(true);
    const res = await client.get("/tutors/", { params: query ? { search: query } : {} });
    setTutors(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTutors();
    client.get("/subjects/").then((res) => setSubjects(res.data));
  }, []);

  const handleFilter = (name) => {
    setSearch(name);
    loadTutors(name);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl text-ink mb-2">Find a tutor</h1>
        <p className="text-muted text-sm mb-6">Search by subject or browse who's around.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleFilter("")}
            className={`tag-note ${search === "" ? "ring-1 ring-amberDark" : ""}`}
          >
            all subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => handleFilter(s.name)}
              className={`tag-note ${search === s.name ? "ring-1 ring-amberDark" : ""}`}
            >
              {s.name.toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted text-sm">Loading tutors...</p>
        ) : tutors.length === 0 ? (
          <p className="text-muted text-sm">No tutors match that subject yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="border border-line bg-white rounded-lg p-5">
                <h2 className="font-display text-lg text-ink">{tutor.username}</h2>
                <p className="text-sm text-muted mt-1 mb-3">{tutor.bio || "No bio yet."}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tutor.subjects.map((s) => (
                    <span key={s.id} className="tag-note">
                      {s.name.toLowerCase()}
                    </span>
                  ))}
                </div>
                {tutor.availabilities.length > 0 && (
                  <p className="text-xs text-muted font-mono mb-4">
                    {tutor.availabilities
                      .map((a) => `${DAY_LABELS[a.day_of_week]} ${a.start_time.slice(0, 5)}–${a.end_time.slice(0, 5)}`)
                      .join(" · ")}
                  </p>
                )}
                <button
                  onClick={() => setRequestTarget(tutor)}
                  className="text-sm bg-navy text-paper rounded-md px-4 py-2 hover:bg-navyDark transition-colors"
                >
                  Request a session
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {requestTarget && (
        <RequestModal
          tutor={requestTarget}
          onClose={() => setRequestTarget(null)}
        />
      )}
    </div>
  );
}

function RequestModal({ tutor, onClose }) {
  const [subjectId, setSubjectId] = useState(tutor.subjects[0]?.id || "");
  const [proposedTime, setProposedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await client.post("/sessions/", {
        tutor: tutor.id,
        subject: subjectId,
        proposed_time: new Date(proposedTime).toISOString(),
        notes,
      });
      setDone(true);
    } catch {
      setError("Couldn't send that request. Check the time and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-6 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        {done ? (
          <>
            <h2 className="font-display text-xl text-ink mb-2">Request sent</h2>
            <p className="text-sm text-muted mb-6">
              {tutor.username} will accept or decline it. You'll see the status on your dashboard.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-navy text-paper rounded-md py-2.5 font-medium hover:bg-navyDark transition-colors"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl text-ink mb-1">Request a session</h2>
            <p className="text-sm text-muted mb-4">with {tutor.username}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-ink mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full border border-line rounded-md px-3 py-2 bg-white"
                  required
                >
                  {tutor.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink mb-1">Proposed time</label>
                <input
                  type="datetime-local"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full border border-line rounded-md px-3 py-2 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-ink mb-1">What do you need help with?</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-line rounded-md px-3 py-2 bg-white"
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-line rounded-md py-2.5 text-ink hover:bg-paper transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-navy text-paper rounded-md py-2.5 font-medium hover:bg-navyDark transition-colors disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send request"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
