"use client";

import { useState } from "react";

export default function ToolsPage() {
  const [hex, setHex] = useState("#8B5CF6");
  const [copied, setCopied] = useState(false);
  const [exposure, setExposure] = useState(1);

  async function copyColor() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="content-page section-wrap tools-page">
      <p className="eyebrow">THE TOOLBOX</p>
      <h1>Small tools. <span>Big ideas.</span></h1>
      <p className="page-lead">A few simple utilities to help with your visual workflow. More tools can be added here as your project develops.</p>

      <div className="tools-grid">
        <section className="tool-card">
          <div className="tool-card-top"><span className="feature-icon">◐</span><span className="tool-tag">COLOR</span></div>
          <h2>Color picker</h2>
          <p>Choose a color and copy its HEX value for your UI or scene experiments.</p>
          <div className="color-preview" style={{ backgroundColor: hex }} />
          <div className="color-controls"><label htmlFor="color-input">Choose color</label><input id="color-input" aria-label="Choose color" type="color" value={hex} onChange={(event) => setHex(event.target.value)} /><code>{hex.toUpperCase()}</code></div>
          <button className="button button-primary tool-button" onClick={copyColor}>{copied ? "Copied!" : "Copy HEX"}</button>
        </section>

        <section className="tool-card">
          <div className="tool-card-top"><span className="feature-icon">☼</span><span className="tool-tag">PREVIEW</span></div>
          <h2>Exposure preview</h2>
          <p>Adjust this preview to see how a brighter or darker value feels. This is a demo control and does not change the 3D scene yet.</p>
          <div className="exposure-preview" style={{ filter: `brightness(${exposure})` }}><div className="preview-sun" /><div className="preview-sphere" /><span>LIGHT / {exposure.toFixed(1)}×</span></div>
          <label className="range-label" htmlFor="exposure-range"><span>Exposure</span><strong>{exposure.toFixed(1)}×</strong></label>
          <input id="exposure-range" className="range-input" type="range" min="0.4" max="1.8" step="0.1" value={exposure} onChange={(event) => setExposure(Number(event.target.value))} />
        </section>

        <section className="tool-card tool-card-wide">
          <div className="tool-card-top"><span className="feature-icon">◇</span><span className="tool-tag">3D VIEWER</span></div>
          <div><h2>Interactive scene</h2><p>Launch the original 3D Porsche scene to explore the model in the browser.</p></div>
          <a className="button button-secondary" href="/scene">Open 3D scene ↗</a>
        </section>
      </div>
    </main>
  );
}
