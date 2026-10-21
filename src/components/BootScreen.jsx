/* =====================================================================
   BOOT SCREEN — AI system loading sequence
   Rings spin, a log prints, % counts up, then "INITIALIZE" button.
   Clicking it (a real user click) lets the browser play the voice.
   ===================================================================== */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { assistant, profile } from '../data/profile';
import { useSystem } from '../system';

const LOG = [
  'Initializing neural interface',
  'Loading identity matrix',
  'Mounting project database',
  'Calibrating nano-suit particles',
  'Syncing skill modules',
  'Establishing secure uplink',
  `Waking up ${assistant.name}`,
];

export default function BootScreen({ onDone }) {
  const { sfx, speak, unlock } = useSystem();
  const [pct, setPct] = useState(0);
  const [lines, setLines] = useState([]);
  const ready = pct >= 100;

  // Progress counter
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 6 + 1.5);
      setPct(Math.floor(p));
      if (p >= 100) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, []);

  // Log lines appear with the progress
  useEffect(() => {
    const n = Math.min(LOG.length, Math.floor((pct / 100) * (LOG.length + 0.5)));
    if (n > lines.length) setLines(LOG.slice(0, n));
  }, [pct, lines.length]);

  const enter = () => {
    sfx('boot');
    unlock('online');
    speak(`${assistant.greeting}`);
    onDone();
  };

  // Press Enter key when ready
  useEffect(() => {
    if (!ready) return;
    const onKey = (e) => { if (e.key === 'Enter') enter(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <motion.div
      className="boot"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="boot-meta">
        <div>{assistant.name} OS v2.6</div>
        <div>USER: {profile.shortName}</div>
        <div>LOC: {profile.location.toUpperCase()}</div>
        <div className="cyan">SECURE CHANNEL ✓</div>
      </div>

      <div className="boot-core">
        <div className="boot-center">
          <div className="boot-percent">{pct}%</div>
          <div className="boot-name">{ready ? 'SYSTEM ONLINE' : 'LOADING'}</div>
          <div className="boot-bar"><div style={{ width: `${pct}%` }} /></div>
          {ready && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <button className="btn solid boot-enter" onClick={enter} data-hover>
                Initialize ▸
              </button>
              <div className="boot-hint">PRESS ENTER</div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="boot-log">
        {lines.map((l, i) => (
          <motion.p key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            &gt; {l}... <span>{i < lines.length - 1 || ready ? 'OK' : '▒▒'}</span>
          </motion.p>
        ))}
      </div>

      <button className="boot-skip" onClick={enter}>SKIP ▸▸</button>
    </motion.div>
  );
}
