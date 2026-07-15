import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = 'Memuat data...', icon: Icon }) => (
  <div className="flex items-center justify-center py-16 animate-fadeIn">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
        {Icon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-400" />
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  </div>
);

export default LoadingState;