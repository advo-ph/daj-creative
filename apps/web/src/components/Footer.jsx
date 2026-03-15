export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-top">
        <div>
          <div className="footer-brand">
            Daj<br /><em>Creative</em>
          </div>
          <div className="footer-tagline">
            Photography, video, and personalized items — all made with
            intention.
          </div>
        </div>

        <nav className="footer-nav">
          <a href="#work">Work</a>
          <a href="#book">Book</a>
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-connect">
          <div className="footer-connect-label">Follow along</div>
          <a
            href="https://instagram.com/dajcreative"
            className="footer-ig"
          >
            @dajcreative
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          © 2025 Daj Creative. All rights reserved.
        </span>
        <span className="footer-made">dajcreative.ph</span>
      </div>
    </footer>
  );
}
