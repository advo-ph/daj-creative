import { useRef } from 'react';

const items = [
  { color: '#b0aba2', label: 'Events · 2025' },
  { color: '#888480', label: 'Family · 2024' },
  { color: '#9c9892', label: 'Video · 2024' },
  { color: '#787470', label: 'Portrait · 2024' },
  { color: '#a4a09a', label: 'Events · 2023' },
];

export default function WorkStrip() {
  const stripRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e) => {
    const strip = stripRef.current;
    dragState.current = {
      isDragging: true,
      startX: e.pageX - strip.offsetLeft,
      scrollLeft: strip.scrollLeft,
    };
  };

  const onMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const strip = stripRef.current;
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    strip.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDrag = () => {
    dragState.current.isDragging = false;
  };

  return (
    <section className="work-strip-section" id="work">
      <div className="section-header reveal">
        <h2 className="section-heading">
          Recent <em>work</em>
        </h2>
        <a href="/portfolio" className="section-link">View all →</a>
      </div>

      <div
        ref={stripRef}
        className="work-strip"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {items.map((item, i) => (
          <div className="work-item" key={i}>
            <div
              className="work-item-inner"
              style={{ background: item.color }}
            />
            <div className="work-item-overlay">
              <span className="work-item-label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
