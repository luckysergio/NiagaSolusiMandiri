import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productTypeApi } from '../api/productType';
import { useModal } from '../contexts/ModalContext';

export const productTypeKeys = {
  all: ['admin', 'product-types'],
  lists: () => [...productTypeKeys.all, 'list'],
  list: (filters) => [...productTypeKeys.lists(), filters],
  details: () => [...productTypeKeys.all, 'detail'],
  detail: (id) => [...productTypeKeys.details(), id],
  dropdown: (categoryId) => [...productTypeKeys.all, 'dropdown', categoryId],
  statistics: (categoryId) => [...productTypeKeys.all, 'statistics', categoryId],
  nextSortOrder: (categoryId) => [...productTypeKeys.all, 'next-sort-order', categoryId],
};

export const useProductTypes = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useProductTypesList = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: productTypeKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await productTypeApi.getAll({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
  };

  const useProductType = (id) => {
    return useQuery({
      queryKey: productTypeKeys.detail(id),
      queryFn: async () => {
        const response = await productTypeApi.getById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60,
    });
  };

  const useDropdown = (categoryId = null) => {
    return useQuery({
      queryKey: productTypeKeys.dropdown(categoryId),
      queryFn: async () => {
        const response = await productTypeApi.getDropdown(categoryId);
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = (categoryId = null) => {
    return useQuery({
      queryKey: productTypeKeys.statistics(categoryId),
      queryFn: async () => {
        const response = await productTypeApi.getStatistics(categoryId);
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const useNextSortOrder = (categoryId = null) => {
    return useQuery({
      queryKey: productTypeKeys.nextSortOrder(categoryId),
      queryFn: async () => {
        const response = await productTypeApi.getNextSortOrder(categoryId);
        return response.data?.next_sort_order || 1;
      },
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const invalidateProductTypes = async () => {
    await queryClient.invalidateQueries({
      queryKey: productTypeKeys.all,
      refetchType: 'all',
    });
  };

  const createMutation = useMutation({
    mutationFn: (formData) => productTypeApi.create(formData),
    onSuccess: async () => {
      await invalidateProductTypes();
      showSuccess('Berhasil', 'Jenis produk berhasil ditambahkan');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menambahkan jenis produk';
      showError('Gagal', message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => productTypeApi.update(id, formData),
    onSuccess: async (_, variables) => {
      await invalidateProductTypes();
      await queryClient.invalidateQueries({
        queryKey: productTypeKeys.detail(variables.id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Jenis produk berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui jenis produk';
      showError('Gagal', message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productTypeApi.delete(id),
    onSuccess: async () => {
      await invalidateProductTypes();
      showSuccess('Berhasil', 'Jenis produk berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.id?.[0] 
        || error.response?.data?.message 
        || 'Gagal menghapus jenis produk';
      showError('Gagal', message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => productTypeApi.toggleActive(id),
    onSuccess: async (_, id) => {
      await invalidateProductTypes();
      await queryClient.invalidateQueries({
        queryKey: productTypeKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Status jenis produk berhasil diubah');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengubah status');
    },
  });

  const handleDelete = (productType) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus jenis produk "${productType.name}"?`,
      () => {
        deleteMutation.mutate(productType.id);
      }
    );
  };

  const handleToggleActive = (productType) => {
    toggleActiveMutation.mutate(productType.id);
  };

  const handleCreate = async (formData) => {
    return createMutation.mutateAsync(formData);
  };

  const handleUpdate = async (id, formData) => {
    return updateMutation.mutateAsync({ id, formData });
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    toggleActiveMutation.isPending;

  return {
    useProductTypesList,
    useProductType,
    useDropdown,
    useStatistics,
    useNextSortOrder,

    handleDelete,
    handleToggleActive,
    handleCreate,
    handleUpdate,

    isMutating,
    invalidateProductTypes,

    createMutation,
    updateMutation,
    deleteMutation,
    toggleActiveMutation,
  };
};