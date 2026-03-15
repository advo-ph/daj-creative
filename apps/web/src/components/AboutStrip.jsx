const stats = [
  { num: '16', unit: 'yrs', label: 'Since 2009' },
  { num: '5', unit: '+', label: 'Creative disciplines' },
  { num: '∞', unit: null, label: 'Stories captured' },
  { num: '1', unit: null, label: 'Vision' },
];

export default function AboutStrip() {
  return (
    <section className="about-strip" id="about">
      <div className="about-img reveal" aria-label="Daj at work">
        <div className="about-img-tag">Daj · BGC, Manila</div>
      </div>

      <div>
        <div className="about-label reveal">The person behind it</div>
        <h2 className="about-heading reveal">
          Daj Creative<br />is one <em>person</em><br />and a lot of heart.
        </h2>
        <p className="about-body reveal">
          Started with a camera in 2009 — back when it was purely passion. Over
          the years, one thing led to another: laser engravers, embroidery
          machines, a Cricut, a crochet hook. Everything Daj makes is built
          around the same idea: the object should carry a story.
        </p>
        <a href="/about" className="btn-primary reveal">More about Daj</a>
        <div className="about-stats reveal">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="stat-num">
                {s.num}
                {s.unit && <em>{s.unit}</em>}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
