import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useModal } from '../../contexts/ModalContext';
import { transactionApi } from '../../api/transaction';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF.jsx';
import Card from '../../common/Card';
import TransactionCard from './components/TransactionCard';
import TransactionForm from './components/TransactionForm';

const TransactionsPage = () => {
  const {
    useTransactionsList,
    useTransaction,
    handleDelete,
    handleChangeStatus,
    isMutating,
    invalidateTransactions,
  } = useTransactions();

  const { showSuccess, showError, showLoading, closeLoading } = useModal();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: fullEditingTransaction } = useTransaction(editingTransactionId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.start_date, filters.end_date]);

  const {
    data: transactionsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useTransactionsList(page, {
    search: debouncedSearch,
    ...filters,
  });

  const transactions = transactionsResponse?.data?.data || [];
  const pagination = transactionsResponse?.data?.meta || {};

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      filters.status !== '' ||
      filters.start_date !== '' ||
      filters.end_date !== ''
    );
  }, [searchTerm, filters]);

  const openCreateForm = () => {
    setEditingTransactionId(null);
    setShowForm(true);
  };

  const openEditForm = (transaction) => {
    setEditingTransactionId(transaction.id);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingTransactionId(null);
    await invalidateTransactions();
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({ status: '', start_date: '', end_date: '' });
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateTransactions();
    await refetch();
  };

  const handlePrintInvoice = async (transaction) => {
    try {
      setIsPrinting(true);
      showLoading('Mempersiapkan Invoice...', 'Mohon tunggu sebentar');
      
      const response = await transactionApi.getById(transaction.id);
      const fullTransaction = response.data;
      
      await generateInvoicePDF(fullTransaction);
      
      closeLoading();
      showSuccess('Berhasil', 'Invoice berhasil dibuka untuk direview');
    } catch (error) {
      closeLoading();
      showError('Gagal', 'Gagal mencetak invoice. Silakan coba lagi.');
      console.error('Print invoice error:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      showLoading('Mempersiapkan Laporan...', 'Mohon tunggu sebentar');
      
      const params = {
        search: debouncedSearch,
        ...filters,
      };

      let filename = 'Laporan_Transaksi';
      if (filters.start_date && filters.end_date) {
        filename += `_dari_${filters.start_date}_sampai_${filters.end_date}`;
      } else {
        filename += '_Semua_Periode';
      }
      filename += '.xlsx';

      const response = await transactionApi.exportExcel(params);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      closeLoading();
      showSuccess('Berhasil', `File ${filename} berhasil diunduh`);
    } catch (error) {
      closeLoading();
      showError('Gagal', 'Gagal mengunduh laporan. Silakan coba lagi.');
      console.error('Export excel error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && !transactionsResponse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 animate-pulse">Memuat data transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Filters */}
      <Card variant="glass" padding="md">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan invoice, pelanggan, atau proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-700/70"
            >
              <option value="">Semua Status</option>
              <option value="dipesan">Dipesan</option>
              <option value="dikerjakan">Dikerjakan</option>
              <option value="selesai">Selesai</option>
            </select>

            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all flex items-center gap-2 text-sm text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
            ) : (
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all flex items-center gap-2 text-sm text-slate-300 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}

            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl transition-all flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export ke Excel"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Memproses...' : 'Export Excel'}</span>
            </button>
          </div>
        </div>
      </Card>

      {transactions.length === 0 ? (
        <Card variant="glass" padding="lg">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tidak ada transaksi
            </h3>
            <p className="text-slate-400 text-sm">
              {hasActiveFilters
                ? 'Tidak ada transaksi yang cocok dengan filter Anda'
                : 'Belum ada transaksi yang tercatat'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fadeIn">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TransactionCard
                transaction={transaction}
                onChangeStatus={handleChangeStatus}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onPrintInvoice={handlePrintInvoice}
                isMutating={isMutating}
                isPrinting={isPrinting}
              />
            </div>
          ))}
        </div>
      )}

      {pagination.last_page > 1 && (
        <Card variant="glass" padding="sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Menampilkan{' '}
              <span className="font-semibold text-white">
                {pagination.from || 0}
              </span>{' '}
              -{' '}
              <span className="font-semibold text-white">
                {pagination.to || 0}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-indigo-400">
                {pagination.total || 0}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.current_page === 1}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
                <span className="text-sm font-semibold text-white">
                  {pagination.current_page}
                </span>
                <span className="text-sm text-slate-400">/</span>
                <span className="text-sm text-slate-400">
                  {pagination.last_page}
                </span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                disabled={pagination.current_page === pagination.last_page}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <button
        onClick={openCreateForm}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        title="Tambah Transaksi"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showForm && (
        <TransactionForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingTransactionId(null);
          }}
          onSuccess={handleFormSuccess}
          editingTransaction={fullEditingTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;