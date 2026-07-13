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
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="relative shrink-0">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg ${
              category.is_active 
                ? 'bg-linear-to-br from-indigo-500 to-purple-500' 
                : 'bg-linear-to-br from-slate-600 to-slate-700'
            }`}>
              {getInitials(category.name)}
            </div>
            {/* Status Indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-slate-800 ${
              category.is_active ? 'bg-emerald-500' : 'bg-slate-500'
            }`} />
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-indigo-300 transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-xs sm:text-sm truncate font-mono">
                {category.slug}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`shrink-0 px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${
            category.is_active 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {category.is_active ? 'Aktif' : 'Nonaktif'}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 pt-1">
          {/* Description */}
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {category.description || 'Tidak ada deskripsi'}
            </span>
          </div>

          {/* Product Types Count */}
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
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