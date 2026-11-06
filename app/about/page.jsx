import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="content-page section-wrap">
      <p className="eyebrow">ABOUT THE PROJECT</p>
      <h1>A playground for <span>real-time 3D.</span></h1>
      <p className="page-lead">Live Envmaps Studio is a small web experience built around an interactive 3D scene. It combines Next.js routing with React Three Fiber and Three.js rendering.</p>
      <div className="about-panels">
        <section className="info-panel"><span className="panel-number">01</span><h2>What you can explore</h2><p>Open the 3D scene, rotate your view, and experience the original Porsche model with its environment and lighting.</p></section>
        <section className="info-panel"><span className="panel-number">02</span><h2>How it is built</h2><p>Next.js App Router handles pages. React Three Fiber and Drei render the interactive scene on the client, where WebGL is available.</p></section>
        <section className="info-panel"><span className="panel-number">03</span><h2>Made to grow</h2><p>Home, About, Tools, and Scene are separate routes, so you can add more pages and utilities as the project grows.</p></section>
      </div>
      <Link className="button button-primary" href="/scene">Visit the 3D scene <span>↗</span></Link>
    </main>
  );
}
