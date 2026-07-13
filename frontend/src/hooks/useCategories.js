import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/category';
import { useModal } from '../contexts/ModalContext';

export const categoryKeys = {
  all: ['admin', 'categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), filters],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
  dropdown: () => [...categoryKeys.all, 'dropdown'],
  statistics: () => [...categoryKeys.all, 'statistics'],
  nextSortOrder: () => [...categoryKeys.all, 'next-sort-order'],
};

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useCategoriesList = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: categoryKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await categoryApi.getAll({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
  };

  const useCategory = (id) => {
    return useQuery({
      queryKey: categoryKeys.detail(id),
      queryFn: async () => {
        const response = await categoryApi.getById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60,
    });
  };

  const useDropdown = () => {
    return useQuery({
      queryKey: categoryKeys.dropdown(),
      queryFn: async () => {
        const response = await categoryApi.getDropdown();
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = () => {
    return useQuery({
      queryKey: categoryKeys.statistics(),
      queryFn: async () => {
        const response = await categoryApi.getStatistics();
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const useNextSortOrder = () => {
    return useQuery({
      queryKey: categoryKeys.nextSortOrder(),
      queryFn: async () => {
        const response = await categoryApi.getNextSortOrder();
        return response.data?.next_sort_order || 1;
      },
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const invalidateCategories = async () => {
    await queryClient.invalidateQueries({
      queryKey: categoryKeys.all,
      refetchType: 'all',
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: async () => {
      await invalidateCategories();
      showSuccess('Berhasil', 'Kategori berhasil ditambahkan');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menambahkan kategori';
      showError('Gagal', message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: async (_, variables) => {
      await invalidateCategories();
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Kategori berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui kategori';
      showError('Gagal', message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: async () => {
      await invalidateCategories();
      showSuccess('Berhasil', 'Kategori berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.id?.[0] 
        || error.response?.data?.message 
        || 'Gagal menghapus kategori';
      showError('Gagal', message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => categoryApi.toggleActive(id),
    onSuccess: async (_, id) => {
      await invalidateCategories();
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Status kategori berhasil diubah');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengubah status');
    },
  });

  const handleDelete = (category) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
      () => {
        deleteMutation.mutate(category.id);
      }
    );
  };

  const handleToggleActive = (category) => {
    toggleActiveMutation.mutate(category.id);
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
    useCategoriesList,
    useCategory,
    useDropdown,
    useStatistics,
    useNextSortOrder,

    handleDelete,
    handleToggleActive,
    handleCreate,
    handleUpdate,

    isMutating,
    invalidateCategories,

    createMutation,
    updateMutation,
    deleteMutation,
    toggleActiveMutation,
  };
};