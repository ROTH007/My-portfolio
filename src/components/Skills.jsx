/* =====================================================================
   SKILLS — tabbed power gauges that fill up when seen,
   plus two scrolling rows of tech chips
   ===================================================================== */
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import SectionHead from './SectionHead';
import { skillGroups, techCloud } from '../data/profile';
import { useSystem } from '../system';

function Gauge({ name, level, delay }) {
  const R = 46, C = 2 * Math.PI * R;
  return (
    <motion.div className="panel gauge"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      transition={{ delay, duration: 0.4 }}>
      <svg viewBox="-60 -60 120 120">
        <circle r={R + 8} fill="none" stroke="#3de0ff" strokeOpacity=".15" strokeDasharray="1 5" />
        <circle r={R} fill="none" stroke="rgba(61,224,255,.12)" strokeWidth="7" />
        <motion.circle r={R} fill="none" stroke="url(#gg)" strokeWidth="7" strokeLinecap="round"
          transform="rotate(-90)" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - level / 100) }}
          transition={{ delay: delay + 0.15, duration: 1.3, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ filter: 'drop-shadow(0 0 4px #3de0ff)' }} />
        <defs>
          <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3de0ff" /><stop offset="1" stopColor="#ffc861" />
          </linearGradient>
        </defs>
        <text className="val" textAnchor="middle" dy="8">{level}%</text>
      </svg>
      <h4>{name}</h4>
    </motion.div>
  );
}

export default function Skills() {
  const [tab, setTab] = useState(skillGroups[0].id);
  const { sfx } = useSystem();
  const group = skillGroups.find((g) => g.id === tab);
  const boxRef = useRef(null);
  const seen = useInView(boxRef, { once: true, amount: 0.15 });

  return (
    <section className="section" id="skills">
      <SectionHead index="02" title="Skill" outline="modules"
        sub="Power levels of every module installed in the system. Pick a category." />

      <div className="tabs">
        {skillGroups.map((g) => (
          <button key={g.id} className={`tab ${tab === g.id ? 'active' : ''}`}
            onClick={() => { setTab(g.id); sfx('click'); }}>
            {tab === g.id && <motion.span layoutId="tabbg" className="tab-bg" />}
            <span>{g.label}</span>
          </button>
        ))}
      </div>

      {/* Gauges only start filling once you scroll to them */}
      <div ref={boxRef} style={{ minHeight: 200 }}>
        <AnimatePresence mode="wait">
          {seen && (
            <motion.div key={tab} className="gauges" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {group.skills.map((s, i) => <Gauge key={s.name} {...s} delay={i * 0.07} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {[...techCloud, ...techCloud].map((t, i) => <span className="chip" key={i}>{t}</span>)}
        </div>
      </div>
      <div className="marquee rev">
        <div className="marquee-track">
          {[...techCloud.slice().reverse(), ...techCloud.slice().reverse()].map((t, i) => <span className="chip" key={i}>{t}</span>)}
        </div>
      </div>
    </section>
  );
}
