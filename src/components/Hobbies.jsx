/* =====================================================================
   HOBBIES — icons orbit a glowing core. Hover / tap one to see it.
   ===================================================================== */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHead, { reveal } from './SectionHead';
import { hobbies } from '../data/profile';
import { useSystem } from '../system';

export default function Hobbies() {
  const [active, setActive] = useState(0);
  const { sfx } = useSystem();
  const h = hobbies[active];
  const pick = (i) => { if (i !== active) { setActive(i); sfx('hover'); } };

  return (
    <section className="section" id="hobbies">
      <SectionHead index="06" title="Off" outline="duty"
        sub="What I do when I am not coding. Hover the orbit." />

      <div className="orbit-wrap">
        <motion.div className="orbit" {...reveal}>
          <div className="orbit-ring" />
          <div className="orbit-ring r2" />
          <div className="orbit-spin">
            {hobbies.map((x, i) => {
              const a = (i / hobbies.length) * Math.PI * 2 - Math.PI / 2;
              const r = 41; // % of the orbit size
              return (
                <div key={x.name} className="orbit-item"
                  style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}>
                  <div className="orbit-item-inner">
                    <button className={`orbit-btn ${i === active ? 'active' : ''}`}
                      onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}
                      aria-label={x.name}>
                      {x.icon}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="orbit-core">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}>
                <span>{h.icon}</span>
                <b>{h.name}</b>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="panel hobby-detail brackets" {...reveal}>
          <div className="hud-label">Hobby {String(active + 1).padStart(2, '0')} / {String(hobbies.length).padStart(2, '0')}</div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h3>{h.icon} {h.name}</h3>
              <p>{h.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="hobby-list">
            {hobbies.map((x, i) => (
              <button key={x.name} className={`tab ${i === active ? 'active' : ''}`} onClick={() => pick(i)}>
                {i === active && <motion.span layoutId="hobbytab" className="tab-bg" />}
                <span>{x.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
