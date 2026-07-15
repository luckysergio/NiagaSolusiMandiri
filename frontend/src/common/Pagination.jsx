import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, currentPage, onPageChange, className = '' }) => {
  if (!pagination?.last_page || pagination.last_page <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 mt-4 border-t border-slate-700/50 animate-fadeIn ${className}`}>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2.5 bg-slate-700/50 hover:bg-indigo-600 hover:text-white border border-slate-600/50 hover:border-indigo-500 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-400 active:scale-95"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-1 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl">
          <span className="text-sm font-bold text-white">{currentPage}</span>
          <span className="text-sm text-slate-500">/</span>
          <span className="text-sm text-slate-400">{pagination.last_page}</span>
        </div>
        
        <button
          onClick={() => onPageChange((p) => Math.min(pagination.last_page, p + 1))}
          disabled={currentPage === pagination.last_page}
          className="p-2.5 bg-slate-700/50 hover:bg-indigo-600 hover:text-white border border-slate-600/50 hover:border-indigo-500 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-400 active:scale-95"
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;