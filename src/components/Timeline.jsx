/* =====================================================================
   LEARNING TIMELINE — the glowing line fills as you scroll
   ===================================================================== */
import { useRef } from 'react';
import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { timeline } from '../data/profile';

export default function Timeline() {
  const ref = useRef(null);

  return (
    <section className="section" id="learning">
      <SectionHead index="04" title="What I" outline="learned"
        sub="Upgrade log — every stage of my training so far." />

      <div className="timeline" ref={ref}>
        {timeline.map((t, i) => (
          <motion.div key={i} className="tl-item"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}>
            <div className="tl-when-cell">{t.when}</div>
            <div className="tl-card">
              <h4>{t.title}</h4>
              <p>{t.text}</p>
            </div>
            <div className="tl-tags-cell">
              {t.tags.map((g) => <span className="chip small" key={g}>{g}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
