
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  thickness?: number;
  animate?: boolean;
}

export function ScoreGauge({ 
  score, 
  size = 120, 
  thickness = 10,
  animate = true
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  
  // Calculate circle properties
  const radius = size / 2;
  const circumference = 2 * Math.PI * (radius - thickness / 2);
  const strokeDashoffset = circumference * (1 - displayScore / 100);
  
  useEffect(() => {
    if (animate) {
      // Animate the score gauge
      let start = 0;
      const duration = 1500;
      const startTime = performance.now();
      
      const animateScore = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentScore = Math.floor(progress * score);
        
        setDisplayScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };
      
      requestAnimationFrame(animateScore);
    } else {
      setDisplayScore(score);
    }
  }, [score, animate]);
  
  // Determine color based on score
  const getScoreColor = () => {
    if (displayScore >= 75) return "rgb(34, 197, 94)"; // green-500
    if (displayScore >= 50) return "rgb(234, 179, 8)";  // yellow-500
    return "rgb(239, 68, 68)"; // red-500
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - thickness / 2}
          stroke="#e5e7eb" // gray-200
          strokeWidth={thickness}
          fill="none"
        />
        
        {/* Foreground circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - thickness / 2}
          stroke={getScoreColor()}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{
            transition: animate ? "stroke-dashoffset 1.5s ease-in-out" : "none",
          }}
        />
        
        {/* Score text */}
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize={size / 4}
          fontWeight="bold"
          fill={getScoreColor()}
        >
          {displayScore}%
        </text>
      </svg>
    </div>
  );
}

export default ScoreGauge;
