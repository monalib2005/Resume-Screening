
import { useEffect, useRef, useState } from "react";

export function FloatingResume() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="perspective-container w-full h-full relative"
    >
      <div 
        className="transform-3d absolute w-64 h-72 rounded-md shadow-xl"
        style={{
          transform: `rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="w-full h-full bg-white rounded-md shadow-xl border border-gray-200 p-4 overflow-hidden">
          <div className="w-full h-4 bg-primary mb-4 rounded-sm" />
          <div className="space-y-2">
            <div className="w-3/4 h-3 bg-gray-200 rounded-sm" />
            <div className="w-1/2 h-3 bg-gray-200 rounded-sm" />
            <div className="w-5/6 h-3 bg-gray-200 rounded-sm" />
            <div className="w-4/5 h-3 bg-gray-200 rounded-sm" />
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="w-full h-3 bg-gray-100 rounded-sm" />
            <div className="w-full h-3 bg-gray-100 rounded-sm" />
            <div className="w-full h-3 bg-gray-100 rounded-sm" />
            <div className="w-full h-3 bg-gray-100 rounded-sm" />
            <div className="w-3/4 h-3 bg-gray-100 rounded-sm" />
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="w-1/3 h-3 bg-gray-200 rounded-sm" />
            <div className="w-1/2 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3/5 h-3 bg-gray-100 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingResume;
