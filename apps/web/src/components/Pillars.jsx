const pillars = [
  {
    num: '01',
    name: <>Portfolio &amp;<br /><em>Story</em></>,
    desc: '16 years of captured moments, crafted items, and everyday stories worth keeping.',
    link: '#work',
    linkText: 'See the work',
  },
  {
    num: '02',
    name: <>Photography<br />&amp; <em>Video</em></>,
    desc: "Events, family sessions, and narrative video. You're not paying for the photo — you're paying for the memory.",
    link: '#book',
    linkText: 'Book a session',
  },
  {
    num: '03',
    name: <>Personalized<br /><em>Items</em></>,
    desc: 'Crochet, laser engraving, stickers, embroidery — made with your name, your photo, your story.',
    link: '#shop',
    linkText: 'Browse the shop',
  },
];

export default function Pillars() {
  return (
    <div className="pillars">
      {pillars.map((p, i) => (
        <div
          key={p.num}
          className={`pillar-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
        >
          <div className="pillar-num">{p.num}</div>
          <h2 className="pillar-name">{p.name}</h2>
          <p className="pillar-desc">{p.desc}</p>
          <a href={p.link} className="pillar-link">{p.linkText}</a>
        </div>
      ))}
    </div>
  );
}
