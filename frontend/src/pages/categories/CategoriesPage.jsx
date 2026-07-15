import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  FolderOpen,
  X,
  RefreshCw,
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useRealTimeCategories } from '../../hooks/useRealTimeCategories';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
import CategoryCard from './components/CategoryCard';
import CategoryForm from './components/CategoryForm';

const CategoriesPage = () => {
  useRealTimeCategories();

  const {
    useCategoriesList,
    useStatistics,
    handleDelete,
    handleToggleActive,
    isMutating,
    invalidateCategories,
  } = useCategories();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    is_active: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

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
    data: categoriesResponse,
    isLoading,
    refetch,
    isFetching,
  } = useCategoriesList(page, {
    per_page: 12,
    search: debouncedSearch,
    ...filters,
  });

  const { data: statistics = {} } = useStatistics();

  const categories = categoriesResponse?.data || [];
  const pagination = categoriesResponse?.meta || {};

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || filters.is_active !== '';
  }, [searchTerm, filters]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingCategory(null);
    await invalidateCategories();
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({ is_active: '' });
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateCategories();
    await refetch();
  };

  if (isLoading && !categoriesResponse) {
    return <LoadingState message="Memuat data kategori..." icon={FolderOpen} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari kategori berdasarkan nama atau deskripsi..."
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

      {categories.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={FolderOpen}
            title="Tidak ada kategori"
            description={
              hasActiveFilters
                ? 'Tidak ada kategori yang cocok dengan filter Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada kategori yang terdaftar. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Kategori Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <CategoryCard
                category={category}
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
        title="Tambah Kategori"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showForm && (
        <CategoryForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          onSuccess={handleFormSuccess}
          editingCategory={editingCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;