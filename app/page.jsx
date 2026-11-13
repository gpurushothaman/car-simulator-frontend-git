
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const paints = [
  { name: "Original", color: "#bfc3c8", filter: "none" },
  { name: "Racing Red", color: "#e32636", filter: "sepia(1) saturate(5) hue-rotate(315deg)" },
  { name: "Ocean Blue", color: "#1769aa", filter: "sepia(1) saturate(4) hue-rotate(175deg)" },
  { name: "Forest Green", color: "#26734d", filter: "sepia(1) saturate(3) hue-rotate(90deg)" },
  { name: "Sunset Orange", color: "#f07828", filter: "sepia(1) saturate(5) hue-rotate(345deg)" },
  { name: "Midnight Black", color: "#24272c", filter: "grayscale(1) brightness(.48)" },
];

const finishes = ["Gloss", "Matte", "Metallic"];
const wheels = ["Sport", "Classic", "Racing"];
const environments = ["Studio", "Dark", "Outdoor"];

export default function HomePage() {
  const [paint, setPaint] = useState(paints[0]);
  const [finish, setFinish] = useState("Gloss");
  const [wheel, setWheel] = useState("Sport");
  const [environment, setEnvironment] = useState("Studio");
  const [zoom, setZoom] = useState(100);
  const [angle, setAngle] = useState(0);

  function resetConfiguration() {
    setPaint(paints[0]);
    setFinish("Gloss");
    setWheel("Sport");
    setEnvironment("Studio");
    setZoom(100);
    setAngle(0);
  }

  return (
    <main className="cc-page">
      {/* <section className="cc-topbar">
        <div className="cc-brand">
          <span className="cc-brand-mark">C</span>
          <div>
            <strong>CAR<span>CRAFT</span></strong>
            <small>YOUR CAR. YOUR STYLE.</small>
          </div>
        </div>

        <nav className="cc-nav">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/tools">Tools</Link>
        </nav>

        <Link href="/scene" className="cc-top-button">
          3D Studio <span>↗</span>
        </Link>
      </section> */}

      <section className="cc-heading">
        <div>
          <p className="cc-eyebrow">PERSONAL AUTOMOTIVE STUDIO</p>
          <h1>Build your <span>dream car.</span></h1>
          <p className="cc-heading-description">
            Explore your style. Choose your colors. Create a car
            that feels uniquely yours.
          </p>
        </div>

        <div className="cc-build-status">
          <span className="cc-status-dot"></span>
          CUSTOMIZATION MODE
        </div>
      </section>

      <section className="cc-workspace">
        <div className={`cc-preview cc-environment-${environment.toLowerCase()} cc-finish-${finish.toLowerCase()}`}>
          <div className="cc-preview-top">
            <span>VEHICLE PREVIEW</span>
            <span>01 / 01</span>
          </div>

          <div className="cc-preview-grid"></div>
          <div className="cc-preview-glow"></div>

          <div className="cc-car-image-wrap">
            <Image
              src="/car.png"
              alt="Car customization preview"
              width={1200}
              height={700}
              priority
              className="cc-car-image"
              style={{
                filter: paint.filter,
                transform: `scale(${zoom / 100}) rotateY(${angle}deg)`,
              }}
            />
          </div>

          <div className="cc-preview-caption">
            <div>
              <span className="cc-caption-label">SELECTED PAINT</span>
              <strong>{paint.name}</strong>
            </div>
            <div>
              <span className="cc-caption-label">FINISH</span>
              <strong>{finish}</strong>
            </div>
            <div>
              <span className="cc-caption-label">WHEEL STYLE</span>
              <strong>{wheel}</strong>
            </div>
          </div>

          <div className="cc-preview-controls">
            <button
              type="button"
              onClick={() => setAngle((value) => Math.max(-35, value - 10))}
              aria-label="Rotate car left"
            >
              ↶
            </button>
            <button
              type="button"
              onClick={() => setAngle((value) => Math.min(35, value + 10))}
              aria-label="Rotate car right"
            >
              ↷
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(125, value + 5))}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(75, value - 5))}
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
        </div>

        <aside className="cc-customizer">
          <div className="cc-panel-heading">
            <div>
              <p className="cc-eyebrow">CONFIGURATION</p>
              <h2>Customize</h2>
            </div>
            <button
              type="button"
              className="cc-reset"
              onClick={resetConfiguration}
            >
              ↺ Reset
            </button>
          </div>

          <div className="cc-option-section">
            <div className="cc-option-title">
              <span>01</span>
              <h3>Exterior Color</h3>
            </div>

            <div className="cc-paint-list">
              {paints.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`cc-paint-option ${paint.name === item.name ? "active" : ""}`}
                  onClick={() => setPaint(item)}
                  title={item.name}
                  aria-label={item.name}
                  aria-pressed={paint.name === item.name}
                >
                  <span style={{ background: item.color }}></span>
                </button>
              ))}
            </div>
            <p className="cc-selected-name">{paint.name}</p>
          </div>

          <div className="cc-option-section">
            <div className="cc-option-title">
              <span>02</span>
              <h3>Paint Finish</h3>
            </div>

            <div className="cc-choice-list">
              {finishes.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={finish === item ? "selected" : ""}
                  onClick={() => setFinish(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="cc-option-section">
            <div className="cc-option-title">
              <span>03</span>
              <h3>Wheel Style</h3>
            </div>

            <div className="cc-choice-list">
              {wheels.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={wheel === item ? "selected" : ""}
                  onClick={() => setWheel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="cc-option-section">
            <div className="cc-option-title">
              <span>04</span>
              <h3>Environment</h3>
            </div>

            <div className="cc-choice-list">
              {environments.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={environment === item ? "selected" : ""}
                  onClick={() => setEnvironment(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="cc-option-section cc-zoom-section">
            <div className="cc-option-title">
              <span>05</span>
              <h3>View Size</h3>
              <strong>{zoom}%</strong>
            </div>
            <input
              type="range"
              min="75"
              max="125"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="cc-range"
              aria-label="Car preview zoom"
            />
          </div>

          <Link href="/scene" className="cc-launch-button">
            Open 3D Experience <span>↗</span>
          </Link>
          <p className="cc-panel-note">
            Preview settings are visual demonstrations using your car image.
          </p>
        </aside>
      </section>

      <section className="cc-bottom-info">
        <div>
          <span className="cc-bottom-icon">✳</span>
          <div>
            <strong>Make it yours</strong>
            <p>Personalize your automotive experience.</p>
          </div>
        </div>
        <div className="cc-bottom-right">
          <span>DESIGNED FOR CAR ENTHUSIASTS</span>
          <span>CARCRAFT © 2026</span>
        </div>
      </section>
    </main>
  );
}
