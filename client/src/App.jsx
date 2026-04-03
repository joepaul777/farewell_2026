import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

const MEDIA_JPEGS = [
  "/media/4.jpeg",
  "/media/898.jpeg",
  "/media/a.jpeg",
  "/media/asdasd.jpeg",
  "/media/cvbxcvbxcvbxcb.jpeg",
  "/media/d.jpeg",
  "/media/dfgdfg.jpeg",
  "/media/ert.jpeg",
  "/media/fdfsdfsdf.jpeg",
  "/media/fgh.jpeg",
  "/media/h.jpeg",
  "/media/k.jpeg",
  "/media/kiu.jpeg",
  "/media/M.jpeg",
  "/media/rfdf.jpeg",
  "/media/sdf.jpeg",
  "/media/uk.jpeg",
  "/media/we.jpeg",
  "/media/wef.jpeg",
  "/media/WhatsA.jpeg",
  "/media/WhatsApp%20.jpeg",
  "/media/WhatsApp%20Image%202026-04%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206..jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.20%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.21%20.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.21%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.22%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.23%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.25%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.26%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48.asdasd25%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.48M.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.49.52%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.50.14%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.51.21%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.51.23%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.51.25%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.51.26%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-02%20at%206.51.31%20PM.jpeg",
  "/media/WhatsApp%20Image%202026-04-0426%20PM.jpeg",
  "/media/WhatsApp%20Image%2020265%20PM.jpeg",
  "/media/WhatsApp%20Image%202at%206.51.23%20PM.jpeg",
  "/media/xcvb.jpeg",
  "/media/xcvbs.jpeg",
  "/media/yk.jpeg"
];

function PhotoStripsBackground() {
  const rows = 5;
  const images = MEDIA_JPEGS.length ? MEDIA_JPEGS : ["/media/photo1.jpg"];

  return (
    <div className="photoStrips" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const dir = rowIdx % 2 === 0 ? "ltr" : "rtl";
        const speedClass = `spd${(rowIdx % 3) + 1}`;
        const rowClass = `stripRow ${dir} ${speedClass}`;

        // repeat images so the strip loops seamlessly
        const repeated = [...images, ...images];
        return (
          <div className={rowClass} key={`row-${rowIdx}`}>
            <div className="stripTrack">
              {repeated.map((src, i) => (
                <div className="stripItem" key={`${rowIdx}-${i}-${src}`}>
                  <img className="stripImg" src={src} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="stripTint" />
    </div>
  );
}

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
  const [selectedImage, setSelectedImage] = useState(null);
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

  useEffect(() => {
    const isInvite = location.pathname === "/";
    const prevOverflow = document.body.style.overflow;
    const prevHeight = document.body.style.height;
    const prevOverscroll = document.body.style.overscrollBehavior;

    if (isInvite) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100svh";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.height = prevHeight || "";
      document.body.style.overscrollBehavior = prevOverscroll || "";
    }

    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.height = prevHeight || "";
      document.body.style.overscrollBehavior = prevOverscroll || "";
    };
  }, [location.pathname]);

  return (
    <div className="page">
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <section className="inviteCover inviteNoChrome">
                <PhotoStripsBackground />
                <div className="inviteTextOnly">
                  <div className="inviteWordmark anim a2" aria-label="ALVIDA Seniors Farewell">
                    <div className="wmLeft">ALVIDA</div>
                    <div className="wmRight">
                      <div className="wmSmall">SENIOR&apos;S</div>
                      <div className="wmSmall">FAREWELL</div>
                    </div>
                  </div>
                  <Link className="btnContinue anim a4" to="/memories">
                    <span className="btnContinueText">Continue</span>
                    <span className="btnContinueArrow" aria-hidden="true" />
                  </Link>
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
                      <div 
                        className={className} 
                        style={style} 
                        key={`${src}-${idx}`}
                        onClick={() => setSelectedImage(src)}
                      >
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

                {selectedImage && (
                  <div className="lightboxOverlay" onClick={() => setSelectedImage(null)}>
                    <div className="lightboxContent" onClick={(e) => e.stopPropagation()}>
                      <button className="lightboxClose" onClick={() => setSelectedImage(null)}>&times;</button>
                      {selectedImage.endsWith('.mp4') ? (
                        <video src={selectedImage} className="lightboxMedia" controls autoPlay playsInline />
                      ) : (
                        <img src={selectedImage} className="lightboxMedia" alt="Expanded memory" />
                      )}
                    </div>
                  </div>
                )}
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

