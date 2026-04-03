import { Link } from "react-router-dom";
import "../../styles/home.css";
import room1 from "../../assets/room1.jpeg";
import room2 from "../../assets/room2.jpeg";
import room3 from "../../assets/room3.jpeg";
import room4 from "../../assets/room4.jpeg";
import room5 from "../../assets/room5.jpeg";
import room6 from "../../assets/room6.jpeg";
import room7 from "../../assets/room7.jpeg";

const TICKER = ["MINDFUL SPACES", "SOULFUL DESIGN", "AI-POWERED", "BUDGET SMART", "EFFORTLESS LUXURY"];

function Home() {
  return (
    <div className="home">

      {/* SECTION 1: HOME */}
      <section id="home" className="hero-section">
        <div className="hero-overlay-text" style={{ display: "none" }}>
          <span>INTELLI</span>
          <span>INTERIORS</span>
        </div>
        <div className="hero-content">
          <h1 className="hero-heading">INTELLI<br />INTERIORS</h1>
          <p className="hero-sub1">A Smart Interior Project Management System</p>
          <p className="hero-sub2">Plan, track and manage your interior design projects with AI-powered suggestions and budget insights.</p>
          <div className="hero-btns">
            <Link to="/register" className="btn-fill">Start Your Project</Link>
            <Link to="/login" className="btn-outline">Sign In →</Link>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>✦ {t}&nbsp;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* SECTION 2: APPROACH */}
      <section id="approach" className="luxury-section">
        <div className="luxury-left">
          <div>
            <p className="section-tag">— OUR APPROACH</p>
            <h2 className="luxury-heading">Effortless<br />Luxury.</h2>
            <p className="luxury-desc">
              At Intelli-Interior, we specialize in elevated interior project management —
              where natural textures, earthy palettes, and artisan details come together
              in perfect harmony. Our approach is deeply collaborative, rooted in
              understanding your lifestyle, values, and vision.
              The result? Spaces that feel as good as they look.
            </p>
          </div>
          <img src={room4} alt="room" style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "4px",
            marginTop: "24px"
          }} />
        </div>
        <div className="luxury-center">
          <img src={room1} alt="Dining Room" className="luxury-real-img" />
        </div>
        <div className="luxury-right">
          <img src={room2} alt="Bathroom" className="luxury-real-img-sm" />
          <div className="luxury-sub">
            <h3>Mindful &<br />Soulful Spaces.</h3>
            <p>Bohemian elegance meets timeless design. We craft warm, textured interiors that tell your story — beautifully.</p>
            <p style={{ marginTop: "14px", color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: "1.8" }}>
              Every project we manage is a reflection of your personality — from color palettes and furniture to lighting and layouts. We bring your vision to life with precision and passion.
            </p>
            <p style={{ marginTop: "14px", color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: "1.8" }}>
              Whether it's a cozy bedroom retreat, a functional kitchen, or a statement living room — our intelligent platform helps you plan every detail, track every expense, and visualize every possibility.
            </p>
            <p style={{ marginTop: "14px", color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: "1.8" }}>
              With our AI-powered design assistant, you get personalized suggestions tailored to your style, space, and budget — making luxury interiors accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: SHOP */}
      <section id="shop" className="spaces-section">
        <h2 className="spaces-heading">Spaces That Speak</h2>
        <div className="spaces-grid">
          {[
            { img: room1, title: "Living Room", desc: "Curated elegance" },
            { img: room5, title: "Bedroom", desc: "Serene sanctuaries" },
            { img: room3, title: "Kitchen", desc: "Functional beauty" },
            { img: room7, title: "Office", desc: "Inspired workspaces" },
          ].map((r, i) => (
            <div className="space-card" key={i}>
              <div className="space-img-real">
                <img src={r.img} alt={r.title} />
              </div>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
              <span className="see-design">see design →</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link to="/register" className="btn-rust">VIEW ALL PROJECTS →</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        {[
          { icon: "🤖", label: "AI Design Assistant" },
          { icon: "💰", label: "Budget Tracker" },
          { icon: "🖼️", label: "Project Gallery" },
          { icon: "👑", label: "Admin Control" },
        ].map((f, i) => (
          <div className="feature-item" key={i}>
            <div className="feature-circle">{f.icon}</div>
            <p>{f.label}</p>
          </div>
        ))}
      </section>

      {/* SECTION 4: ABOUT */}
      <section id="about" className="experience-section">
        <div className="exp-left">
          <p className="section-tag" style={{ color: "var(--rust)" }}>✦ Why Choose Us</p>
          <h2 className="exp-heading">We Provide You The<br />Best Experience</h2>
          <p className="exp-desc">
            From planning to completion, Intelli-Interior gives you all the tools
            to manage your interior design projects smartly and beautifully.
          </p>
          <div className="exp-features">
            <div className="exp-feat"><span>✓</span> AI-powered design suggestions</div>
            <div className="exp-feat"><span>✓</span> Real-time budget tracking</div>
            <div className="exp-feat"><span>✓</span> Image gallery for each project</div>
            <div className="exp-feat"><span>✓</span> Admin & user role management</div>
          </div>
          <Link to="/register" className="btn-rust" style={{ display: "inline-block", marginTop: "28px" }}>
            START DESIGNING →
          </Link>
        </div>
        <div className="exp-right">
          <div className="exp-gallery">
            <img src={room3} alt="room" className="exp-img exp-img-1" />
            <img src={room4} alt="room" className="exp-img exp-img-2" />
            <img src={room7} alt="room" className="exp-img exp-img-3" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your Space?</h2>
          <p>Join designers who manage projects smarter with Intelli-Interior</p>
          <Link to="/register" className="btn-fill">START NOW ✦</Link>
        </div>
      </section>

    </div>
  );
}

export default Home;