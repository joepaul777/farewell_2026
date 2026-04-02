import { useEffect, useMemo, useState } from "react";

function clampYear(value) {
  if (typeof value !== "number") return null;
  if (Number.isNaN(value)) return null;
  if (value < 1990 || value > 2100) return null;
  return value;
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <div className="sectionHeader">
        <h2 className="h2">{title}</h2>
      </div>
      <div className="sectionBody">{children}</div>
    </section>
  );
}

function ProgramCard({ program }) {
  const year = clampYear(program.year);
  return (
    <div className="card">
      <div className="cardTop">
        <div className="cardTitle">{program.title}</div>
        {year ? <div className="badge">{year}</div> : null}
      </div>
      {program.description ? (
        <div className="cardDesc">{program.description}</div>
      ) : null}
    </div>
  );
}

export default function App() {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [programsError, setProgramsError] = useState("");

  const invite = useMemo(
    () => ({
      title: "Farewell Invitation",
      line1: "With lots of love and gratitude, we invite our amazing seniors to the Farewell 2026.",
      date: "Date: (add date)",
      time: "Time: (add time)",
      venue: "Venue: (add venue)",
      note: "Dress code: (optional)"
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingPrograms(true);
        setProgramsError("");
        const res = await fetch("/programs.json");
        if (!res.ok) {
          throw new Error(`Failed to load programs (${res.status})`);
        }
        const data = await res.json();
        if (cancelled) return;
        setPrograms(Array.isArray(data.programs) ? data.programs : []);
      } catch (e) {
        if (cancelled) return;
        setProgramsError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (cancelled) return;
        setLoadingPrograms(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo">F</div>
          <div className="brandText">
            <div className="brandName">Farewell 2026</div>
            <div className="brandSub">For our seniors</div>
          </div>
        </div>

        <nav className="nav">
          <a className="navLink" href="#invitation">
            Invitation
          </a>
          <a className="navLink" href="#about">
            About
          </a>
          <a className="navLink" href="#programs">
            Programs
          </a>
        </nav>
      </header>

      <main className="container">
        <section id="invitation" className="inviteCover">
          <div className="inviteDecor" aria-hidden="true">
            <div className="waxSeal" />
            <div className="floatingDot dot1" />
            <div className="floatingDot dot2" />
            <div className="floatingDot dot3" />
          </div>

          <div className="invitePaper">
            <div className="inviteTop">
              <div className="kicker anim a1">You made our college life brighter.</div>
              <h1 className="h1 anim a2">{invite.title}</h1>
              <p className="lead anim a3">{invite.line1}</p>
            </div>

            <div className="inviteMetaGrid anim a4">
              <div className="metaRow">
                <div className="metaLabel">Date</div>
                <div className="metaValue">{invite.date}</div>
              </div>
              <div className="metaRow">
                <div className="metaLabel">Time</div>
                <div className="metaValue">{invite.time}</div>
              </div>
              <div className="metaRow">
                <div className="metaLabel">Venue</div>
                <div className="metaValue">{invite.venue}</div>
              </div>
              <div className="metaRow">
                <div className="metaLabel">Note</div>
                <div className="metaValue">{invite.note}</div>
              </div>
            </div>

            <div className="inviteActions anim a5">
              <a className="btnPrimary" href="#about">
                About seniors
              </a>
              <a className="btnGhost" href="#programs">
                View programs
              </a>
            </div>

            <a className="scrollHint anim a6" href="#about" aria-label="Scroll to About section">
              <span className="scrollHintText">Scroll</span>
              <span className="scrollHintArrow" aria-hidden="true" />
            </a>
          </div>
        </section>

        <Section id="about" title="About our seniors">
          <div className="twoCol">
            <div className="prose">
              <p>
                This farewell is a celebration of the seniors who mentored us,
                organized events, and made our department feel like a family.
              </p>
              <p>
                Add your own message here—keep it short, warm, and personal. You
                can include the batch name, department, and a thank-you note.
              </p>
              <p className="mutedSmall">
                Edit this section in <code>client/src/App.jsx</code>.
              </p>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="statNum">∞</div>
                <div className="statLabel">Memories</div>
              </div>
              <div className="stat">
                <div className="statNum">❤️</div>
                <div className="statLabel">Gratitude</div>
              </div>
              <div className="stat">
                <div className="statNum">🎓</div>
                <div className="statLabel">New journeys</div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="programs" title="Programs hosted during college">
          <div className="mutedSmall">
            This list is loaded from <code>client/public/programs.json</code>. You
            can edit it anytime and redeploy.
          </div>

          {loadingPrograms ? (
            <div className="loading">Loading programs…</div>
          ) : programsError ? (
            <div className="error">{programsError}</div>
          ) : programs.length === 0 ? (
            <div className="empty">
              No programs yet. Add them in <code>client/public/programs.json</code>.
            </div>
          ) : (
            <div className="grid">
              {programs.map((p) => (
                <ProgramCard key={`${p.title}-${p.year ?? ""}`} program={p} />
              ))}
            </div>
          )}
        </Section>

        <footer className="footer">
          <div className="mutedSmall">
            Made with love by your juniors · Farewell 2026
          </div>
        </footer>
      </main>
    </div>
  );
}

