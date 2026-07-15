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
  onPrintInvoice,
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
    <Card className="group relative overflow-hidden h-full flex flex-col border border-slate-700/50 bg-slate-800/40 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
      {/* ✅ FIX: bg-gradient-to-br */}
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex-1 flex flex-col p-4 sm:p-5">
        
        {/* 1. Text Invoice sebaris dengan justify-center */}
        <div className="flex justify-center mb-3">
          <h3 className="text-white font-bold text-base sm:text-lg wrap-break-word leading-snug group-hover:text-amber-300 transition-colors text-center line-clamp-2">
            {transaction.invoice}
          </h3>
        </div>

        {/* 2. Status dan tanggal sebaris dengan justify-between */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(transaction.transaction_date)}</span>
          </div>
          <div className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
        </div>

        {/* 3. Tombol Cetak Invoice tepat dibawah status dan tanggal */}
        <button
          onClick={() => onPrintInvoice(transaction)}
          disabled={isMutating}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 active:scale-95"
          title="Cetak Invoice"
        >
          <Receipt className="w-4 h-4" />
          <span>Cetak Invoice</span>
        </button>

        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent mb-4" />

        {/* Details */}
        <div className="space-y-3 flex-1">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-blue-500/10 rounded-lg shrink-0 mt-0.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pelanggan</span>
              <span className="text-sm text-slate-200 font-medium line-clamp-2">
                {transaction.customer_name}
              </span>
            </div>
          </div>

          {transaction.project_name && (
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg shrink-0 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Proyek</span>
                <span className="text-sm text-slate-200 font-medium line-clamp-1">
                  {transaction.project_name}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-500/10 rounded-lg">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Item</span>
              <span className="text-sm text-slate-200 font-medium">
                {transaction.details_count || 0} Item
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/40 border border-slate-700/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Transaksi:</span>
              <span className="font-bold text-emerald-400">
                {formatRupiah(transaction.total_transaction)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pengeluaran:</span>
              <span className="font-bold text-red-400">
                {formatRupiah(transaction.total_expense)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Grid 3 Kolom */}
        <div className="mt-5 pt-4 border-t border-slate-700/40">
          <div className="grid grid-cols-3 gap-2">
            {statusConfig.nextStatus ? (
              <button
                onClick={() => onChangeStatus(transaction, statusConfig.nextStatus)}
                disabled={isMutating}
                className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-[10px] font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title={statusConfig.nextLabel}
              >
                <Check className="w-4 h-4" />
                <span>{statusConfig.nextLabel}</span>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-[10px] font-semibold bg-slate-700/30 text-slate-500 border border-slate-600/30">
                <Check className="w-4 h-4" />
                <span>Selesai</span>
              </div>
            )}

            <button
              onClick={() => onEdit(transaction)}
              disabled={isMutating}
              className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-[10px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(transaction)}
              disabled={isMutating}
              className="flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;