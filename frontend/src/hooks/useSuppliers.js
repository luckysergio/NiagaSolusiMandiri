import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '../api/supplier';
import { useModal } from '../contexts/ModalContext';

export const supplierKeys = {
  all: ['admin', 'suppliers'],
  lists: () => [...supplierKeys.all, 'list'],
  list: (filters) => [...supplierKeys.lists(), filters],
  details: () => [...supplierKeys.all, 'detail'],
  detail: (id) => [...supplierKeys.details(), id],
  dropdown: () => [...supplierKeys.all, 'dropdown'],
  statistics: () => [...supplierKeys.all, 'statistics'],
};

export const useSuppliers = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useSuppliersList = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: supplierKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await supplierApi.getAll({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
  };

  const useSupplier = (id) => {
    return useQuery({
      queryKey: supplierKeys.detail(id),
      queryFn: async () => {
        const response = await supplierApi.getById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60,
    });
  };

  const useDropdown = () => {
    return useQuery({
      queryKey: supplierKeys.dropdown(),
      queryFn: async () => {
        const response = await supplierApi.getDropdown();
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = () => {
    return useQuery({
      queryKey: supplierKeys.statistics(),
      queryFn: async () => {
        const response = await supplierApi.getStatistics();
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const invalidateSuppliers = async () => {
    await queryClient.invalidateQueries({
      queryKey: supplierKeys.all,
      refetchType: 'all',
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => supplierApi.create(data),
    onSuccess: async () => {
      await invalidateSuppliers();
      showSuccess('Berhasil', 'Supplier berhasil ditambahkan');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menambahkan supplier';
      showError('Gagal', message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => supplierApi.update(id, data),
    onSuccess: async (_, variables) => {
      await invalidateSuppliers();
      await queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(variables.id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Supplier berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui supplier';
      showError('Gagal', message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => supplierApi.delete(id),
    onSuccess: async () => {
      await invalidateSuppliers();
      showSuccess('Berhasil', 'Supplier berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.id?.[0]
        || error.response?.data?.message
        || 'Gagal menghapus supplier';
      showError('Gagal', message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => supplierApi.toggleActive(id),
    onSuccess: async (_, id) => {
      await invalidateSuppliers();
      await queryClient.invalidateQueries({
        queryKey: supplierKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Status supplier berhasil diubah');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengubah status');
    },
  });

  const handleDelete = (supplier) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus supplier "${supplier.name}"?`,
      () => {
        deleteMutation.mutate(supplier.id);
      }
    );
  };

  const handleToggleActive = (supplier) => {
    toggleActiveMutation.mutate(supplier.id);
  };

  const handleCreate = async (data) => {
    return createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id, data) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    toggleActiveMutation.isPending;

  return {
    useSuppliersList,
    useSupplier,
    useDropdown,
    useStatistics,

    handleDelete,
    handleToggleActive,
    handleCreate,
    handleUpdate,

    isMutating,
    invalidateSuppliers,

    createMutation,
    updateMutation,
    deleteMutation,
    toggleActiveMutation,
  };
};