import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  X,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useRealTimeTransactions } from '../../hooks/useRealTimeTransactions';
import { useModal } from '../../contexts/ModalContext';
import { transactionApi } from '../../api/transaction';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF.jsx';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import TransactionCard from './components/TransactionCard';
import TransactionForm from './components/TransactionForm';

const TransactionsPage = () => {
  useRealTimeTransactions();

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
    per_page: 12, // ✅ Disamakan dengan halaman lain
    search: debouncedSearch,
    ...filters,
  });

  // ✅ FIX: Ambil data langsung dari response.data (karena backend sudah return items())
  const transactions = transactionsResponse?.data || [];
  const pagination = transactionsResponse?.meta || {};

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
    return <LoadingState message="Memuat data transaksi..." icon={Receipt} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari transaksi berdasarkan invoice, pelanggan, atau proyek..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50"
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
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            <div className="flex items-center gap-2 ml-auto">
              {hasActiveFilters ? (
                <Button
                  variant="secondary"
                  size="md"
                  icon={X}
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon={RefreshCw}
                  iconClassName={isFetching ? 'animate-spin' : ''}
                  onClick={handleRefresh}
                  disabled={isFetching}
                >
                  Refresh
                </Button>
              )}
              
              <Button
                variant="success"
                size="md"
                icon={isExporting ? RefreshCw : FileSpreadsheet}
                iconClassName={isExporting ? 'animate-spin' : ''}
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                {isExporting ? 'Memproses...' : 'Export Excel'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {transactions.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={Receipt}
            title="Tidak ada transaksi"
            description={
              hasActiveFilters
                ? 'Tidak ada transaksi yang cocok dengan filter Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada transaksi yang tercatat. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Transaksi Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
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

      <Pagination
        pagination={pagination}
        currentPage={page}
        onPageChange={setPage}
      />

      <button
        onClick={openCreateForm}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 group"
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