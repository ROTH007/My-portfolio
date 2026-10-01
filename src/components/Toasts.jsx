/* Achievement-unlocked popups (top right) */
import { AnimatePresence, motion } from 'framer-motion';
import { useSystem } from '../system';

export default function Toasts() {
  const { toasts } = useSystem();
  return (
    <div className="toasts">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} className="toast"
            initial={{ opacity: 0, x: 80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <span className="ic">{t.icon}</span>
            <div>
              <small>ACHIEVEMENT UNLOCKED</small>
              <b>{t.title}</b>
              <p>{t.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
