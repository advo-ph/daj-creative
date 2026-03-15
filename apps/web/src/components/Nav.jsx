import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  // On landing page, use hash anchors for work section. On other pages, link home.
  const workAnchor = isHome ? '#work' : '/#work';

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`nav-overlay ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <a href={workAnchor} onClick={closeMenu}>Work</a>
        <Link to="/book" onClick={closeMenu}>Book</Link>
        <Link to="/shop" onClick={closeMenu}>Shop</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <div className="nav-overlay-sub">@dajcreative · dajcreative.ph</div>
      </div>

      {/* Nav Bar */}
      <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">Daj Creative</Link>
        <ul className="nav-links">
          <li><a href={workAnchor}>Work</a></li>
          <li><Link to="/book">Book</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <Link to="/book" className="nav-cta">Book a session</Link>
        <button
          className={`nav-burger ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </nav>
    </>
  );
}
