import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Package,
  Filter,
  X,
  RefreshCw,
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useProductTypes } from '../../hooks/useProductTypes';
import { useRealTimeProducts } from '../../hooks/useRealTimeProducts';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';

const ProductsPage = () => {
  useRealTimeProducts();

  const {
    useProductsList,
    handleDelete,
    handleToggleActive,
    handleToggleFeatured,
    isMutating,
    invalidateProducts,
  } = useProducts();

  const { useDropdown: useCategoriesDropdown } = useCategories();
  const { useDropdown: useProductTypesDropdown } = useProductTypes();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    category_id: '',
    product_type_id: '',
    is_active: '',
    featured: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: categories = [] } = useCategoriesDropdown();

  const { data: productTypes = [] } = useProductTypesDropdown(
    filters.category_id ? parseInt(filters.category_id) : null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      product_type_id: '',
    }));
  }, [filters.category_id]);

  useEffect(() => {
    setPage(1);
  }, [filters.product_type_id, filters.is_active, filters.featured]);

  const {
    data: productsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useProductsList(page, {
    per_page: 12,
    search: debouncedSearch,
    ...filters,
  });

  const products = productsResponse?.data || [];
  const pagination = productsResponse?.meta || {};

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      filters.category_id !== '' ||
      filters.product_type_id !== '' ||
      filters.is_active !== '' ||
      filters.featured !== ''
    );
  }, [searchTerm, filters]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingProduct(null);
    await invalidateProducts();
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({
      category_id: '',
      product_type_id: '',
      is_active: '',
      featured: '',
    });
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateProducts();
    await refetch();
  };

  if (isLoading && !productsResponse) {
    return <LoadingState message="Memuat data produk..." icon={Package} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari produk berdasarkan nama, kode, atau deskripsi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 mr-2 xl:flex">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
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
              value={filters.product_type_id}
              onChange={(e) => setFilters({ ...filters, product_type_id: e.target.value })}
              disabled={!filters.category_id}
              className="flex-1 min-w-40 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Semua Jenis</option>
              {Array.isArray(productTypes) &&
                productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
            </select>

            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50"
            >
              <option value="">Status Featured</option>
              <option value="1">Featured</option>
              <option value="0">Non-Featured</option>
            </select>

            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="flex-1 min-w-35 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-800/50"
            >
              <option value="">Status Aktif</option>
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

      {products.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={Package}
            title="Tidak ada produk"
            description={
              hasActiveFilters
                ? 'Tidak ada produk yang cocok dengan filter Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada produk yang terdaftar. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Produk Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <ProductCard
                product={product}
                onToggleActive={handleToggleActive}
                onToggleFeatured={handleToggleFeatured}
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
        title="Tambah Produk"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showForm && (
        <ProductForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={handleFormSuccess}
          editingProduct={editingProduct}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductsPage;