import React from 'react';
import {
  Truck,
  Phone,
  MapPin,
  Package,
  Check,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import Card from '../../../common/Card';
import StatusBadge from '../../../common/StatusBadge';

const SupplierCard = ({ 
  supplier, 
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
    <Card className="group relative overflow-hidden h-full flex flex-col border border-slate-700/50 bg-slate-800/40 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex-1 flex flex-col p-4 sm:p-5">
        <div className="space-y-3 mb-4">
          <div className="flex justify-center mb-2">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
              supplier.is_active 
                ? 'bg-linear-to-br from-indigo-500 to-purple-500' 
                : 'bg-linear-to-br from-slate-600 to-slate-700'
            }`}>
              {getInitials(supplier.name)}
            </div>
          </div>
          <h3 className="text-white font-bold text-base sm:text-lg text-center wrap-break-word leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
            {supplier.name}
          </h3>
          
          {supplier.phone && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 rounded-md border border-slate-700/50">
                <Phone className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300 text-xs font-medium">
                  {supplier.phone}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent mb-4" />

        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-center gap-2.5">
            <div className="flex flex-col">
              <span className="text-sm text-slate-200 font-medium line-clamp-3">
                {supplier.address || 'Alamat belum diisi'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Transaksi</span>
              <span className="text-sm text-center text-slate-200 font-medium">
                {supplier.transaction_details_count || 0} Transaksi
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Grid 3 Kolom */}
        <div className="mt-5 pt-4 border-t border-slate-700/40">
          <div className="grid grid-cols-2 gap-2">

            {/* Edit */}
            <button
              onClick={() => onEdit(supplier)}
              disabled={isMutating}
              className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[10px]">Edit</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(supplier)}
              disabled={isMutating}
              className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[10px]">Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SupplierCard;