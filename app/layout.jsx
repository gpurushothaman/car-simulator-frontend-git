import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata = {
  title: "Live Envmaps Studio",
  description: "Explore interactive 3D scenes and environment-map tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="site-brand" href="/">
            <Image
              src="/Dsimilar.png"
              alt="Company Logo"
              className="site-logo"
              width={500}
              height={300}
              style={{
                display: "block",
                width: "150px",
                height: "65px",
                objectFit: "contain",
              }}
            />
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/tools">Tools</Link>
          </nav>
          <Link className="header-cta" href="/scene">
            Open 3D scene <span aria-hidden="true">↗</span>
          </Link>
        </header>
        {children}
        <footer className="site-footer">
          <span>Live Envmaps Studio</span>
          <span>Built for exploring 3D environments</span>
        </footer>
      </body>
    </html>
  );
}
