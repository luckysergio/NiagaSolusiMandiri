import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Layers,
} from 'lucide-react';
import { useProductTypes } from '../../hooks/useProductTypes';
import { useCategories } from '../../hooks/useCategories';
import { useRealTimeProductTypes } from '../../hooks/useRealTimeProductTypes'; // ✅ IMPORT HOOK BARU
import Card from '../../common/Card';
import ProductTypeCard from './components/ProductTypeCard';
import ProductTypeForm from './components/ProductTypeForm';

const ProductTypesPage = () => {
  // ✅ AKTIFKAN LISTENER REAL-TIME
  useRealTimeProductTypes();

  const {
    useProductTypesList,
    handleDelete,
    handleToggleActive,
    isMutating,
    invalidateProductTypes,
  } = useProductTypes();

  const { useDropdown: useCategoriesDropdown } = useCategories();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    category_id: '',
    is_active: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingProductType, setEditingProductType] = useState(null);

  const { data: categories = [] } = useCategoriesDropdown();

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
    data: productTypesResponse,
    isLoading,
    refetch,
    isFetching,
  } = useProductTypesList(page, {
    search: debouncedSearch,
    ...filters,
  });

  const productTypes = productTypesResponse?.data?.data || [];
  const pagination = productTypesResponse?.data?.meta || {};

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      filters.category_id !== '' ||
      filters.is_active !== ''
    );
  }, [searchTerm, filters]);

  const openCreateForm = () => {
    setEditingProductType(null);
    setShowForm(true);
  };

  const openEditForm = (productType) => {
    setEditingProductType(productType);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingProductType(null);
    await invalidateProductTypes();
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({ category_id: '', is_active: '' });
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateProductTypes();
    await refetch();
  };

  if (isLoading && !productTypesResponse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 animate-pulse">Memuat data jenis produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      <Card variant="glass" padding="md">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari jenis produk berdasarkan nama atau deskripsi..."
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
              value={filters.category_id}
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-700/70"
            >
              <option value="">Semua Kategori</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-700/70"
            >
              <option value="">Semua Status</option>
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>

            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                title="Reset Filter"
              >
                <X className="w-4 h-4" />
                <span>Reset</span>
              </button>
            ) : (
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all flex items-center gap-2 text-sm text-slate-300 hover:text-white disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}

            <div className="ml-auto text-sm text-slate-400">
              <span className="font-semibold text-indigo-400">
                {pagination.total || 0}
              </span>{' '}
              jenis produk ditemukan
            </div>
          </div>
        </div>
      </Card>

      {productTypes.length === 0 ? (
        <Card variant="glass" padding="lg">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <Layers className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tidak ada jenis produk
            </h3>
            <p className="text-slate-400 text-sm">
              {hasActiveFilters
                ? 'Tidak ada jenis produk yang cocok dengan filter Anda'
                : 'Belum ada jenis produk yang terdaftar'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fadeIn">
          {productTypes.map((productType, index) => (
            <div
              key={productType.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductTypeCard
                productType={productType}
                onToggleActive={handleToggleActive}
                onEdit={openEditForm}
                onDelete={handleDelete}
                isMutating={isMutating}
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
                onClick={() =>
                  setPage((p) => Math.min(pagination.last_page, p + 1))
                }
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
        title="Tambah Jenis Produk"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showForm && (
        <ProductTypeForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProductType(null);
          }}
          onSuccess={handleFormSuccess}
          editingProductType={editingProductType}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductTypesPage;