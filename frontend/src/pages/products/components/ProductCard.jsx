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
import StatusBadge from '../../../common/StatusBadge';

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
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const minOrder = Math.round(parseFloat(product.minimum_order) || 0);
  const unit = product.unit || 'unit';

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col border border-slate-700/50 bg-slate-800/40 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex-1 flex flex-col p-4 sm:p-5">
        
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => onToggleFeatured(product)}
            disabled={isMutating}
            className={`p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              product.featured
                ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 hover:scale-110'
                : 'text-slate-600 hover:text-amber-400 hover:bg-slate-700/50 hover:scale-110'
            }`}
            title={product.featured ? 'Hapus Featured' : 'Tandai sebagai Featured'}
          >
            <Star className={`w-5 h-5 ${product.featured ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Status Badge */}
          <StatusBadge status={product.is_active ? 'active' : 'inactive'} size="xs" />
        </div>

        <div className="space-y-3 mb-4">
          <h3 className="text-white font-bold text-base sm:text-lg text-center wrap-break-word leading-snug group-hover:text-indigo-300 transition-colors line-clamp-3">
            {product.name}
          </h3>
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 rounded-md border border-slate-700/50">
              <Hash className="w-3 h-3 text-slate-400" />
              <span className="text-slate-300 text-xs font-mono tracking-wide">
                {product.code}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent mb-4" />

        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Jenis</span>
                <span className="text-sm text-slate-200 font-medium truncate">
                  {product.product_type?.name || '-'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Kategori</span>
                <span className="text-sm text-slate-200 font-medium truncate">
                  {product.product_type?.category?.name || '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/40 border border-slate-700/40 rounded-xl space-y-2">
            <div className="flex items-center justify-center">
              <span className="text-base font-bold text-emerald-400 tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {minOrder > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                <span className="text-xs text-slate-500">Min. Pemesanan</span>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                  {minOrder} {unit}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-700/40">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onEdit(product)}
              disabled={isMutating}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Edit</span>
            </button>

            <button
              onClick={() => onDelete(product)}
              disabled={isMutating}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;