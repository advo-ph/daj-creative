import { useEffect, useRef } from 'react';

export function useCursor(dep) {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const addExpanded = () => cursor.classList.add('expanded');
    const removeExpanded = () => cursor.classList.remove('expanded');

    document.addEventListener('mousemove', onMove);

    const interactives = document.querySelectorAll(
      'a, button, .pillar-card, .work-item, .shop-card, .shop-page-card, input, textarea, select'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', addExpanded);
      el.addEventListener('mouseleave', removeExpanded);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', addExpanded);
        el.removeEventListener('mouseleave', removeExpanded);
      });
    };
  }, [dep]);

  return cursorRef;
}
