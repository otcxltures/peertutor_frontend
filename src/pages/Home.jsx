import { Link } from "react-router-dom";

const SAMPLE_NOTES = [
  { subject: "Mathematics", text: "Need help with derivatives before Friday's test.", rotate: "-rotate-2" },
  { subject: "Python Programming", text: "Debugging a Flask app — anyone free tonight?", rotate: "rotate-1" },
  { subject: "Chemistry", text: "Balancing equations still isn't clicking for me.", rotate: "-rotate-1" },
  { subject: "English Literature", text: "Essay structure help for Macbeth, 2 sessions.", rotate: "rotate-2" },
];

const STEPS = [
  {
    n: "01",
    title: "Say what you need — or what you know",
    body: "Sign up as a student looking for help, a tutor offering it, or both. Your profile carries either role.",
  },
  {
    n: "02",
    title: "Find the right match",
    body: "Browse tutors by subject and availability, or wait for students to find you.",
  },
  {
    n: "03",
    title: "Book a session",
    body: "Send a request with a proposed time and a note. Once it's accepted, you're set.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display text-lg">
          PeerTutor <span className="text-navy">Connect</span>
        </span>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/login" className="text-ink hover:text-navy">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-navy text-paper px-4 py-2 rounded-md font-medium hover:bg-navyDark transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-wide text-amberDark mb-4 uppercase">
            A corkboard for asking &amp; offering help
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-5">
            Stuck on something?
            <br />
            Someone nearby already gets it.
          </h1>
          <p className="text-muted text-base mb-8 max-w-md">
            PeerTutor Connect matches students who need help with peers who can teach it —
            by subject, by schedule, no middleman.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="bg-navy text-paper px-5 py-3 rounded-md font-medium hover:bg-navyDark transition-colors"
            >
              Find a tutor
            </Link>
            <Link
              to="/register"
              className="border border-navy text-navy px-5 py-3 rounded-md font-medium hover:bg-navy hover:text-paper transition-colors"
            >
              Offer tutoring
            </Link>
          </div>
        </div>

        <div className="relative bg-white border border-line rounded-lg p-6 min-h-[280px]">
          <p className="font-mono text-[0.65rem] text-muted uppercase tracking-wide mb-4">
            Recent requests
          </p>
          <div className="flex flex-col gap-4">
            {SAMPLE_NOTES.map((note) => (
              <div key={note.subject} className={`tag-note-card ${note.rotate}`}>
                <span className="tag-note">{note.subject}</span>
                <p className="font-body text-sm text-ink mt-2">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-line">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-amberDark">{step.n}</span>
                <h3 className="font-display text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-muted text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-2xl mb-3">Ready to pin your own note?</h2>
        <p className="text-muted mb-6">It takes less than a minute to sign up.</p>
        <Link
          to="/register"
          className="inline-block bg-navy text-paper px-6 py-3 rounded-md font-medium hover:bg-navyDark transition-colors"
        >
          Create an account
        </Link>
      </section>
    </div>
  );
}