import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  X,
  Shield,
} from 'lucide-react';
import { useRoleManagement } from '../../hooks/useRoleManagement';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Pagination from '../../common/Pagination';
import EmptyState from '../../common/EmptyState';
import LoadingState from '../../common/LoadingState';
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
    per_page: 12,
    search: debouncedSearch,
  });

  const roles = rolesResponse?.data || [];
  const pagination = rolesResponse?.meta || {};

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

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingRole(null);
    await invalidateRoles();
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
    return <LoadingState message="Memuat data role..." icon={Shield} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card variant="glass" className="p-5 space-y-5">
        <Input
          icon={Search}
          placeholder="Cari role berdasarkan nama atau display name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
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

      {roles.length === 0 ? (
        <Card variant="glass" className="p-0 overflow-hidden">
          <EmptyState
            icon={Shield}
            title="Tidak ada role"
            description={
              hasActiveFilters
                ? 'Tidak ada role yang cocok dengan pencarian Anda. Coba ubah kata kunci atau reset filter.'
                : 'Belum ada role yang terdaftar. Klik tombol tambah di pojok kanan bawah untuk memulai.'
            }
            action={!hasActiveFilters && (
              <Button variant="primary" icon={Plus} onClick={openCreateForm}>
                Tambah Role Pertama
              </Button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 30}ms` }}
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

      <Pagination
        pagination={pagination}
        currentPage={page}
        onPageChange={setPage}
      />

      <button
        onClick={openCreateForm}
        className="fixed bottom-8 right-8 w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center z-50 group"
        title="Tambah Role"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

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