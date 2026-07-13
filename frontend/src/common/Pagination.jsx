// src/pages/dashboard/components/common/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, currentPage, onPageChange }) => {
  if (!pagination.last_page || pagination.last_page <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-700/50">
      <p className="text-sm text-slate-400">
        Menampilkan <span className="font-semibold text-white">{pagination.from || 0}</span> -{' '}
        <span className="font-semibold text-white">{pagination.to || 0}</span> dari{' '}
        <span className="font-semibold text-indigo-400">{pagination.total || 0}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
          <span className="text-sm font-semibold text-white">{currentPage}</span>
          <span className="text-sm text-slate-400">/</span>
          <span className="text-sm text-slate-400">{pagination.last_page}</span>
        </div>
        <button
          onClick={() => onPageChange((p) => Math.min(pagination.last_page, p + 1))}
          disabled={currentPage === pagination.last_page}
          className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;