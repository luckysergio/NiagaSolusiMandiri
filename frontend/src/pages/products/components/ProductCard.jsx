import React from 'react';
import {
  Package,
  FolderOpen,
  Layers,
  Star,
  Hash,
  Check,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import Card from '../../../common/Card';

const ProductCard = ({ 
  product, 
  onToggleActive, 
  onToggleFeatured,
  onEdit, 
  onDelete,
  isMutating 
}) => {
  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return 'Rp ' + numPrice.toLocaleString('id-ID');
  };

  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {product.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-full shadow-lg">
          <Star className="w-3 h-3 fill-white" />
          <span>Featured</span>
        </div>
      )}

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        <div className="flex items-start gap-3">

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-indigo-300 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-xs sm:text-sm truncate font-mono">
                {product.code}
              </p>
            </div>
          </div>

          <div className={`shrink-0 px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${
            product.is_active 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {product.is_active ? 'Aktif' : 'Nonaktif'}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-300 truncate">
              {product.product_type?.name || '-'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-300 truncate">
              {product.product_type?.category?.name || '-'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-300">Harga:</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              {formatPrice(product.price)}
              <span className="text-xs text-slate-400 font-normal ml-1">
                / {product.unit || 'unit'}
              </span>
            </span>
          </div>

          {product.minimum_order > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Min. Order:</span>
              <span className="font-semibold text-white">
                {product.minimum_order} {product.unit || 'unit'}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 mt-auto border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <button
              onClick={() => onToggleActive(product)}
              disabled={isMutating}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                product.is_active
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}
              title={product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            >
              {product.is_active ? <XCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{product.is_active ? 'Nonaktif' : 'Aktif'}</span>
            </button>

            <button
              onClick={() => onEdit(product)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => onToggleFeatured(product)}
              disabled={isMutating}
              className={`flex-1 p-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
                product.featured
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-slate-700/30 text-slate-400 border-slate-600/30 hover:bg-slate-700/50 hover:text-amber-400'
              }`}
              title={product.featured ? 'Hapus Featured' : 'Tandai Featured'}
            >
              <Star className={`w-3.5 h-3.5 ${product.featured ? 'fill-amber-400' : ''}`} />
              <span className="text-xs">
                {product.featured ? 'Featured' : 'Jadikan Featured'}
              </span>
            </button>

            <button
              onClick={() => onDelete(product)}
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

export default ProductCard;