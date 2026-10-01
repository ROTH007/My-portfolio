/* Shared animated section title:  // 01  ABOUT ME */
import { motion } from 'framer-motion';

export const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
};

export default function SectionHead({ index, title, outline, sub }) {
  return (
    <motion.div className="section-head" {...reveal}>
      <div className="section-index">// {index}</div>
      <h2 className="section-title">
        {title} {outline && <em>{outline}</em>}
      </h2>
      {sub && <p className="section-sub">{sub}</p>}
    </motion.div>
  );
}
