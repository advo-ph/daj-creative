import { Link } from 'react-router-dom';

const products = [
  {
    colorClass: 'si-1',
    tag: 'Crochet',
    name: 'Custom tote & keychain',
    desc: 'Personalized with your name or photo. Made to order.',
  },
  {
    colorClass: 'si-2',
    tag: 'Laser Engraving',
    name: 'Engraved keepsake',
    desc: 'Wood, acrylic, and more. Any text, any design.',
  },
  {
    colorClass: 'si-3',
    tag: 'Stickers & Prints',
    name: 'Custom sticker set',
    desc: 'Die-cut from your design. Waterproof. Any size.',
  },
];

export default function ShopTeaser() {
  return (
    <section className="shop-teaser" id="shop">
      <div className="section-header reveal" style={{ padding: 0 }}>
        <h2 className="section-heading">
          Made by <em>hand</em>
        </h2>
        <Link to="/shop" className="section-link">Shop all →</Link>
      </div>

      <div className="shop-grid">
        {products.map((p, i) => (
          <div
            key={i}
            className={`shop-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
          >
            <div className="shop-card-img">
              <div className={p.colorClass} />
            </div>
            <div className="shop-card-body">
              <div className="shop-card-tag">{p.tag}</div>
              <div className="shop-card-name">{p.name}</div>
              <div className="shop-card-desc">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
