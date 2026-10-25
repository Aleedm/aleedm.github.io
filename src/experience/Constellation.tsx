import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { track } from './analytics';
import { OPEN_WATER } from './release';
import { canPlayPingPong, openPingPong } from './pingpong';

interface Link { label: string; href: string }
// Brightness follows what matters most: the main path, then the AI work.
type Tier = 'major' | 'bright' | 'normal' | 'faint';
interface Star {
  id: string; tier: Tier; epoch: string; name: string; meta: string; text: string;
  links?: Link[]; image?: string; video?: { src: string; poster: string; alt: string };
  stats?: [string, string][]; statsNote?: string; parent?: string; playable?: boolean;
  // Positions in % of the chart: wide sky on desktop, tall sky on phones.
  at: [number, number]; phone: [number, number];
}

const stars: Star[] = [
  { id: 'pingpong', tier: 'major', playable: true, epoch: 'Age 15', name: 'PingPong', meta: 'Java · Swing', at: [5, 64], phone: [14, 3],
    text: 'The first thing I ever built: Pong in Java, two players or against a bot. The original code still runs — right here.',
    links: [{ label: 'GitHub', href: 'https://github.com/Aleedm/PingPong' }] },
  { id: 'unito', tier: 'major', epoch: '2019 – 2022', name: 'BSc Computer Science', meta: 'University of Turin', at: [22, 38], phone: [62, 12],
    text: 'Where computer science became the plan.', links: [{ label: 'unito.it', href: 'https://en.unito.it/' }] },
  { id: 'polito', tier: 'major', epoch: '2022', name: 'MSc Artificial Intelligence', meta: 'Politecnico di Torino · AI & Data Analytics', at: [44, 52], phone: [42, 36],
    text: 'Deep learning, computer vision, language — and most of the projects in this sky.',
    links: [{ label: 'polito.it', href: 'https://www.polito.it/en' }] },
  { id: 'research', tier: 'normal', parent: 'polito', epoch: 'During the MSc', name: 'Research', meta: 'University of Turin · with Prof. Claudio Schifanella', at: [30, 12], phone: [16, 22],
    text: 'Research work at the University of Turin alongside my graduate studies.' },
  { id: 'glomeruli', tier: 'bright', parent: 'polito', epoch: '2023', name: 'GlomeruLearn', meta: 'Machine Learning in Applications · team of four', at: [28, 86], phone: [12, 52], image: '/projects/glomeruli.png',
    text: 'Finding glomeruli in kidney biopsies with SegNet and U-Net, then grouping them by damage without any labels.',
    links: [{ label: 'GitHub', href: 'https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis' },
      { label: 'Report', href: 'https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis/blob/main/Report.pdf' }] },
  { id: 'domain', tier: 'bright', parent: 'polito', epoch: 'MSc project', name: 'Real-time domain adaptation', meta: 'Semantic segmentation · STDC', at: [50, 90], phone: [60, 60], image: '/projects/domain-adaptation.png',
    text: 'Teaching a real-time segmentation network trained on GTA5 to see real Cityscapes streets.',
    links: [{ label: 'GitHub', href: 'https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation' },
      { label: 'Paper', href: 'https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf' }] },
  { id: 'dialogue', tier: 'bright', parent: 'polito', epoch: 'MSc project', name: 'Commonsense summarization', meta: 'NLP · T5, BART, PEGASUS', at: [64, 70], phone: [18, 70],
    text: 'Adding commonsense knowledge to dialogue summaries, down to customer-service threads.',
    links: [{ label: 'GitHub', href: 'https://github.com/Aleedm/Sick-Summarization' },
      { label: 'Paper', href: 'https://github.com/Aleedm/Sick-Summarization/blob/main/paper.pdf' }] },
  { id: 'itis', tier: 'faint', parent: 'polito', epoch: '2023', name: 'Teaching blockchain', meta: 'I.T.I.S. Mario Delpozzo · Cuneo', at: [58, 16], phone: [84, 25],
    text: 'A series of lectures on decentralized systems and where blockchain is actually useful.' },
  { id: 'cyber', tier: 'faint', parent: 'polito', epoch: '2024', name: 'Lecturing on IPFS', meta: 'Master in Cybersecurity · University of Turin', at: [68, 6], phone: [86, 44],
    text: 'IPFS and its role in blockchain, security fundamentals, and decentralized finance.',
    links: [{ label: 'Master', href: 'https://www.mastercybersecuritytorino.it' }] },
  { id: 'eth', tier: 'major', epoch: 'Mar – Aug 2025', name: 'ETH Zurich', meta: 'Master’s thesis · Center for Project-Based Learning, D-ITET', at: [80, 30], phone: [70, 84],
    text: 'Teaching a Clearpath Jackal to explore on its own: a diffusion navigation policy (NoMaD), fine-tuned with reinforcement learning and human interventions.',
    video: { src: '/projects/eth-jackal.mp4', poster: '/projects/eth-jackal.jpg', alt: 'The robot’s camera view: sampled paths fan out and pick the gap between two tubes' },
    stats: [['+52%', 'ground explored'], ['+51%', 'steps before a collision']], statsNote: 'RL + human demonstrations vs. NoMaD, same test arena',
    links: [{ label: 'PBL', href: 'https://pbl.ee.ethz.ch/' }] },
];

const byId = Object.fromEntries(stars.map((s) => [s.id, s]));
const majors = stars.filter((s) => s.tier === 'major');
const segments = [
  ...majors.slice(1).map((s, i) => [majors[i], s]),
  ...stars.filter((s) => s.parent).map((s) => [byId[s.parent!], s]),
] as [Star, Star][];

function Lines({ layout }: { layout: 'at' | 'phone' }) {
  return (
    <svg className={`sky-lines sky-lines-${layout}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {segments.map(([a, b]) => (
        <line key={`${a.id}-${b.id}`} x1={a[layout][0]} y1={a[layout][1]} x2={b[layout][0]} y2={b[layout][1]} className={`line-${b.tier}`} />
      ))}
    </svg>
  );
}

export function Constellation() {
  const chartRef = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const chart = chartRef.current!;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { chart.dataset.lit = 'true'; observer.disconnect(); }
    }, { threshold: .25 });
    observer.observe(chart);
    return () => observer.disconnect();
  }, []);

  const select = (id: string) => {
    setSelected(id);
    if (!seen.current.has(id)) { seen.current.add(id); track('star_open', { star: id }); }
  };
  const star = selected ? byId[selected] : null;
  const play = () => { track('pingpong_launch'); openPingPong(); };

  return (
    <div className="sky">
      <div ref={chartRef} className="sky-chart">
        <Lines layout="at" />
        <Lines layout="phone" />
        <span className="sky-region" aria-hidden="true">Machine learning</span>
        {stars.map((s) => (
          <button key={s.id} type="button" className="sky-star" data-tier={s.tier}
            data-side={s.at[0] > 70 ? 'left' : 'right'} data-phone-side={s.phone[0] > 55 ? 'left' : 'right'}
            aria-pressed={selected === s.id}
            style={{ '--x': s.at[0], '--y': s.at[1], '--px': s.phone[0], '--py': s.phone[1] } as CSSProperties}
            onMouseEnter={() => select(s.id)} onFocus={() => select(s.id)}
            onClick={() => { select(s.id); if (s.playable && canPlayPingPong()) play(); }}>
            <span className="sky-glyph" aria-hidden="true" />
            <span className="sky-label"><span className="sky-epoch">{s.epoch}</span>{s.name}{s.playable && canPlayPingPong() && <span className="sky-play">▶ Play</span>}</span>
          </button>
        ))}
        {OPEN_WATER && (
          <a className="sky-exit" href="#seabed" onClick={() => track('chapter_navigation', { chapter: 'seabed', from: 'constellation' })}>
            <span className="sky-epoch">Now</span>Continues below the surface <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>
      <aside className="sky-panel" aria-live="polite">
        {star ? (
          <>
            <p className="sky-panel-meta">{star.epoch} · {star.meta}</p>
            <h3>{star.name}</h3>
            {star.image && <div className="sky-plate"><img src={star.image} alt="" loading="lazy" /></div>}
            {star.video && <video className="sky-video" src={star.video.src} poster={star.video.poster} aria-label={star.video.alt} autoPlay muted loop playsInline />}
            <p className="sky-panel-text">{star.text}</p>
            {star.stats && (
              <div className="sky-stats">
                {star.stats.map(([value, label]) => <p key={label}><strong>{value}</strong>{label}</p>)}
                {star.statsNote && <p className="sky-stats-note">{star.statsNote}</p>}
              </div>
            )}
            {star.playable && (
              <p className="sky-panel-play">
                {canPlayPingPong()
                  ? <button type="button" className="play-button" onClick={play}>▶ Play it</button>
                  : <span className="play-elsewhere">Playable on a computer.</span>}
              </p>
            )}
            {star.links && <p className="sky-panel-links">{star.links.map((l) => <a key={l.href} href={l.href}>{l.label} <span aria-hidden="true">↗</span></a>)}</p>}
          </>
        ) : (
          <>
            <p className="sky-panel-meta">{stars.length} stars · age 15 → now</p>
            <p className="sky-panel-hint">Point at a star to see what it is.</p>
          </>
        )}
      </aside>
    </div>
  );
}
