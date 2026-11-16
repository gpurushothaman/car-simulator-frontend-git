
import Link from "next/link";

export default function Home() {
  return (
    <main className="car-home">

      {/* HERO SECTION */}
      <section className="car-home-hero">

        {/* MAIN BACKGROUND CAR IMAGE */}
        <div className="car-home-hero-bg">
          <img
            src="/car2.jpg"
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


      {/* EXPLORE CAR MODELS */}
      {/* <section className="car-home-models">

        <div className="car-home-section-heading">
          <span></span>
          <h2>Explore Car Models</h2>
          <span></span>
        </div>

        <div className="car-home-title-underline"></div>

        <div className="car-home-model-grid"> */}

          {/* SPORTS CAR */}
          {/* <article className="car-home-model-card">

            <div className="car-home-model-image">
              <img
                src="/images/wheels/classic.jpg"
                alt="Sports Car"
              />
              <span className="car-home-model-number">01</span>
            </div>

            <div className="car-home-model-info">
              <div>
                <h3>Sport Sedan</h3>
                <p>Dynamic & Stylish</p>
              </div>
              <span className="car-home-model-arrow">↗</span>
            </div>

          </article> */}


          {/* SUV CAR */}
          {/* <article className="car-home-model-card">

            <div className="car-home-model-image">
              <img
                src="images/tyres/track.jpg"
                alt="Premium SUV"
              />
              <span className="car-home-model-number">02</span>
            </div>

            <div className="car-home-model-info">
              <div>
                <h3>Premium SUV</h3>
                <p>Power & Comfort</p>
              </div>
              <span className="car-home-model-arrow">↗</span>
            </div>

          </article> */}


          {/* ELECTRIC CAR */}
          {/* <article className="car-home-model-card">

            <div className="car-home-model-image">
              <img
                src="/images/drivetrain.jpg"
                alt="Luxury Electric Car"
              />
              <span className="car-home-model-number">03</span>
            </div>

            <div className="car-home-model-info">
              <div>
                <h3>Luxury Electric</h3>
                <p>Modern & Elegant</p>
              </div>
              <span className="car-home-model-arrow">↗</span>
            </div>

          </article>

        </div>

      </section> */}


      {/* CUSTOMIZE BANNER */}
      <section className="car-home-customize">

        {/* <div className="car-home-banner-bg">
          <img
            src="/iamges/car.jpg"
            alt="Luxury Car Banner"
          />
        </div> */}

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

      </section>

    </main>
  );
}
