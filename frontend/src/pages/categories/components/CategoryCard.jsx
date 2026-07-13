import React from 'react';
import {
  FolderOpen,
  Hash,
  FileText,
  Package,
  Check,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import Card from '../../../common/Card';

const CategoryCard = ({ 
  category, 
  onToggleActive, 
  onEdit, 
  onDelete,
  isMutating 
}) => {
  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      {/* ✅ FIX: bg-gradient-to-br (standar Tailwind) */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        
        {/* ✅ FIX 1 & 2: Nama wrap text, slug & status di bawahnya */}
        <div className="space-y-2">
          <h3 className="text-white text-center font-semibold text-sm sm:text-base wrap-break-word leading-snug group-hover:text-indigo-300 transition-colors">
            {category.name}
          </h3>
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-xs font-mono">
                {category.slug}
              </p>
            </div>
            
            <div className={`px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${
              category.is_active 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {category.is_active ? 'Aktif' : 'Nonaktif'}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 pt-1">
          {/* Description */}
          <div className="flex justify-center">
            <span className="text-xs sm:text-sm text-slate-300 text-center line-clamp-6 w-full px-2">
              {category.description || 'Tidak ada deskripsi'}
            </span>
          </div>

          {/* Product Types Count */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-slate-400">
              <span className="font-semibold text-indigo-400">
                {category.product_types_count || 0}
              </span>{' '}
              jenis produk
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 mt-auto border-t border-slate-700/50">
          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <button
              onClick={() => onToggleActive(category)}
              disabled={isMutating}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                category.is_active
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}
              title={category.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            >
              {category.is_active ? <XCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{category.is_active ? 'Nonaktif' : 'Aktif'}</span>
            </button>

            <button
              onClick={() => onEdit(category)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => onDelete(category)}
              disabled={isMutating}
              className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-xs">Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;