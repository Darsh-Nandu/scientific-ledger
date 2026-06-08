import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  key?: string | number;
}

export default function ScrollReveal({ children, className = "", delayMs = 0 }: ScrollRevealProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsIntersecting(true);
          }, delayMs);
          // Once it reveals, we can unobserve to keep state static
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is in view
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters fully
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isIntersecting
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-98"
      } ${className}`}
    >
      {children}
    </div>
  );
}
