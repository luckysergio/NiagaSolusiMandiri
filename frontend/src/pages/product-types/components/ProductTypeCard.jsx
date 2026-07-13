import React from 'react';
import {
  Layers,
  FolderOpen,
  Package,
  FileText,
  Check,
  XCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import Card from '../../../common/Card';

const ProductTypeCard = ({ 
  productType, 
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
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Image/Icon */}
          <div className="relative shrink-0">
            {productType.image_url ? (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-slate-700">
                <img 
                  src={productType.image_url} 
                  alt={productType.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg ${
                productType.is_active 
                  ? 'bg-linear-to-br from-cyan-500 to-blue-500' 
                  : 'bg-linear-to-br from-slate-600 to-slate-700'
              }`}>
                {getInitials(productType.name)}
              </div>
            )}
            {/* Status Indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-slate-800 ${
              productType.is_active ? 'bg-emerald-500' : 'bg-slate-500'
            }`} />
          </div>

          {/* Product Type Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-cyan-300 transition-colors">
              {productType.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FolderOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-xs sm:text-sm truncate">
                {productType.category?.name || 'No Category'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`shrink-0 px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${
            productType.is_active 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {productType.is_active ? 'Aktif' : 'Nonaktif'}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 pt-1">
          {/* Description */}
          <div className="flex justify-center">
            <span className="text-xs sm:text-sm text-slate-300 text-center line-clamp-6 w-full px-2">
              {productType.description || 'Tidak ada deskripsi'}
            </span>
          </div>

          {/* Products Count */}
          <div className="flex justify-center gap-2">
            <span className="text-xs sm:text-sm text-slate-400">
              <span className="font-semibold text-cyan-400">
                {productType.products_count || 0}
              </span>{' '}
              produk
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 mt-auto border-t border-slate-700/50">
          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <button
              onClick={() => onToggleActive(productType)}
              disabled={isMutating}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                productType.is_active
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}
              title={productType.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            >
              {productType.is_active ? <XCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{productType.is_active ? 'Nonaktif' : 'Aktif'}</span>
            </button>

            <button
              onClick={() => onEdit(productType)}
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
              onClick={() => onDelete(productType)}
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

export default ProductTypeCard;