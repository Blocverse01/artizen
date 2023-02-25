import { RefObject, useEffect } from "react";

const useObserver = (
  ref: RefObject<HTMLElement>,
  isLast: boolean,
  handleLimitChange: () => void
) => {
  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        handleLimitChange();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLast]);
};

export { useObserver };
