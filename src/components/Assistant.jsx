/* =====================================================================
   AI ASSISTANT — floating core + chat panel
   Visitors type (or tap a chip). The assistant answers with a typing
   effect, speaks out loud, and can scroll the page or trigger the suit.
   Press "/" anywhere to open it.
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assistant, profile, projects, skillGroups, hobbies, achievements } from '../data/profile';
import { useSystem, goTo } from '../system';

const CHIPS = ['Who is he?', 'Show projects', 'Top skills', 'Suit up', 'Hobbies', 'Contact', 'Help'];

const JOKES = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'I would tell you a UDP joke, but you might not get it.',
  'There are 10 kinds of people: those who understand binary and those who do not.',
];

/* ✏️ The "brain": keyword → answer (+ optional action) */
function think(input) {
  const q = input.toLowerCase();
  const has = (...w) => w.some((x) => q.includes(x));
  const top = skillGroups.flatMap((g) => g.skills).sort((a, b) => b.level - a.level).slice(0, 5);

  if (has('hello', 'hi ', 'hey', 'good morning', 'good evening') || q.trim() === 'hi')
    return { text: `Hello. I am ${assistant.name}, ${profile.shortName}'s assistant. Ask me about projects, skills, hobbies — or type "help".` };
  if (has('help', 'command', 'what can'))
    return { text: 'Try:\n• who is he\n• projects / skills / learning\n• achievements / hobbies\n• contact\n• suit up\n• tell me a joke\n• mute' };
  if (has('suit', 'armor', 'armour', 'transform', 'nano'))
    return { text: 'Deploying nano-suit. Watch the portrait.', action: () => { goTo('home'); setTimeout(() => window.dispatchEvent(new Event('nano:toggle')), 600); } };
  if (has('who', 'about', 'yourself', 'him', 'bio', 'introduce'))
    return { text: `${profile.shortName} is a ${profile.role.toLowerCase()} from ${profile.location}. ${profile.bio[2] || ''}`, go: 'about' };
  if (has('live', 'website', 'deploy', 'demo', 'cinema', 'lotus'))
    return { text: `Live deployments: ${projects.filter((p) => p.live).map((p) => p.title).join(' and ')}. You can try them right inside the project section.`, go: 'projects' };
  if (has('project', 'work', 'portfolio', 'built', 'build'))
    return { text: `${projects.length} missions in the archive. Highlights: ${projects.slice(0, 3).map((p) => p.title).join(', ')}. Opening the archive now.`, go: 'projects' };
  if (has('skill', 'stack', 'tech', 'language', 'good at'))
    return { text: `Strongest modules: ${top.map((s) => `${s.name} (${s.level}%)`).join(', ')}.`, go: 'skills' };
  if (has('learn', 'study', 'school', 'university', 'timeline', 'education'))
    return { text: `He studies at Norton University. Scroll the upgrade log to see what he learned each year.`, go: 'learning' };
  if (has('achiev', 'award', 'milestone'))
    return { text: `Top milestone: ${achievements[0].title}. You can also unlock visitor achievements on this site.`, go: 'achievements' };
  if (has('hobb', 'fun', 'free time', 'gym', 'game'))
    return { text: `Off duty: ${hobbies.map((h) => h.name).join(', ')}.`, go: 'hobbies' };
  if (has('contact', 'email', 'hire', 'reach', 'message', 'telegram'))
    return { text: `You can reach him at ${profile.email}. Opening a secure channel.`, go: 'contact' };
  if (has('intern', 'job', 'company', 'today'))
    return { text: profile.bio[2] || 'Currently working as a software intern.', go: 'about' };
  if (has('time', 'clock'))
    return { text: `Local time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` };
  if (has('joke', 'funny', 'laugh'))
    return { text: JOKES[Math.floor(Math.random() * JOKES.length)] };
  if (has('mute', 'quiet', 'stop talking', 'voice off'))
    return { text: 'Voice disabled. I will stay quiet.', mute: true };
  if (has('voice on', 'unmute', 'talk'))
    return { text: 'Voice enabled.', unmute: true };
  if (has('thank'))
    return { text: 'Always a pleasure.' };
  if (has('top', 'home', 'start'))
    return { text: 'Returning to the main display.', go: 'home' };
  return { text: `That is not in my database yet. Type "help" to see what I can do.` };
}

export default function Assistant() {
  const { assistantOpen: open, setAssistantOpen: setOpen, speak, sfx, unlock, setSoundOn } = useSystem();
  const [msgs, setMsgs] = useState([{ who: 'bot', text: `${assistant.greeting}\nType a question or tap a command below.` }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const [hint, setHint] = useState(true);

  useEffect(() => { const t = setTimeout(() => setHint(false), 9000); return () => clearTimeout(t); }, []);

  // "/" opens the assistant
  useEffect(() => {
    const k = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [setOpen]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 250); }, [open]);
  useEffect(() => { listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text) => {
    const t = text.trim();
    if (!t || typing) return;
    unlock('contact');
    sfx('click');
    setMsgs((m) => [...m, { who: 'user', text: t }]);
    setInput('');
    const r = think(t);
    setTyping(true);

    // typing effect
    setTimeout(() => {
      setTyping(false);
      if (r.unmute) setSoundOn(true);
      let i = 0;
      setMsgs((m) => [...m, { who: 'bot', text: '' }]);
      const id = setInterval(() => {
        i += 2;
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { who: 'bot', text: r.text.slice(0, i) }; return c; });
        if (i % 6 === 0) sfx('type');
        if (i >= r.text.length) clearInterval(id);
      }, 18);
      if (!r.mute) speak(r.text.replace(/•/g, ''));
      if (r.mute) setTimeout(() => setSoundOn(false), 50);
      if (r.go) setTimeout(() => goTo(r.go), 500);
      r.action?.();
    }, 550);
  };

  return (
    <>
      <motion.button className="ai-orb" onClick={() => { setOpen(!open); sfx('open'); }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring' }}
        aria-label={`Open ${assistant.name}`}>
        <svg viewBox="-40 -40 80 80">
          <circle className="spin" r="36" fill="none" stroke="#3de0ff" strokeOpacity=".6" strokeDasharray="30 12 6 12" />
          <circle className="spin-rev" r="28" fill="none" stroke="#ffc861" strokeOpacity=".6" strokeDasharray="10 20" />
        </svg>
        <span className="core" />
        <AnimatePresence>
          {hint && !open && (
            <motion.span className="ai-orb-label" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              Ask {assistant.name} anything · press /
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div className="panel ai-panel brackets"
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
            <div className="ai-head">
              <span className="mini-core" />
              <div>
                <b>{assistant.name}</b>
                <small>{assistant.fullName}</small>
              </div>
              {typing && <div className="ai-wave">{Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ animationDelay: `${i * 80}ms` }} />)}</div>}
              <button className="x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            <div className="ai-msgs" ref={listRef}>
              {msgs.map((m, i) => (
                <motion.div key={i} className={`msg ${m.who}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="who">{m.who === 'bot' ? assistant.name : 'YOU'}</span>
                  {m.text}
                </motion.div>
              ))}
              {typing && <div className="msg bot"><span className="who">{assistant.name}</span>Processing<span className="caret" /></div>}
            </div>

            <div className="ai-chips">
              {CHIPS.map((c) => <button key={c} onClick={() => send(c)}>{c}</button>)}
            </div>
            <form className="ai-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Ask ${assistant.name}...`} />
              <button type="submit">SEND</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}