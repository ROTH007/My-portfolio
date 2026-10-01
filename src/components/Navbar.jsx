/* =====================================================================
   NAVBAR — HUD top bar: logo, section links (auto-highlight),
   clock, sound toggle, achievement counter, scroll progress
   ===================================================================== */
import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { profile } from '../data/profile';
import { useSystem, visitorAchievements, goTo } from '../system';

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'learning', label: 'Learning' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ active }) {
  const { soundOn, setSoundOn, unlocked, sfx } = useSystem();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(t); };
  }, []);

  const go = (e, id) => { e.preventDefault(); sfx('click'); setOpen(false); goTo(id); };

  return (
    <>
      <motion.div className="scroll-bar" style={{ scaleX }} />
      <motion.nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <a href="#home" className="nav-logo" onClick={(e) => go(e, 'home')}>
          {profile.shortName}<b>//</b>OS
        </a>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}
              onClick={(e) => go(e, s.id)} onMouseEnter={() => sfx('hover')}>
              {s.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <span className="nav-clock">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <a href="#achievements" className="nav-pill sys" onClick={(e) => go(e, 'achievements')} title="Your achievements">
            🏆 {unlocked.length}/{visitorAchievements.length}
          </a>
          <button className="nav-pill" onClick={() => setSoundOn(!soundOn)} title="Sound & voice">
            {soundOn ? '🔊' : '🔇'} <span className="nav-clock">{soundOn ? 'VOICE ON' : 'MUTED'}</span>
          </button>
          <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu"><span /></button>
        </div>
      </motion.nav>
    </>
  );
}
