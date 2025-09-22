import { useEffect, useMemo } from "react";

export function StarrySky({ onDone, duration = 1600 }: { onDone?: () => void; duration?: number }){
  useEffect(()=>{
    const t = setTimeout(()=> onDone?.(), duration);
    return ()=> clearTimeout(t);
  }, [onDone, duration]);

  const stars = useMemo(()=> Array.from({ length: 120 }).map((_, i)=> ({
    id: i,
    left: Math.random()*100,
    size: Math.random() < 0.15 ? 3 : 2,
    delay: Math.random()*0.6,
    dur: 1 + Math.random()*1.2,
    opacity: 0.4 + Math.random()*0.6,
  })), []);

  return (
    <div className="starry-overlay pointer-events-none" style={{ ['--fall-dur' as any]: `${duration}ms` }}>
      {stars.map(s=> (
        <span
          key={s.id}
          className="star"
          style={{
            top: `-10%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            ['--twinkle-dur' as any]: `${s.dur}s`,
            animationDelay: `0s, ${s.delay}s`,
          }}
        />
      ))}
      <div className="moon" />
    </div>
  );
}
