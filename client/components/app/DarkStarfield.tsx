import { useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

type Star = {
  x: number;
  y: number;
  r: number; // radius
  speed: number; // px/s
  tw: number; // twinkle phase
  twSpeed: number; // radians/s
  color: string;
};

export function DarkStarfield(){
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  const lastRef = useRef<number>(0);

  // Create a soft-glow star sprite for performant draws
  useEffect(()=>{
    const off = document.createElement("canvas");
    off.width = 32; off.height = 32;
    const g = off.getContext("2d")!;
    const grd = g.createRadialGradient(16,16,0,16,16,12);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.5, "rgba(255,255,200,0.6)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd; g.beginPath(); g.arc(16,16,12,0,Math.PI*2); g.fill();
    spriteRef.current = off;
  },[]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Rebuild stars proportionally to area for performance
      const count = Math.max(80, Math.min(240, Math.floor((w*h)/16000)));
      const stars: Star[] = new Array(count).fill(0).map(()=> ({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 0.6 + Math.random()*1.8,
        speed: 20 + Math.random()*60, // px/s
        tw: Math.random()*Math.PI*2,
        twSpeed: 1 + Math.random()*2.5,
        color: Math.random()<0.2 ? "#ffe9a8" : "#ffffff",
      }));
      starsRef.current = stars;
    };

    resize();
    window.addEventListener("resize", resize);
    return ()=> window.removeEventListener("resize", resize);
  },[]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const sprite = spriteRef.current;

    const step = (ts: number) => {
      if(!lastRef.current) lastRef.current = ts;
      const dt = Math.min(64, ts - lastRef.current) / 1000; // clamp
      lastRef.current = ts;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Background (very dark blue)
      ctx.fillStyle = "#020617"; // slate-950
      ctx.fillRect(0,0,w,h);

      const stars = starsRef.current;
      for(let i=0;i<stars.length;i++){
        const s = stars[i];
        s.y += s.speed * dt;
        s.tw += s.twSpeed * dt;
        if(s.y - s.r > h) {
          s.y = -s.r - Math.random()*20;
          s.x = Math.random()*w;
          s.speed = 20 + Math.random()*60;
          s.r = 0.6 + Math.random()*1.8;
        }
        const alpha = 0.5 + 0.5*Math.sin(s.tw);
        ctx.globalAlpha = 0.4 + 0.6*alpha;
        if(sprite){
          const size = s.r * 8; // scale sprite
          ctx.drawImage(sprite, s.x - size/2, s.y - size/2, size, size);
        } else {
          ctx.fillStyle = s.color;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(step);
    };

    // Start/stop based on theme
    if(theme === "dark"){
      if(rafRef.current == null) {
        lastRef.current = 0;
        rafRef.current = requestAnimationFrame(step);
      }
    } else {
      if(rafRef.current != null){ cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0,0,w,h);
    }

    return ()=>{ if(rafRef.current != null) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [theme]);

  if (theme !== "dark") return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
