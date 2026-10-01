/* =====================================================================
   ABOUT — "subject dossier" with face-scan photo, data rows,
   bio and counting stats
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHead, { reveal } from './SectionHead';
import { profile } from '../data/profile';

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start;
    const step = (t) => {
      start ??= t;
      const p = Math.min(1, (t - start) / 1600);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return <b ref={ref}>{n}{suffix}</b>;
}

export default function About() {
  const rows = [
    ['NAME', profile.shortName],
    ['ROLE', profile.role],
    ['BASE', profile.location],
    ['EDU', 'Norton University'],
    ['STATUS', <span className="cyan" key="s">● ONLINE</span>],
  ];

  return (
    <section className="section" id="about">
      <SectionHead index="01" title="Subject" outline="profile"
        sub="Scanning complete. Here is who is behind the code." />

      <div className="about-grid">
        <motion.div className="panel dossier brackets" {...reveal}>
          <div className="hud-label" style={{ marginBottom: 12 }}>ID · DOSSIER #0427</div>
          <div className="dossier-photo">
            <img src={profile.photo} alt={profile.shortName} />
            <motion.div className="face-box"
              initial={{ opacity: 0, scale: 1.4 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
              <span>MATCH 99.7%</span>
            </motion.div>
            <div className="scan-line" />
          </div>
          <dl className="dossier-rows">
            {rows.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </motion.div>

        <div>
          <div className="about-bio">
            {profile.bio.map((p, i) => (
              <motion.p key={i} {...reveal} transition={{ ...reveal.transition, delay: 0.1 + i * 0.12 }}>{p}</motion.p>
            ))}
          </div>
          <div className="stats">
            {profile.stats.map((s, i) => (
              <motion.div key={s.label} className="panel stat" {...reveal}
                transition={{ ...reveal.transition, delay: 0.2 + i * 0.1 }}>
                <Counter value={s.value} suffix={s.suffix} />
                <span>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
