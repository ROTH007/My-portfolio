/* =====================================================================
   HOBBIES — icons orbit a glowing core. Hover / tap one to see it.
   ===================================================================== */
import { motion } from 'framer-motion';
import SectionHead, { reveal } from './SectionHead';
import { hobbies } from '../data/profile';
import { useSystem } from '../system';

export default function Hobbies() {
  const { sfx } = useSystem();

  return (
    <section className="section" id="hobbies">
      <SectionHead index="06" title="Off" outline="duty"
        sub="What I do when I am not coding." />

      <div className="hobby-grid">
        {hobbies.map((h, i) => (
          <motion.div key={h.name} className="hobby-cell" {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.08 }}
            onMouseEnter={() => sfx('hover')}>
            <span className="icon">{h.icon}</span>
            <h4>{h.name}</h4>
            <p>{h.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
