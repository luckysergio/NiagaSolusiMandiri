import React, { useState } from 'react';
import { Package } from 'lucide-react';
import logoNsm from '../assets/logo-nsm.png';

const Logo = ({ className = "", showText = true, size = "md", onClick = null }) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeClasses = {
    sm: { 
      container: "w-8 h-8", 
      text: "text-sm", 
      icon: "w-5 h-5",
      tagline: "text-[8px]",
      gap: "gap-1.5",
      padding: "p-1",
    },
    md: { 
      container: "w-12 h-12", 
      text: "text-base", 
      icon: "w-6 h-6",
      tagline: "text-[10px]",
      gap: "gap-2",
      padding: "p-1.5",
    },
    lg: { 
      container: "w-16 h-16", 
      text: "text-xl", 
      icon: "w-7 h-7",
      tagline: "text-xs",
      gap: "gap-3",
      padding: "p-2",
    },
  };
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div 
      onClick={handleClick} 
      className={`flex items-center ${sizeClasses[size].gap} group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Logo Image / Fallback */}
      <div className={`
        ${sizeClasses[size].container} 
        rounded-xl overflow-hidden 
        shadow-lg shadow-slate-200/50 
        transition-all duration-300 
        ${onClick ? 'group-hover:scale-105 group-hover:shadow-indigo-300/30' : ''}
        bg-white
        flex items-center justify-center
        shrink-0
        border border-slate-200
      `}>
        {logoNsm && !imgError ? (
          <img 
            src={logoNsm} 
            alt="Niaga Solusi Mandiri" 
            className={`w-full h-full object-contain ${sizeClasses[size].padding}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <Package className={`${sizeClasses[size].icon} text-indigo-600`} />
        )}
      </div>
      
      {showText && (
        <div className="shrink-0 min-w-0">
          <h1 className={`
            font-bold text-slate-800 
            ${sizeClasses[size].text}
            whitespace-nowrap
            leading-tight
          `}>
            Niaga Solusi Mandiri
          </h1>
          <p className={`
            text-slate-500 font-medium
            ${sizeClasses[size].tagline}
            whitespace-nowrap
            leading-tight
          `}>
            Readymix &amp; Concrete Pump
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;