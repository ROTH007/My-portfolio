/* =====================================================================
   LEARNING TIMELINE — the glowing line fills as you scroll
   ===================================================================== */
import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SectionHead from './SectionHead';
import { timeline } from '../data/profile';

export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section className="section" id="learning">
      <SectionHead index="04" title="What I" outline="learned"
        sub="Upgrade log — every stage of my training so far." />

      <div className="timeline" ref={ref}>
        <div className="tl-line"><motion.div className="tl-fill" style={{ scaleY }} /></div>
        {timeline.map((t, i) => (
          <motion.div key={i} className={`tl-item ${i % 2 ? 'right' : 'left'}`}
            initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
            <motion.div className="tl-node"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }} />
            <div className="panel tl-card">
              <div className="tl-when">{t.when}</div>
              <h4>{t.title}</h4>
              <p>{t.text}</p>
              <div className="tl-tags">
                {t.tags.map((g) => <span className="chip small" key={g}>{g}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
