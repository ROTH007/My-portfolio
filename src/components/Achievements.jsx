/* =====================================================================
   ACHIEVEMENTS — your real achievements as hex badges,
   plus the visitor's own achievements unlocked on this site
   ===================================================================== */
import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { achievements } from '../data/profile';
import { useSystem, visitorAchievements } from '../system';

export default function Achievements() {
  const { unlocked } = useSystem();
  const pct = Math.round((unlocked.length / visitorAchievements.length) * 100);

  return (
    <section className="section" id="achievements">
      <SectionHead index="05" title="Achievements" outline="unlocked"
        sub="Milestones reached on the journey so far." />

      <div className="ach-grid">
        {achievements.map((a, i) => (
          <motion.div key={a.title} className="panel ach"
            initial={{ opacity: 0, y: 30, rotateX: -30 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}>
            <div className="ach-icon">{a.icon}</div>
            <div>
              <div className="yr">{a.year}</div>
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </div>
            <motion.span className="stamp"
              initial={{ opacity: 0, scale: 2.2 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.5 + (i % 3) * 0.1, type: 'spring', stiffness: 300 }}>
              UNLOCKED
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Visitor game */}
      <motion.div className="panel visitor-box brackets"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="visitor-head">
          <div>
            <div className="hud-label">Visitor mode</div>
            <h3>Your achievements on this site</h3>
          </div>
          <div className="mono cyan">{unlocked.length} / {visitorAchievements.length} · {pct}%</div>
        </div>
        <div className="progress"><div style={{ width: `${pct}%` }} /></div>
        <div className="visitor-list">
          {visitorAchievements.map((a) => {
            const on = unlocked.includes(a.id);
            return (
              <div key={a.id} className={`v-item ${on ? 'on' : ''}`}>
                <span style={{ fontSize: 22 }}>{on ? a.icon : '🔒'}</span>
                <span>{a.title}<small>{a.text}</small></span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
