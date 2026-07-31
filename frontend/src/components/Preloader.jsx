import { useEffect, useState, useRef } from "react";
import logoNsm from "../assets/logo-nsm.png";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;

    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.15 + 0.05})`;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(60, Math.floor(window.innerWidth / 30));
      for (let i = 0; i < count; i++) particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => { resizeCanvas(); initParticles(); };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", handleResize); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 15;
      });
    }, 100);

    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsLoading(false), 500);
    }, 1200);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-9999 flex items-center justify-center bg-slate-950 transition-opacity duration-500 ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`} role="status" aria-label="Memuat halaman">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 text-center max-w-sm mx-auto px-6">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-xl bg-indigo-500/20 animate-ping opacity-20" aria-hidden="true" />
            <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10 overflow-hidden p-2 border border-slate-700/50">
              <img src={logoNsm} alt="Logo Niaga Solusi Mandiri" width="80" height="80" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1 text-white tracking-wide">Niaga Solusi Mandiri</h2>
          <p className="text-slate-400 text-xs mb-6 uppercase tracking-wider">Solusi Pompa Beton</p>

          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-800" aria-hidden="true" />
            <div
              className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 animate-spin"
              style={{ animationDuration: "1s" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{Math.floor(Math.min(progress, 100))}%</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs h-4">
            {progress < 30 && "Mempersiapkan website..."}
            {progress >= 30 && progress < 60 && "Memuat layanan terbaik..."}
            {progress >= 60 && progress < 90 && "Hampir selesai..."}
            {progress >= 90 && "Menampilkan website..."}
          </p>
          <div className="flex justify-center gap-1.5 mt-4" aria-hidden="true">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}