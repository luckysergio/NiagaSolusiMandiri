import { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.2 + 0.05})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
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
      const particleCount = Math.min(80, window.innerWidth / 25);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 150);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          {/* Logo Container */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse"></div>
            <div className="absolute inset-1 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <span className="text-4xl">🏗️</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-white">
            Solusi Pompa Beton
          </h2>
          
          <p className="text-slate-400 text-sm mb-6">Niaga Solusi Mandiri</p>
          
          {/* Circular Progress */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#334155"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#6366f1"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(progress, 100) / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-150 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold">{Math.floor(Math.min(progress, 100))}%</span>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            {progress < 30 && "Mempersiapkan website..."}
            {progress >= 30 && progress < 60 && "Memuat layanan terbaik..."}
            {progress >= 60 && progress < 90 && "Hampir selesai..."}
            {progress >= 90 && "Menampilkan website..."}
          </p>
          
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}