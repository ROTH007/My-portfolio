/* =====================================================================
   APP — puts everything together
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SystemProvider, useSystem } from './system';
import { profile, assistant } from './data/profile';
import BootScreen from './components/BootScreen';
import HudBackground from './components/HudBackground';
import Cursor from './components/Cursor';
import Navbar, { SECTIONS } from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Achievements from './components/Achievements';
import Hobbies from './components/Hobbies';
import Contact from './components/Contact';
import Assistant from './components/Assistant';
import Toasts from './components/Toasts';

function Site() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState('home');
  const seen = useRef(new Set());
  const { unlock } = useSystem();

  // lock scrolling during boot
  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden';
  }, [booted]);

  // which section is on screen → navbar highlight + "Explorer" achievement
  useEffect(() => {
    if (!booted) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        setActive(e.target.id);
        seen.current.add(e.target.id);
        if (SECTIONS.every((s) => seen.current.has(s.id))) unlock('explorer');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['home', ...SECTIONS.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [booted, unlock]);

  const [start] = useState(Date.now());
  const [uptime, setUptime] = useState('00:00');
  useEffect(() => {
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      setUptime(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, [start]);

  return (
    <>
      <HudBackground />
      <Cursor />
      <AnimatePresence>{!booted && <BootScreen key="boot" onDone={() => setBooted(true)} />}</AnimatePresence>

      {booted && <Navbar active={active} />}
      <main>
        <Hero booted={booted} />
        {booted && (
          <>
            <About />
            <Skills />
            <Projects />
            <Timeline />
            <Achievements />
            <Hobbies />
            <Contact />
          </>
        )}
      </main>
      {booted && (
        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.shortName} · Built with React</span>
          <span>{assistant.name} OS · UPTIME {uptime} · ALL SYSTEMS NOMINAL</span>
        </footer>
      )}
      {booted && <Assistant />}
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <Site />
    </SystemProvider>
  );
}
