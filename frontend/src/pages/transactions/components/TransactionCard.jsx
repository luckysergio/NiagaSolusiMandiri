import React from 'react';
import {
  Receipt,
  User,
  Building2,
  Hash,
  Check,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import Card from '../../../common/Card';
import { formatRupiah } from '../../../utils/currency';

const TransactionCard = ({ 
  transaction, 
  onChangeStatus,
  onEdit, 
  onDelete,
  onPrintInvoice, // ✅ Tambahkan prop ini dari parent
  isMutating 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      dipesan: {
        label: 'Dipesan',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        nextStatus: 'dikerjakan',
        nextLabel: 'Kerjakan',
      },
      dikerjakan: {
        label: 'Dikerjakan',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        nextStatus: 'selesai',
        nextLabel: 'Selesaikan',
      },
      selesai: {
        label: 'Selesai',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        nextStatus: null,
        nextLabel: null,
      },
    };
    return configs[status?.value || status] || configs.dipesan;
  };

  const statusConfig = getStatusConfig(transaction.status);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        
        {/* 1. Text Invoice sebaris dengan justify-center */}
        <div className="flex justify-center mb-1">
          <h3 className="text-white font-semibold text-sm sm:text-base wrap-break-word leading-snug group-hover:text-amber-300 transition-colors text-center">
            {transaction.invoice}
          </h3>
        </div>

        {/* 2. Status dan tanggal sebaris dengan justify-between */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(transaction.transaction_date)}</span>
          </div>
          <div className={`px-2 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
        </div>

        {/* 3. Tombol Cetak Invoice tepat dibawah status dan tanggal */}
        <button
          onClick={() => onPrintInvoice(transaction)}
          disabled={isMutating}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          title="Cetak Invoice"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Cetak Invoice</span>
        </button>

        {/* Details */}
        <div className="space-y-2 pt-2 border-t border-slate-700/50">
          {/* Customer */}
          <div className="flex items-start gap-2">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {transaction.customer_name}
            </span>
          </div>

          {/* Project */}
          {transaction.project_name && (
            <div className="flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-300 line-clamp-1">
                {transaction.project_name}
              </span>
            </div>
          )}

          {/* Items Count */}
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400">
              <span className="font-semibold text-white">
                {transaction.details_count || 0}
              </span>{' '}
              item
            </span>
          </div>

          {/* Financial Summary */}
          <div className="space-y-1 pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total:</span>
              <span className="font-semibold text-emerald-400">
                {formatRupiah(transaction.total_transaction)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pengeluaran:</span>
              <span className="font-semibold text-red-400">
                {formatRupiah(transaction.total_expense)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 mt-auto border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            {statusConfig.nextStatus && (
              <button
                onClick={() => onChangeStatus(transaction, statusConfig.nextStatus)}
                disabled={isMutating}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={statusConfig.nextLabel}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{statusConfig.nextLabel}</span>
              </button>
            )}

            <button
              onClick={() => onEdit(transaction)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => onDelete(transaction)}
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

export default TransactionCard;