import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { num: '15', suffix: '+', label: 'Years creating' },
  { num: '500', suffix: '+', label: 'Orders fulfilled' },
  { num: '5', suffix: '', label: 'Crafts mastered' },
  { num: 'BGC', suffix: '', label: 'Based in Manila' },
];

export default function AboutPage() {
  const pageRef = useRef(null);

  useEffect(() => {
    if (pageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      pageRef.current.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, []);

  return (
    <main className="about-page" ref={pageRef}>
      {/* Hero */}
      <div className="about-page-hero reveal">
        <div className="shop-page-eyebrow">The Creative</div>
        <h1 className="about-page-title">
          A story told<br />through <em>craft</em>
        </h1>
        <p className="shop-page-subtitle">
          Photography, crochet, engraving, stickers, embroidery — all made by hand, all made with intention.
        </p>
      </div>

      {/* Bio section */}
      <section className="about-page-bio">
        <div className="about-page-photo reveal">
          <div className="about-page-photo-inner">
            <span className="placeholder-label">Daj — BGC, Manila</span>
          </div>
        </div>

        <div className="about-page-story reveal reveal-delay-1">
          <div className="about-label">Since 2009</div>
          <h2 className="about-heading">
            From film to <em>handmade</em>
          </h2>
          <div className="about-body">
            <p>
              It started with a camera and a roll of film back in 2009. What began as a love for capturing
              everyday moments grew into something bigger — a full creative practice spanning photography,
              videography, and handmade personalized items.
            </p>
            <p style={{ marginTop: '16px' }}>
              Today, every piece that leaves the studio carries the same intention: tell a story.
              Whether it's a portrait session in BGC, a custom crocheted tote, a laser-engraved keepsake,
              or a set of die-cut stickers from your own design — it's all made with care, made by hand,
              made for you.
            </p>
            <p style={{ marginTop: '16px' }}>
              Based in Bonifacio Global City, Manila. Available for events, commissions,
              and collaborations.
            </p>
          </div>

          <div className="about-stats">
            {stats.map((s, i) => (
              <div key={i} className="about-stat-item">
                <div className="stat-num">
                  {s.num}{s.suffix && <em>{s.suffix}</em>}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark editorial quote */}
      <section className="editorial">
        <div className="editorial-label reveal">Philosophy</div>
        <blockquote className="editorial-quote reveal reveal-delay-1">
          "Every piece carries<br />a piece of <em>me</em>."
        </blockquote>
        <p className="editorial-body reveal reveal-delay-2">
          It's not about selling a product. It's about creating something
          that holds meaning — something you'll want to keep.
        </p>
        <div className="about-page-ctas reveal reveal-delay-3">
          <Link to="/shop" className="editorial-cta">Browse the shop →</Link>
          <Link to="/book" className="editorial-cta">Book a session →</Link>
        </div>
      </section>
    </main>
  );
}
