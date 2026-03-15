import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRightRef = useRef(null);

  useEffect(() => {
    const el = heroRightRef.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * 0.06}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          Photography · Creative · Since 2009
        </div>

        <h1 className="hero-headline">
          Capturing stories,<br />crafting <em>memory.</em>
        </h1>

        <p className="hero-sub">
          Photography, video, and handmade personalized items — all made with
          intention, all built around your story.
        </p>

        <div className="hero-actions">
          <a href="#book" className="btn-primary">Book a session</a>
          <a href="#work" className="btn-ghost">See the work</a>
        </div>

        <div className="hero-scroll-hint">Scroll</div>
      </div>

      <div
        ref={heroRightRef}
        className="hero-right"
        aria-hidden="true"
      >
        <div className="hero-photo">
          <div className="photo-placeholder pp-1">
            <span>Events</span>
          </div>
        </div>
        <div className="hero-photo">
          <div className="photo-placeholder pp-2">
            <span>Portrait</span>
          </div>
        </div>
        <div className="hero-photo">
          <div className="photo-placeholder pp-3">
            <span>Items</span>
          </div>
        </div>
        <div className="hero-photo">
          <div className="photo-placeholder pp-4">
            <span>Video</span>
          </div>
        </div>
      </div>
    </section>
  );
}
