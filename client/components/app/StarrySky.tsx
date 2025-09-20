import { useEffect, useMemo } from "react";

export function StarrySky({ onDone, duration = 1600 }: { onDone?: () => void; duration?: number }){
  useEffect(()=>{
    const t = setTimeout(()=> onDone?.(), duration);
    return ()=> clearTimeout(t);
  }, [onDone, duration]);

  const stars = useMemo(()=> Array.from({ length: 60 }).map((_, i)=> ({
    id: i,
    top: Math.random()*100,
    left: Math.random()*100,
    size: Math.random() < 0.2 ? 3 : 2,
    delay: Math.random()*1.2,
    dur: 1.2 + Math.random()*1.2,
    opacity: 0.3 + Math.random()*0.7,
  })), []);

  return (
    <div className="starry-overlay pointer-events-none">
      {stars.map(s=> (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
      <div className="moon" />
    </div>
  );
}
