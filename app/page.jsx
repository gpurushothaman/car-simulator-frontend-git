import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> REAL-TIME 3D WORKSPACE</p>
          <h1>Bring your 3D world <span>to life.</span></h1>
          <p className="hero-description">
            Explore a real-time 3D scene, experiment with environment lighting, and discover tools for your next visual project.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/scene">Explore 3D scene <span>↗</span></Link>
            <Link className="button button-secondary" href="/tools">Browse tools</Link>
          </div>
          <div className="hero-meta"><span>01 / INTERACTIVE SCENE</span><span>POWERED BY THREE.JS</span></div>
        </div>
        <Link href="/scene" className="hero-visual" aria-label="Open the interactive 3D scene">
          <div className="visual-glow" />
          <div className="visual-grid" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-center"><span className="visual-cross">✳</span><span>3D / LIVE</span></div>
          <div className="visual-caption"><span>ENVIRONMENT VIEWER</span><span>↗</span></div>
        </Link>
      </section>

      <section className="section-wrap feature-section">
        <div className="section-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h2>Everything starts with exploration.</h2></div><p className="section-intro">A simple space to view the scene, learn about the project, and access the tools.</p></div>
        <div className="feature-grid">
          <Link href="/scene" className="feature-card"><span className="card-index">01</span><span className="feature-icon">◉</span><h3>3D Scene</h3><p>Open the interactive Porsche scene and explore a real-time 3D environment.</p><span className="card-link">Open scene ↗</span></Link>
          <Link href="/tools" className="feature-card"><span className="card-index">02</span><span className="feature-icon">⌘</span><h3>Creative tools</h3><p>Find handy utilities and starting points for your 3D workflow.</p><span className="card-link">Explore tools ↗</span></Link>
          <Link href="/about" className="feature-card"><span className="card-index">03</span><span className="feature-icon">◌</span><h3>About the project</h3><p>Learn how this Next.js project brings React Three Fiber into the browser.</p><span className="card-link">Learn more ↗</span></Link>
        </div>
      </section>
    </main>
  );
}
