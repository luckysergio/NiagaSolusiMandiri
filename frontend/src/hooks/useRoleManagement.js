import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '../api/role';
import { useModal } from '../contexts/ModalContext';

export const roleKeys = {
  all: ['admin', 'roles'],
  lists: () => [...roleKeys.all, 'list'],
  list: (filters) => [...roleKeys.lists(), filters],
  details: () => [...roleKeys.all, 'detail'],
  detail: (id) => [...roleKeys.details(), id],
  dropdown: () => ['admin', 'roles', 'dropdown'],
  statistics: () => [...roleKeys.all, 'statistics'],
};

export const useRoleManagement = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useRoles = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: roleKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await roleApi.getRoles({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });
  };

  const useRoleDropdown = () => {
    return useQuery({
      queryKey: roleKeys.dropdown(),
      queryFn: async () => {
        const response = await roleApi.getRolesDropdown();
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = () => {
    return useQuery({
      queryKey: roleKeys.statistics(),
      queryFn: async () => {
        const response = await roleApi.getStatistics();
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const useRole = (id) => {
    return useQuery({
      queryKey: roleKeys.detail(id),
      queryFn: async () => {
        const response = await roleApi.getRole(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries({
      queryKey: roleKeys.all,
      refetchType: 'all',
    });
  };

  const createRoleMutation = useMutation({
    mutationFn: (data) => roleApi.createRole(data),
    onSuccess: async () => {
      await invalidateRoles();
      showSuccess('Berhasil', 'Role berhasil dibuat');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal membuat role';
      showError('Gagal', message);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }) => roleApi.updateRole(id, data),
    onSuccess: async (_, variables) => {
      await invalidateRoles();
      await queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Role berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui role';
      showError('Gagal', message);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id) => roleApi.deleteRole(id),
    onSuccess: async () => {
      await invalidateRoles();
      showSuccess('Berhasil', 'Role berhasil dihapus');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal menghapus role';
      showError('Gagal', message);
    },
  });

  const handleDelete = (role) => {
    if (role.users_count > 0) {
      showError(
        'Tidak Dapat Dihapus',
        `Role "${role.display_name}" masih digunakan oleh ${role.users_count} user.`
      );
      return;
    }

    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus role "${role.display_name}"?`,
      () => {
        deleteRoleMutation.mutate(role.id);
      }
    );
  };

  const handleCreateRole = async (data) => {
    return createRoleMutation.mutateAsync(data);
  };

  const handleUpdateRole = async (id, data) => {
    return updateRoleMutation.mutateAsync({ id, data });
  };

  const isMutating =
    createRoleMutation.isPending ||
    updateRoleMutation.isPending ||
    deleteRoleMutation.isPending;

  return {
    useRoles,
    useRoleDropdown,
    useStatistics,
    useRole,

    handleDelete,
    handleCreateRole,
    handleUpdateRole,

    isMutating,
    invalidateRoles,

    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
  };
};