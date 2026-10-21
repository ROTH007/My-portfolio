/* =====================================================================
   SKILLS — tabbed power gauges that fill up when seen,
   plus two scrolling rows of tech chips
   ===================================================================== */
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import SectionHead from './SectionHead';
import { skillGroups, techCloud } from '../data/profile';
import { useSystem } from '../system';

function Bar({ name, level, delay }) {
  return (
    <motion.div className="bar-row"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.35 }}>
      <span className="name">{name}</span>
      <div className="bar-track">
        <motion.div className="bar-fill"
          initial={{ width: 0 }} animate={{ width: `${level}%` }}
          transition={{ delay: delay + 0.1, duration: 1, ease: [0.2, 0.7, 0.2, 1] }} />
      </div>
      <span className="pct">{level}%</span>
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

      {/* Bars only start filling once you scroll to them */}
      <div ref={boxRef} className="skills-box" style={{ minHeight: 160 }}>
        <AnimatePresence mode="wait">
          {seen && (
            <motion.div key={tab} className="bars" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {group.skills.map((s, i) => <Bar key={s.name} {...s} delay={i * 0.07} />)}
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
