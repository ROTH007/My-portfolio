/* =====================================================================
   PROJECTS — filter tabs, 3D tilt holo-cards, "mission briefing" modal
   ===================================================================== */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { projects } from '../data/profile';
import { useSystem } from '../system';

/* ---------- Live website preview in a browser frame ----------
   Shows the real site in a scaled-down iframe (or a screenshot if p.image is set). */
function LivePreview({ p, interactive = false }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [loaded, setLoaded] = useState(false);
  const VW = 1440, VH = 900;  // the site is rendered at desktop size, then scaled

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / VW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const host = p.live.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return (
    <div className="browser">
      <div className="browser-bar">
        <i /><i /><i />
        <span className="browser-url">🔒 {host}</span>
        <span className="live-dot"><b />LIVE</span>
      </div>
      <div className="browser-view" ref={boxRef} style={{ aspectRatio: `${VW} / ${VH}` }}>
        {p.image ? (
          <img src={p.image} alt={p.title} />
        ) : (
          <>
            {!loaded && <div className="browser-loading">ESTABLISHING LINK<span className="caret" /></div>}
            <iframe
              title={p.title}
              src={p.live}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              style={{ width: VW, height: VH, transform: `scale(${scale})`, pointerEvents: interactive ? 'auto' : 'none' }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Featured live project (big card) ---------- */
function Featured({ p, index, onOpen }) {
  return (
    <motion.article className="panel featured brackets"
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.12 }}>
      <div className="featured-preview" onClick={() => onOpen(p)} data-hover>
        <LivePreview p={p} />
      </div>
      <div className="featured-info">
        <div className="proj-top">
          <span>LIVE-{String(index + 1).padStart(2, '0')} · {p.year}</span>
          <span className="tag">{p.tag}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <div className="proj-stack">
          {p.stack.map((s) => <span className="chip small" key={s}>{s}</span>)}
        </div>
        <div className="featured-btns">
          <a className="btn solid" href={p.live} target="_blank" rel="noreferrer">Visit site ↗</a>
          <button className="btn" onClick={() => onOpen(p)}>Briefing ▸</button>
        </div>
      </div>
    </motion.article>
  );
}

function TiltCard({ p, index, onOpen }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty('--mx', `${px * 100}%`);
    e.currentTarget.style.setProperty('--my', `${py * 100}%`);
    setRot({ x: (0.5 - py) * 10, y: (px - 0.5) * 12 });
  };
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      {/* inner div does the 3D tilt, outer article does the enter/exit animation */}
      <div
        className="panel proj-card" data-hover
        onMouseMove={onMove} onMouseLeave={() => setRot({ x: 0, y: 0 })}
        style={{ transform: `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
        onClick={() => onOpen(p)}
      >
        <div className="shine" />
        <div className="proj-top">
          <span>PRJ-{String(index + 1).padStart(2, '0')} · {p.year}</span>
          <span className="tag">{p.live && <span className="live-dot inline"><b />LIVE · </span>}{p.tag}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <div className="proj-stack">
          {p.stack.map((s) => <span className="chip small" key={s}>{s}</span>)}
        </div>
        <span className="proj-open">OPEN BRIEFING ▸</span>
      </div>
    </motion.article>
  );
}

function Briefing({ p, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <motion.div className="modal-back" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="panel modal brackets" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
        <div className="modal-head">
          <div>
            <div className="hud-label">Mission briefing · {p.tag} · {p.year}</div>
            <h3>{p.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {p.live && (
          <div style={{ marginTop: 20 }}>
            <LivePreview p={p} interactive />
            <div className="hud-label" style={{ marginTop: 8, opacity: .7 }}>Live preview — you can scroll and click inside</div>
          </div>
        )}
        <p>{p.details}</p>
        <ul className="feat">
          {p.features.map((f, i) => (
            <motion.li key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }}>{f}</motion.li>
          ))}
        </ul>
        <div className="proj-stack" style={{ marginTop: 22 }}>
          {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
        </div>
        {(p.link || p.repo) && (
          <div className="modal-links">
            {p.link && <a className="btn solid" href={p.link} target="_blank" rel="noreferrer">Visit live site ↗</a>}
            {p.repo && <a className="btn gold" href={p.repo} target="_blank" rel="noreferrer">Source code ↗</a>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const { sfx, unlock } = useSystem();
  const tags = useMemo(() => ['All', ...new Set(projects.map((p) => p.tag))], []);
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);
  const list = filter === 'All' ? projects : projects.filter((p) => p.tag === filter);

  const openP = (p) => { sfx('open'); unlock('briefing'); setOpen(p); };
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="section" id="projects">
      <SectionHead index="03" title="Project" outline="archive"
        sub="Missions completed so far. The first ones are live — try them right here." />

      {featured.length > 0 && (
        <>
          <div className="hud-label" style={{ marginBottom: 16 }}><span className="live-dot inline"><b /></span> Live deployments</div>
          <div className="featured-list">
            {featured.map((p, i) => <Featured key={p.id} p={p} index={i} onOpen={openP} />)}
          </div>
          <div className="hud-label" style={{ margin: '56px 0 16px' }}>Full archive</div>
        </>
      )}

      <div className="tabs">
        {tags.map((t) => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`}
            onClick={() => { setFilter(t); sfx('click'); }}>
            {filter === t && <motion.span layoutId="projtab" className="tab-bg" />}
            <span>{t}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="proj-grid">
        <AnimatePresence mode="popLayout">
          {list.map((p) => <TiltCard key={p.id} p={p} index={projects.indexOf(p)} onOpen={openP} />)}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{open && <Briefing p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}