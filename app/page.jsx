
import Link from "next/link";

export default function Home() {
  return (
    <main className="car-home">

      {/* HERO SECTION */}
      <section className="car-home-hero">

        {/* MAIN BACKGROUND CAR IMAGE */}
        <div className="car-home-hero-bg">
          <img
            src="/caroriginal.png"
            alt="Main Silver Luxury Car"
          />
        </div>

        <div className="car-home-hero-content">

          <span className="car-home-eyebrow">
            PREMIUM CAR CUSTOMIZATION
          </span>

          <h1>
            Build Your
            <span>Dream Car</span>
          </h1>

          <div className="car-home-line"></div>

          <p>
            Customize every detail and create a car
            that's truly yours.
          </p>

          <Link href="/scene" className="car-home-button">
            Customize Your Car
            <span>→</span>
          </Link>

        </div>

        <div className="car-home-hero-bottom">
          <span>01</span>
          <span className="car-home-bottom-line"></span>
          <span>PREMIUM COLLECTION</span>
        </div>

      </section>


      {/* CUSTOMIZE BANNER */}
      {/* <section className="car-home-customize">

        

        <div className="car-home-banner-content">

          <span>YOUR CAR. YOUR STYLE.</span>

          <h2>
            Customize <strong>Your Car</strong>
          </h2>

          <p>Choose. Personalize. Drive.</p>

        </div>

        <Link href="/scene" className="car-home-banner-button">
          Customize Your Car
          <span>→</span>
        </Link>

      </section> */}

    </main>
  );
}
