import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="footer-logo">SweetCraft</span>
        <p className="footer-tag">Handcrafted treats, stocked with care.</p>
      </div>
      <div className="footer-links">
        <div>
          <p className="footer-head">Visit</p>
          <span>123 Candy Lane, Sugarville</span>
        </div>
        <div>
          <p className="footer-head">Hours</p>
          <span>Mon–Sat · 9a–9p</span>
        </div>
        <div>
          <p className="footer-head">Support</p>
          <a href="mailto:support@sweetshop.test">support@sweetshop.test</a>
        </div>
      </div>
    </footer>
  );
}
