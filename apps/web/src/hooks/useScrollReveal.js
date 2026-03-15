import { useEffect } from 'react';

export function useScrollReveal(dep) {
  useEffect(() => {
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

    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [dep]);
}
