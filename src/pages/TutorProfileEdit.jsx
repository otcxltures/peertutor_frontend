import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TutorProfileEdit() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const subjectsRes = await client.get("/subjects/");
      setSubjects(subjectsRes.data);

      const tutorsRes = await client.get("/tutors/", { params: { search: user.username } });
      const mine = tutorsRes.data.find((t) => t.username === user.username);
      if (mine) {
        setProfile(mine);
        setBio(mine.bio);
        setSelectedSubjects(mine.subjects.map((s) => s.id));
      }
      setLoading(false);
    };
    load();
  }, [user.username]);

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      if (profile) {
        const res = await client.patch(`/tutors/${profile.id}/`, {
          bio,
          subject_ids: selectedSubjects,
        });
        setProfile(res.data);
      } else {
        const res = await client.post("/tutors/", {
          bio,
          subject_ids: selectedSubjects,
        });
        setProfile(res.data);
      }
      setSaved(true);
    } catch {
      setError("Couldn't save your profile. Check your subjects and try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-muted text-sm">Loading your profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl text-ink mb-1">
          {profile ? "Your tutor profile" : "Set up your tutor profile"}
        </h1>
        <p className="text-muted text-sm mb-8">
          What you cover, and a bit about you. Students will see this when they search.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm text-ink mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="e.g. 3rd year Math major, best at calculus and linear algebra."
              className="w-full border border-line rounded-md px-3 py-2 bg-white focus:border-navy outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-ink mb-2">Subjects you teach</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSubject(s.id)}
                  className={`tag-note ${selectedSubjects.includes(s.id) ? "ring-1 ring-amberDark" : "opacity-50"}`}
                >
                  {s.name.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {saved && <p className="text-sm text-navy">Saved.</p>}

          <button
            type="submit"
            className="bg-navy text-paper rounded-md px-5 py-2.5 font-medium hover:bg-navyDark transition-colors"
          >
            Save profile
          </button>
        </form>

        {profile && profile.availabilities.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg text-ink mb-2">Your availability</h2>
            <ul className="text-sm text-muted font-mono space-y-1">
              {profile.availabilities.map((a) => (
                <li key={a.id}>
                  {DAY_LABELS[a.day_of_week]} {a.start_time.slice(0, 5)}–{a.end_time.slice(0, 5)}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted mt-2">
              Availability editing isn't wired up in this MVP yet — set it via Django admin for now.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
