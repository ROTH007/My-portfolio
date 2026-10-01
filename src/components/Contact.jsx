/* =====================================================================
   CONTACT — terminal-style form (opens the visitor's email app)
   + link cards
   ===================================================================== */
import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHead, { reveal } from './SectionHead';
import { profile } from '../data/profile';
import { useSystem } from '../system';

export default function Contact() {
  const { sfx } = useSystem();
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    sfx('unlock');
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(`${form.msg}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const links = [
    { ic: '@', title: 'Email', sub: profile.email, href: `mailto:${profile.email}` },
    { ic: 'GH', title: 'GitHub', sub: profile.github.replace('https://', ''), href: profile.github },
    profile.telegram && { ic: 'TG', title: 'Telegram', sub: profile.telegram.replace('https://', ''), href: profile.telegram },
    profile.linkedin && { ic: 'in', title: 'LinkedIn', sub: profile.linkedin.replace('https://', ''), href: profile.linkedin },
    profile.cv && { ic: 'CV', title: 'Download CV', sub: 'PDF', href: profile.cv },
  ].filter(Boolean);

  return (
    <section className="section" id="contact">
      <SectionHead index="07" title="Open a" outline="channel"
        sub="Have a project, internship or idea? Send a transmission." />

      <div className="contact-grid">
        <motion.form className="panel terminal" onSubmit={submit} {...reveal}>
          <div className="term-bar"><i /><i /><i /> secure-uplink — {profile.shortName.toLowerCase()}@portfolio</div>
          <div className="term-body">
            <div><span className="prompt">➜</span> ./send_transmission --to {profile.shortName.toLowerCase()}</div>
            <div className="field">
              <label>NAME</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
            <div className="field">
              <label>EMAIL</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="field">
              <label>MESSAGE</label>
              <textarea required rows="5" value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="Type your message..." />
            </div>
            <button className="btn solid" style={{ marginTop: 18 }} type="submit">Transmit ▸</button>
            {sent && <motion.div className="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✓ Transmission ready — your email app has opened.</motion.div>}
          </div>
        </motion.form>

        <div className="links">
          {links.map((l, i) => (
            <motion.a key={l.title} href={l.href} target="_blank" rel="noreferrer" className="panel link-card"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} onMouseEnter={() => sfx('hover')}>
              <span className="ic">{l.ic}</span>
              <span><b>{l.title}</b><small>{l.sub}</small></span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
