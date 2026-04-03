import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import mediaFiles from "./mediaFiles.json";

const MEDIA_JPEGS = mediaFiles.items
  .filter((i) => i.type === "image")
  .map((i) => i.src);

function PhotoStripsBackground() {
  const rows = 8;
  const images = MEDIA_JPEGS.length ? MEDIA_JPEGS : ["/media/photo1.jpg"];

  return (
    <div className="photoStrips" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const dir = rowIdx % 2 === 0 ? "ltr" : "rtl";
        const speedClass = `spd${(rowIdx % 3) + 1}`;
        const rowClass = `stripRow ${dir} ${speedClass}`;

        const subset = [];
        for (let k = 0; k < 15; k++) {
          subset.push(images[(rowIdx * 17 + k) % images.length]);
        }

        // repeat images so the strip loops seamlessly
        const repeated = [...subset, ...subset];
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

const SLIDESHOW_ITEMS = [
  { src: "/media/group photos/IMG-20260402-WA0023.jpg", quote: "The moments that take our breath away..." },
  { src: "/media/group photos/IMG-20260402-WA0024.jpg", quote: "Friends that became family." },
  { src: "/media/group photos/IMG-20260402-WA0025.jpg", quote: "We didn't realize we were making memories, we just knew we were having fun." },
  { src: "/media/group photos/IMG-20260402-WA0038.jpg", quote: "Some paths are meant to be crossed." },
  { src: "/media/group photos/IMG-20260402-WA0046.jpg", quote: "A journey of a thousand miles begins with a single step." },
  { src: "/media/group photos/IMG-20260403-WA0184.jpg", quote: "To the nights we felt alive." },
  { src: "/media/group photos/IMG-20260403-WA0211.jpg", quote: "Good times and crazy friends make the best memories." },
  { src: "/media/group photos/IMG-20260403-WA0323.jpg", quote: "Together is our favorite place to be." },
  { src: "/media/group photos/WhatsApp Image 2026-04-02 at 6.48.21 PM.jpeg", quote: "Cherishing every single second." },
  { src: "/media/group photos/WhatsApp Image 2026-04-02 at 6.51.21 PM.jpeg", quote: "Laughter is timeless." },
  { src: "/media/group photos/fdfsdfsdf.jpeg", quote: "Our unforgettable chapter." },
  { src: "/media/group photos/h.jpeg", quote: "Here's to the moments that turned into memories." },
  { src: "/media/group photos/kiu.jpeg", quote: "Forever grateful for these souls." },
  { src: "/media/group photos/yk.jpeg", quote: "A beautiful ride from start to finish." }
];

function SlideshowView({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === SLIDESHOW_ITEMS.length - 1) {
          onComplete();
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="slideshowContainer">
      <div className="slideshowCard">
        {SLIDESHOW_ITEMS.map((item, idx) => (
          <div
            key={item.src}
            className={`slideshowSlide ${idx === currentIndex ? "active" : ""}`}
          >
            <img src={item.src} alt="" className="slideshowImg" />
          </div>
        ))}
      </div>
      <div className="inviteActions" style={{ zIndex: 10 }}>
        <button onClick={onComplete} className="btnPrimary skipBtn" style={{ fontFamily: "inherit" }}>
          Skip to Gallery
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [programs, setPrograms] = useState([]);
  const [showSlideshow, setShowSlideshow] = useState(true);
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
                      <div className="batchYear">BATCH 2022-2026</div>
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
              <>
                {showSlideshow && <SlideshowView onComplete={() => setShowSlideshow(false)} />}
                <Section id="memories" title="GALLERY OF MEMORIES">

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
              </>
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

