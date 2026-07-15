import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/product';
import { useModal } from '../contexts/ModalContext';

export const productKeys = {
  all: ['admin', 'products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
  dropdown: (params) => [...productKeys.all, 'dropdown', params],
  statistics: (params) => [...productKeys.all, 'statistics', params],
  nextSortOrder: (typeId) => [...productKeys.all, 'next-sort-order', typeId],
  generateCode: (typeId, name) => [...productKeys.all, 'generate-code', typeId, name],
};

export const useProducts = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useProductsList = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: productKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await productApi.getAll({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 60, 
      gcTime: 1000 * 60 * 5,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
  };

  const useProduct = (id) => {
    return useQuery({
      queryKey: productKeys.detail(id),
      queryFn: async () => {
        const response = await productApi.getById(id);
        return response.data;
      },
      enabled: !!id,
      staleTime: 1000 * 60,
    });
  };

  const useDropdown = (params = {}) => {
    return useQuery({
      queryKey: productKeys.dropdown(params),
      queryFn: async () => {
        const response = await productApi.getDropdown(params);
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = (params = {}) => {
    return useQuery({
      queryKey: productKeys.statistics(params),
      queryFn: async () => {
        const response = await productApi.getStatistics(params);
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const useNextSortOrder = (typeId = null) => {
    return useQuery({
      queryKey: productKeys.nextSortOrder(typeId),
      queryFn: async () => {
        const response = await productApi.getNextSortOrder(typeId);
        return response.data?.next_sort_order || 1;
      },
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    });
  };

  const useGenerateCode = (productTypeId = null, name = '', enabled = false) => {
    return useQuery({
      queryKey: productKeys.generateCode(productTypeId, name),
      queryFn: async () => {
        if (!productTypeId || !name) return '';
        const response = await productApi.generateCode(productTypeId, name);
        return response.data?.code || '';
      },
      enabled: enabled && !!productTypeId && !!name,
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });
  };

  const invalidateProducts = async () => {
    await queryClient.invalidateQueries({
      queryKey: productKeys.all,
      refetchType: 'all',
    });
  };

  const createMutation = useMutation({
    mutationFn: (data) => productApi.create(data),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Produk berhasil ditambahkan');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menambahkan produk';
      showError('Gagal', message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Produk berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui produk';
      showError('Gagal', message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.delete(id),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Produk berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors?.id?.[0]
        || error.response?.data?.message
        || 'Gagal menghapus produk';
      showError('Gagal', message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => productApi.toggleActive(id),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Status produk berhasil diubah');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengubah status');
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id) => productApi.toggleFeatured(id),
    onSuccess: async () => {
      showSuccess('Berhasil', 'Status featured berhasil diubah');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengubah featured');
    },
  });

  const handleDelete = (product) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus produk "${product.name}" (${product.code})?`,
      () => {
        deleteMutation.mutate(product.id);
      }
    );
  };

  const handleToggleActive = (product) => {
    toggleActiveMutation.mutate(product.id);
  };

  const handleToggleFeatured = (product) => {
    toggleFeaturedMutation.mutate(product.id);
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
    toggleActiveMutation.isPending ||
    toggleFeaturedMutation.isPending;

  return {
    useProductsList,
    useProduct,
    useDropdown,
    useStatistics,
    useNextSortOrder,
    useGenerateCode,

    handleDelete,
    handleToggleActive,
    handleToggleFeatured,
    handleCreate,
    handleUpdate,

    isMutating,
    invalidateProducts,

    createMutation,
    updateMutation,
    deleteMutation,
    toggleActiveMutation,
    toggleFeaturedMutation,
  };
};