import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

function seededNumber(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

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
  const [gallery, setGallery] = useState([]);
  const [galleryError, setGalleryError] = useState("");
  const location = useLocation();

  const invite = useMemo(
    () => ({
      titleTop: "ALVIDA 2026",
      titleBottom: "Seniors Farewell",
      line1:
        "With lots of love and gratitude, we invite our amazing seniors to the Farewell 2026.",
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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setGalleryError("");
        const res = await fetch("/gallery.json");
        if (!res.ok) throw new Error(`Failed to load gallery (${res.status})`);
        const data = await res.json();
        if (cancelled) return;
        setGallery(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        if (cancelled) return;
        setGalleryError(e instanceof Error ? e.message : "Failed to load gallery");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
          <Link className="navLink" to="/">
            Invitation
          </Link>
          <Link className="navLink" to="/memories">
            Memories
          </Link>
          <Link className="navLink" to="/programs">
            Programs
          </Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <section className="inviteCover inviteBlur">
                <div className="inviteDecor" aria-hidden="true">
                  <div className="blurBlob b1" />
                  <div className="blurBlob b2" />
                  <div className="blurBlob b3" />
                  <div className="spark s1" />
                  <div className="spark s2" />
                  <div className="spark s3" />
                  <div className="spark s4" />
                  <div className="waxSeal" />
                  <div className="floatingDot dot1" />
                  <div className="floatingDot dot2" />
                  <div className="floatingDot dot3" />
                </div>

                <div className="invitePaper inviteFront inviteMinimal">
                  <div className="inviteCenter">
                    <div className="alvida anim a2">ALVIDA 2026</div>
                    <Link className="btnPrimary anim a4" to="/memories">
                      Continue
                    </Link>
                  </div>
                </div>
              </section>
            }
          />

          <Route
            path="/memories"
            element={
              <Section id="memories" title="Gallery of memories">
                <div className="mutedSmall">
                  Add your photos/videos inside <code>client/public/media</code> and
                  list them in <code>client/public/gallery.json</code>.
                </div>

                {galleryError ? <div className="error">{galleryError}</div> : null}

                <div className="collage">
                  {gallery.map((item, idx) => {
                    const src = String(item?.src || "");
                    const type = String(item?.type || "image");
                    const alt = String(item?.alt || "Memory");
                    const poster = String(item?.poster || "");

                    const r1 = seededNumber(`${src}-a`);
                    const r2 = seededNumber(`${src}-b`);
                    const r3 = seededNumber(`${src}-c`);

                    const rot = (r1 * 10 - 5).toFixed(2);
                    const y = (r2 * 10 - 5).toFixed(2);
                    const x = (r3 * 10 - 5).toFixed(2);

                    const className = `tile t${(idx % 6) + 1}`;
                    const style = {
                      transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`
                    };

                    return (
                      <div className={className} style={style} key={`${src}-${idx}`}>
                        {type === "video" ? (
                          <video
                            className="media"
                            src={src}
                            poster={poster || undefined}
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img className="media" src={src} alt={alt} loading="lazy" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            }
          />

          <Route
            path="/programs"
            element={
              <Section id="programs" title="Programs hosted during college">
                <div className="mutedSmall">
                  This list is loaded from <code>client/public/programs.json</code>.
                </div>

                {loadingPrograms ? (
                  <div className="loading">Loading programs…</div>
                ) : programsError ? (
                  <div className="error">{programsError}</div>
                ) : programs.length === 0 ? (
                  <div className="empty">
                    No programs yet. Add them in{" "}
                    <code>client/public/programs.json</code>.
                  </div>
                ) : (
                  <div className="grid">
                    {programs.map((p) => (
                      <ProgramCard key={`${p.title}-${p.year ?? ""}`} program={p} />
                    ))}
                  </div>
                )}
              </Section>
            }
          />

          <Route
            path="*"
            element={
              <Section id="not-found" title="Page not found">
                <div className="mutedSmall">This page doesn’t exist.</div>
                <div className="inviteActions">
                  <Link className="btnPrimary" to="/">
                    Go to invitation
                  </Link>
                </div>
              </Section>
            }
          />
        </Routes>

        <footer className="footer">
          <div className="mutedSmall">
            Made with love by your juniors · Farewell 2026
          </div>
        </footer>
      </main>
    </div>
  );
}

