import { useEffect, useState } from 'react';
import { Atmosphere } from './experience/Atmosphere';
import { Altimeter } from './experience/Altimeter';
import { Trail } from './experience/Trail';
import { Driftwood } from './experience/Driftwood';
import { Constellation } from './experience/Constellation';
import { PingPongConsole } from './experience/PingPongConsole';
import { track } from './experience/analytics';
import { OPEN_WATER } from './experience/release';

const chapters = OPEN_WATER ? ['space', 'mountains', 'sea', 'seabed'] : ['space', 'mountains', 'sea'];

export default function App() {
  const [active, setActive] = useState('space');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const visited = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        setActive(id);
        document.documentElement.dataset.chapter = id;
        if (!visited.has(id)) {
          visited.add(id);
          track('chapter_view', { chapter: id });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chapters.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Atmosphere paused={paused} />
      <header className="site-header">
        <a className="wordmark" href="#space" aria-label="Alessandro De Marco, back to the start">Alee</a>
        <span className="header-note">A PERSONAL EXPLORATION</span>
        <a className="contact-link" href="mailto:alessandrodemarco.1237@gmail.com">Say hello <span aria-hidden="true">↗</span></a>
      </header>
      <Altimeter active={active} />
      <main id="main">
        <section id="space" className="chapter space" aria-labelledby="space-title">
          <div className="hero page-width">
            <p className="eyebrow"><span className="status-dot" /> BASED IN ZURICH · ROOTED IN SALENTO</p>
            <h1 id="space-title">Alessandro<br /><span className="name-second">De Marco<span className="name-dot">.</span></span></h1>
            <div className="hero-bottom">
              <div className="tldr">
                <p className="tldr-tag">TL;DR</p>
                <ul>
                  <li>Computer scientist from Salento.</li>
                  <li>AI and robotics, from Turin to Zurich.</li>
                  <li>Happiest outdoors, or in the water.</li>
                </ul>
              </div>
              <a href="#path" className="scroll-cue"><span className="scroll-line" /> SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div id="path" className="path page-width">
            <div className="section-heading"><p className="eyebrow">01 / THE PATH SO FAR</p><span className="interaction-note">Every star, a stop along the way.</span></div>
            <h2>Studies, projects,<br /><em>first lectures.</em></h2>
            <Constellation />
          </div>
          <div className="descent" aria-hidden="true">
            <p className="descent-line">Leaving orbit</p>
            <p className="descent-line">Through the clouds</p>
          </div>
        </section>

        <section id="mountains" className="chapter mountains" aria-labelledby="mountains-title">
          <div className="chapter-intro page-width">
            <p className="eyebrow">02 / THE ALPS</p>
            <h2 id="mountains-title">Mostly falling.<br /><em>Always getting up.</em></h2>
            <p className="section-copy">Climbing, snowboarding, hiking, running.<br />Mastering the art of the graceful wipe-out.</p>
          </div>
          <Trail />
        </section>

        {OPEN_WATER ? (<>
          <section id="sea" className="chapter sea" aria-labelledby="sea-title">
            <div id="coastline" className="coast page-width">
              <p className="eyebrow">03 / SALENTO · SEA LEVEL</p>
              <h2 id="sea-title">Lu sule, lu mare,<br /><em>lu ientu.</em></h2>
              <p className="section-copy">The sun, the sea, the wind. Where I’m from.<br />Surf, kitesurf, and plenty of salt water swallowed.</p>
              <p className="map-hint" aria-hidden="true">Move slowly — you’ll make a current.</p>
            </div>
            <Driftwood paused={paused} />
          </section>

          <section id="seabed" className="chapter seabed" aria-labelledby="seabed-title">
            <div className="deep page-width">
              <p className="eyebrow">04 / BELOW THE SURFACE · BUBBLE ROBOTICS</p>
              <h2 id="seabed-title">Now I build robots<br /><em>that go deeper.</em></h2>
              <p className="section-copy">Data and AI for underwater robots,<br />working where I’ve always liked to be.</p>
              <a className="text-link deep-link" href="https://www.bubble-robotics.com/">Bubble Robotics <span aria-hidden="true">↗</span></a>
            </div>
            <Closing />
          </section>
        </>) : (
          <section id="sea" className="chapter sea shore" aria-labelledby="sea-title">
            <div id="coastline" className="coast page-width">
              <p className="eyebrow">03 / SALENTO · SEA LEVEL</p>
              <h2 id="sea-title">The rest is<br /><em>still underwater.</em></h2>
              <p className="section-copy">The sea, and what I do beneath it, are still being charted.<br />Back soon.</p>
            </div>
            <Closing />
          </section>
        )}
      </main>
      <PingPongConsole />
      <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => {
        setPaused(!paused);
        track('toggle_motion', { paused: !paused });
      }}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span><span>{paused ? 'Resume motion' : 'Pause motion'}</span></button>
    </>
  );
}

function Closing() {
  return (
    <div className="closing page-width">
      <a className="hello" href="mailto:alessandrodemarco.1237@gmail.com">Let’s make waves. <span aria-hidden="true">↗</span></a>
      <footer><span>© {new Date().getFullYear()} Alessandro De Marco</span><div><a href="https://github.com/Aleedm">GitHub ↗</a><a href="https://www.linkedin.com/in/aleedm/">LinkedIn ↗</a></div><a href="#space">Back to orbit ↑</a></footer>
    </div>
  );
}
