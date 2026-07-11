// src/pages/admin/RoleManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Shield,
} from 'lucide-react';
import { useRoleManagement } from '../../hooks/useRoleManagement';
import Card from '../../common/Card';
import RoleCard from './RoleCard';
import RoleForm from './RoleForm';

const RoleManagement = () => {
  const {
    useRoles,
    handleDelete,
    isMutating,
    invalidateRoles,
  } = useRoleManagement();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: rolesResponse, isLoading, refetch, isFetching } = useRoles(page, {
    search: debouncedSearch,
  });

  const roles = rolesResponse?.data?.data || [];
  const pagination = rolesResponse?.data?.meta || rolesResponse?.data || {};

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '';
  }, [searchTerm]);

  const openCreateForm = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  const openEditForm = (role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  // PERBAIKAN: Pastikan invalidate dan refetch berjalan berurutan
  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingRole(null);
    
    // Invalidate backend cache + frontend cache
    await invalidateRoles();
    
    // Force refetch current query
    await refetch();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handleRefresh = async () => {
    await invalidateRoles();
    await refetch();
  };

  if (isLoading && !rolesResponse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full animate-spin border-t-purple-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-slate-400 animate-pulse">Memuat data role...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Search & Filters */}
      <Card variant="glass" padding="md">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari role berdasarkan nama atau display name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
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

          {/* Actions Row */}
          <div className="flex flex-wrap items-center gap-3">
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

            {/* Stats */}
            <div className="ml-auto text-sm text-slate-400">
              <span className="font-semibold text-purple-400">{pagination.total || 0}</span> role ditemukan
            </div>
          </div>
        </div>
      </Card>

      {/* Roles Grid */}
      {roles.length === 0 ? (
        <Card variant="glass" padding="lg">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tidak ada role</h3>
            <p className="text-slate-400 text-sm">
              {hasActiveFilters
                ? 'Tidak ada role yang cocok dengan pencarian Anda'
                : 'Belum ada role yang terdaftar'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 animate-fadeIn">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="animate-slideUp"
              style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            >
              <RoleCard
                role={role}
                onEdit={openEditForm}
                onDelete={handleDelete}
                isMutating={isMutating}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <Card variant="glass" padding="sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Menampilkan <span className="font-semibold text-white">{pagination.from || 0}</span> -{' '}
              <span className="font-semibold text-white">{pagination.to || 0}</span> dari{' '}
              <span className="font-semibold text-purple-400">{pagination.total || 0}</span>
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
                <span className="text-sm font-semibold text-white">{pagination.current_page}</span>
                <span className="text-sm text-slate-400">/</span>
                <span className="text-sm text-slate-400">{pagination.last_page}</span>
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

      {/* Floating Action Button */}
      <button
        onClick={openCreateForm}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        title="Tambah Role"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Form Modal */}
      <RoleForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        editingRole={editingRole}
      />
    </div>
  );
};

export default RoleManagement;