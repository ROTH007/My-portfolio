/* =====================================================================
   SYSTEM CONTEXT — sound, voice, achievements, toasts, assistant
   Every component can use: const sys = useSystem();
   ===================================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const SystemContext = createContext(null);
export const useSystem = () => useContext(SystemContext);

/* Achievements a visitor can unlock while exploring the site */
export const visitorAchievements = [
  { id: 'online',   icon: '⚡', title: 'System Online',   text: 'Booted the portfolio.' },
  { id: 'painter',  icon: '🖌️', title: 'Painter',         text: 'Painted with the brush on the portrait.' },
  { id: 'suitup',   icon: '🛡️', title: 'Suit Up',         text: 'Activated the nano-suit.' },
  { id: 'briefing', icon: '📂', title: 'Mission Briefing', text: 'Opened a project briefing.' },
  { id: 'contact',  icon: '💬', title: 'First Contact',   text: 'Talked to the AI assistant.' },
  { id: 'explorer', icon: '🧭', title: 'Explorer',        text: 'Visited every section.' },
];

/* ---------- Tiny sound effects with Web Audio (no files needed) ---------- */
let audioCtx = null;
function beep(freq = 880, dur = 0.08, type = 'sine', vol = 0.05) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur);
  } catch { /* audio not available */ }
}

export function SystemProvider({ children }) {
  const [soundOn, setSoundOn] = useState(true);
  const [unlocked, setUnlocked] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;
  const unlockedRef = useRef(new Set());

  const sfx = useCallback((kind = 'click') => {
    if (!soundRef.current) return;
    const map = {
      click: [1200, 0.05, 'square', 0.025],
      hover: [1800, 0.03, 'sine', 0.015],
      open:  [660, 0.12, 'triangle', 0.05],
      boot:  [220, 0.4, 'sawtooth', 0.03],
      unlock:[990, 0.18, 'triangle', 0.06],
      type:  [2400, 0.015, 'square', 0.008],
    };
    const [f, d, t, v] = map[kind] || map.click;
    beep(f, d, t, v);
    if (kind === 'unlock') setTimeout(() => beep(1480, 0.22, 'triangle', 0.05), 110);
  }, []);

  /* Voice (browser speech) */
  const speak = useCallback((text) => {
    if (!soundRef.current || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const pick =
      voices.find(v => /en-GB/i.test(v.lang) && /male|daniel|george|arthur|ryan/i.test(v.name)) ||
      voices.find(v => /en-GB/i.test(v.lang)) ||
      voices.find(v => /^en/i.test(v.lang));
    if (pick) u.voice = pick;
    u.rate = 1.02;
    u.pitch = 0.9;
    synth.speak(u);
  }, []);

  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(list => [...list, { ...t, key: t.id, id }]);
    setTimeout(() => setToasts(list => list.filter(x => x.id !== id)), 4200);
  }, []);

  const unlock = useCallback((id) => {
    if (unlockedRef.current.has(id)) return;
    const a = visitorAchievements.find(x => x.id === id);
    if (!a) return;
    unlockedRef.current.add(id);
    setUnlocked([...unlockedRef.current]);
    sfx('unlock');
    toast({ kind: 'achievement', ...a });
  }, [sfx, toast]);

  // Load voices early (Chrome loads them async)
  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    if (!soundOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [soundOn]);

  const value = useMemo(() => ({
    soundOn, setSoundOn, sfx, speak,
    unlocked, unlock, toasts, toast,
    assistantOpen, setAssistantOpen,
  }), [soundOn, sfx, speak, unlocked, unlock, toasts, toast, assistantOpen]);

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

/* Smooth-scroll to a section by id */
export function goTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
