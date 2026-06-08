import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<"default" | "clickable" | "read" | "ai">("default");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Detect mouse-pointer fine interfaces (desktops/laptops)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);
    
    const onChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    // Set custom-cursor-active on root HTML dynamically to suppress legacy system cursor
    document.documentElement.classList.add("custom-cursor-active");
    
    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;
    let isTracking = false;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isTracking) {
        // snaps initial position instantly so it doesn't slide from origin
        trailX = mouseX;
        trailY = mouseY;
        isTracking = true;
      }
      
      setIsVisible(true);
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };
    
    // High-frequency buttery smooth trailing animation
    let animationFrameId = 0;
    const animateTrail = () => {
      const ease = 0.22; // fast and crisp spring feel to match editorial precision
      trailX += (mouseX - trailX) * ease;
      trailY += (mouseY - trailY) * ease;
      
      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(animateTrail);
    };
    
    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    
    const onMouseLeaveDoc = () => setIsVisible(false);
    const onMouseEnterDoc = () => setIsVisible(true);
    
    // Auto Context-Aware delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      // Determine what context is hovered
      const closestBtn = target.closest("button");
      const isAiBtn = closestBtn?.textContent?.toLowerCase().includes("summarize") || closestBtn?.classList.contains("ai-summary-trigger");
      const isCardBody = target.closest(".group\\/cardbody");
      const isClickable = target.closest("button, a, select, input, [role='button'], .cursor-pointer");
      
      if (isAiBtn) {
        setHoverType("ai");
      } else if (isCardBody) {
        setHoverType("read");
      } else if (isClickable) {
        setHoverType("clickable");
      } else {
        setHoverType("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeaveDoc);
    document.addEventListener("mouseenter", onMouseEnterDoc);
    
    animationFrameId = requestAnimationFrame(animateTrail);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      document.removeEventListener("mouseenter", onMouseEnterDoc);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFinePointer]);

  if (!isFinePointer || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Precision center dot */}
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-black rounded-full mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      
      {/* Dynamic tracking anchor */}
      <div
        ref={cursorTrailRef}
        className="fixed top-0 left-0 w-0 h-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        {/* Visual custom-styled cursor body */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 border-black flex items-center justify-center font-mono font-bold text-[9px] uppercase tracking-wider shadow-[2px_2px_0px_#000] transition-[width,height,background-color,border-color,opacity,box-shadow,transform] duration-150 ease-out
            ${hoverType === "default" ? "w-8 h-8 rounded-full bg-white/20 backdrop-blur-[0.5px]" : ""}
            ${hoverType === "clickable" ? "w-10 h-10 rounded-full bg-[#FFCCD5] scale-100" : ""}
            ${hoverType === "read" ? "w-20 h-7 rounded-sm bg-[#FFF275] px-2 shadow-[2px_2px_0px_#000] scale-100" : ""}
            ${hoverType === "ai" ? "w-24 h-7.5 rounded-sm bg-[#EAEAFF] px-2 shadow-[2px_2px_0px_#000] scale-100" : ""}
            ${isMouseDown ? "scale-90" : ""}
          `}
        >
          {hoverType === "read" && <span className="text-black">Open Paper ↗</span>}
          {hoverType === "ai" && <span className="text-black flex items-center gap-1">Summarize ✨</span>}
        </div>
      </div>
    </div>
  );
}
