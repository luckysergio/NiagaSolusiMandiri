import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Layers,
  X,
  RefreshCw,
} from 'lucide-react';
import { useProductTypes } from '../../hooks/useProductTypes';
import { useCategories } from '../../hooks/useCategories';
import { useRealTimeProductTypes } from '../../hooks/useRealTimeProductTypes';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import ProductTypeCard from './components/ProductTypeCard';
import ProductTypeForm from './components/ProductTypeForm';

const ProductTypesPage = () => {
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
    per_page: 12,
    search: debouncedSearch,
    ...filters,
  });

  const productTypes = productTypesResponse?.data || [];
  const pagination = productTypesResponse?.meta || {};

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
    return <LoadingState message="Memuat data jenis produk..." icon={Layers} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari jenis produk berdasarkan nama atau deskripsi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <select
              value={filters.category_id}
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
              className="flex-1 min-w-40 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50"
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

      {productTypes.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={Layers}
            title="Tidak ada jenis produk"
            description={
              hasActiveFilters
                ? 'Tidak ada jenis produk yang cocok dengan filter Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada jenis produk yang terdaftar. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Jenis Produk Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {productTypes.map((productType, index) => (
            <div
              key={productType.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
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

      <Pagination
        pagination={pagination}
        currentPage={page}
        onPageChange={setPage}
      />

      <button
        onClick={openCreateForm}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 group"
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