import { useEffect } from 'react';

export function ScrollbarAutohide() {
  useEffect(() => {
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const handleScroll = (event: Event) => {
      const element = event.target === document ? document.documentElement : event.target;
      if (!(element instanceof Element)) return;
      const previousTimer = timers.get(element);
      if (previousTimer) clearTimeout(previousTimer);
      element.classList.add('is-scrolling');
      timers.set(element, setTimeout(() => {
        element.classList.remove('is-scrolling');
        timers.delete(element);
      }, 700));
    };
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('scroll', handleScroll, true);
      timers.forEach((timer, element) => {
        clearTimeout(timer);
        element.classList.remove('is-scrolling');
      });
    };
  }, []);
  return null;
}
