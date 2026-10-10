import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // Add a slight delay to ensure DOM is fully painted after route change
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { 
        threshold: 0.05, 
        rootMargin: "0px 0px -50px 0px" 
      });

      const hiddenElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      hiddenElements.forEach((el) => observer.observe(el));

      return () => {
        hiddenElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
}
