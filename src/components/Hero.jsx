/* =====================================================================
   HERO — name, typing role, nano portrait in HUD rings, status cards
   ===================================================================== */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NanoPortrait from './NanoPortrait';
import { profile, assistant } from '../data/profile';
import { useSystem, goTo } from '../system';

const ROLES = ['Software Developer', 'Full-stack Builder', 'UI / UX Enthusiast', 'AI Tinkerer', 'Creative Coder'];

function TypingRole() {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = ROLES[i % ROLES.length];
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, text.length + 1);
        setText(next);
        if (next === word) setTimeout(() => setDel(true), 1300);
      } else {
        const next = word.slice(0, text.length - 1);
        setText(next);
        if (!next) { setDel(false); setI(i + 1); }
      }
    }, del ? 40 : 75);
    return () => clearTimeout(t);
  }, [text, del, i]);
  return <div className="hero-role">&gt; {text}<span className="caret" /></div>;
}

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: d, ease: [0.2, 0.7, 0.2, 1] },
});

export default function Hero({ booted }) {
  const { unlock, sfx, setAssistantOpen } = useSystem();
  const [suited, setSuited] = useState(true);

  const onSuitChange = (on) => {
    setSuited(on);
    sfx('open');
    if (on) unlock('suitup');
  };

  return (
    <section className="hero" id="home">
      {/* LEFT */}
      <div className="hero-left">
        {booted && (
          <>
            <motion.div className="hero-tag hud-label" {...fade(0.1)}>
              <span className="dot-live" /> Identity confirmed
            </motion.div>
            <motion.h1 className="hero-name" {...fade(0.2)}>
              {profile.nameLines.map((l) => (
                <span key={l} className="glitch" data-text={l}>{l}</span>
              ))}
            </motion.h1>
            <motion.div {...fade(0.35)}><TypingRole /></motion.div>
            <motion.ul className="hero-info" {...fade(0.5)}>
              <li><i>LOC</i>{profile.location}</li>
              <li><i>EDU</i>{profile.study}</li>
              <li><i>DEV</i>{profile.focus}</li>
            </motion.ul>
            <motion.div className="hero-cta" {...fade(0.65)}>
              <button className="btn" onClick={() => goTo('projects')}>View projects ▸</button>
              <button className="btn gold" onClick={() => setAssistantOpen(true)}>Talk to {assistant.name}</button>
            </motion.div>
          </>
        )}
      </div>

      {/* CENTER */}
      <div className="hero-center">
        <div className="hero-rings">
          <svg viewBox="-200 -200 400 400">
            <circle className="spin-rev" r="196" fill="none" stroke="#3de0ff" strokeOpacity=".18" strokeDasharray="2 6" />
            <g className="spin">
              <circle r="176" fill="none" stroke="#3de0ff" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="120 40 20 40" />
            </g>
            <g className="spin-rev">
              <circle r="160" fill="none" stroke="#ffc861" strokeOpacity=".35" strokeWidth="2" strokeDasharray="40 200" />
            </g>
            {Array.from({ length: 4 }).map((_, i) => (
              <text key={i} x="0" y="-182" fill="#3de0ff" fillOpacity=".5" fontSize="7" textAnchor="middle"
                fontFamily="Share Tech Mono" transform={`rotate(${i * 90 + 45})`}>
                {['SYS.SCAN', 'BIO.OK', 'NANO.RDY', 'LINK.ON'][i]}
              </text>
            ))}
          </svg>
        </div>
        <NanoPortrait
          photo={profile.photo}
          suit={profile.suit}
          active={booted}
          onPaint={() => unlock('painter')}
          onSuitChange={onSuitChange}
        />
        <div className="portrait-fade" />
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        {booted && (
          <>
            {profile.status.map((s, i) => (
              <motion.div key={s.label} className="panel status-card" {...fade(0.4 + i * 0.12)}>
                <div className="hud-label">{s.label}</div>
                <div className="t">{s.title}</div>
                <div className="s">{s.sub}</div>
                {i === 0 && (
                  <div className="mini-bars">
                    {Array.from({ length: 18 }).map((_, k) => (
                      <span key={k} style={{ animationDelay: `${(k * 137) % 900}ms` }} />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <motion.button
              {...fade(0.7)}
              className={`panel suit-btn ${suited ? 'on' : ''}`}
              onClick={() => window.dispatchEvent(new Event('nano:toggle'))}
            >
              <span className="ring" />
              <span>
                <strong>{suited ? 'POWER DOWN' : 'SUIT UP'}</strong>
                <small>or click the photo</small>
              </span>
            </motion.button>
          </>
        )}
      </div>

      <div className="scroll-hint">SCROLL</div>
    </section>
  );
}
