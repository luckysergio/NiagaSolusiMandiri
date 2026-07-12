// src/pages/dashboard/components/common/LoadingState.jsx
import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const LoadingState = ({ message = 'Memuat data...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
      <p className="text-slate-400 text-sm animate-pulse">{message}</p>
    </div>
  </div>
);

export default LoadingState;