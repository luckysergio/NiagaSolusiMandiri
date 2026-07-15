import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  X,
  Truck,
} from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useRealTimeSuppliers } from '../../hooks/useRealTimeSuppliers';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import SupplierCard from './components/SupplierCard';
import SupplierForm from './components/SupplierForm';

const SuppliersPage = () => {
  useRealTimeSuppliers();

  const {
    useSuppliersList,
    handleDelete,
    handleToggleActive,
    isMutating,
    invalidateSuppliers,
  } = useSuppliers();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ is_active: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const {
    data: suppliersResponse,
    isLoading,
    refetch,
    isFetching,
  } = useSuppliersList(page, {
    per_page: 12, // ✅ Disamakan dengan halaman lain
    search: debouncedSearch,
    ...filters,
  });

  // ✅ FIX: Ambil data langsung dari response.data (karena backend sudah return items())
  const suppliers = suppliersResponse?.data || [];
  const pagination = suppliersResponse?.meta || {};

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || filters.is_active !== '';
  }, [searchTerm, filters]);

  const openCreateForm = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const openEditForm = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingSupplier(null);
    await invalidateSuppliers();
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({ is_active: '' });
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateSuppliers();
    await refetch();
  };

  if (isLoading && !suppliersResponse) {
    return <LoadingState message="Memuat data supplier..." icon={Truck} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari supplier berdasarkan nama, telepon, atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50"
            >
              <option value="">Semua Status</option>
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>

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
            </div>
          </div>
        </div>
      </Card>

      {suppliers.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={Truck}
            title="Tidak ada supplier"
            description={
              hasActiveFilters
                ? 'Tidak ada supplier yang cocok dengan filter Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada supplier yang terdaftar. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Supplier Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {suppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <SupplierCard
                supplier={supplier}
                onToggleActive={handleToggleActive}
                onEdit={openEditForm}
                onDelete={handleDelete}
                isMutating={isMutating}
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
        title="Tambah Supplier"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showForm && (
        <SupplierForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          onSuccess={handleFormSuccess}
          editingSupplier={editingSupplier}
        />
      )}
    </div>
  );
};

export default SuppliersPage;