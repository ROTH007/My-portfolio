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

  const R = 160, C = 2 * Math.PI * R;

  return (
    <motion.div
      className="boot"
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="boot-grid" />

      <div className="boot-meta">
        <div>{assistant.name} OS v2.6</div>
        <div>USER: {profile.shortName}</div>
        <div>LOC: {profile.location.toUpperCase()}</div>
        <div className="cyan">SECURE CHANNEL ✓</div>
      </div>

      <div className="boot-core">
        <svg viewBox="-200 -200 400 400">
          <defs>
            <filter id="bglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {/* Outer tick ring */}
          <g className="spin-rev" opacity=".55">
            {Array.from({ length: 72 }).map((_, i) => (
              <line key={i} x1="0" y1={-190} x2="0" y2={i % 6 ? -182 : -174}
                stroke="#3de0ff" strokeWidth={i % 6 ? 1 : 2} transform={`rotate(${i * 5})`} />
            ))}
          </g>
          {/* Dashed ring */}
          <circle className="spin" r="140" fill="none" stroke="#3de0ff" strokeOpacity=".35" strokeWidth="6" strokeDasharray="4 10" />
          {/* Arc segments */}
          <g className="spin-fast" filter="url(#bglow)">
            <circle r="120" fill="none" stroke="#ffc861" strokeWidth="3" strokeDasharray="60 694" />
            <circle r="120" fill="none" stroke="#3de0ff" strokeWidth="3" strokeDasharray="30 724" strokeDashoffset="-380" />
          </g>
          {/* Progress ring */}
          <circle r={R} fill="none" stroke="#3de0ff" strokeOpacity=".12" strokeWidth="4" />
          <circle r={R} fill="none" stroke="#3de0ff" strokeWidth="4" filter="url(#bglow)"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90)"
            style={{ transition: 'stroke-dashoffset .1s linear' }} strokeLinecap="round" />
          {/* Inner reactor */}
          <g className="spin-rev">
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x="-6" y="-92" width="12" height="22" rx="2" fill="#3de0ff" fillOpacity=".25"
                stroke="#3de0ff" strokeOpacity=".6" transform={`rotate(${i * 36})`} />
            ))}
          </g>
          <circle r="62" fill="none" stroke="#3de0ff" strokeOpacity=".4" />
        </svg>

        <div className="boot-center">
          <div className="boot-percent">{pct}%</div>
          <div className="boot-name">{ready ? 'SYSTEM ONLINE' : 'LOADING'}</div>
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
