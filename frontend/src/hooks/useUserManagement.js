import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user';
import { useModal } from '../contexts/ModalContext';

export const userKeys = {
  all: ['admin', 'users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  roles: () => ['admin', 'roles', 'dropdown'],
  statistics: () => [...userKeys.all, 'statistics'],
};

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess, showWarning } = useModal();

  const useUsers = (page = 1, filters = {}) => {
    return useQuery({
      queryKey: userKeys.list({ page, ...filters }),
      queryFn: async () => {
        const response = await userApi.getUsers({ page, ...filters });
        return response;
      },
      keepPreviousData: true,
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 5,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });
  };

  const useRoles = () => {
    return useQuery({
      queryKey: userKeys.roles(),
      queryFn: async () => {
        const response = await userApi.getRolesDropdown();
        return response.data || [];
      },
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
    });
  };

  const useStatistics = () => {
    return useQuery({
      queryKey: userKeys.statistics(),
      queryFn: async () => {
        const response = await userApi.getStatistics();
        return response.data || {};
      },
      staleTime: 1000 * 60,
    });
  };

  const useUser = (id) => {
    return useQuery({
      queryKey: userKeys.detail(id),
      queryFn: async () => {
        const response = await userApi.getUser(id);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.all,
      refetchType: 'all',
    });
  };

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.roles(),
      refetchType: 'all',
    });
  };

  const createUserMutation = useMutation({
    mutationFn: (data) => userApi.createUser(data),
    onSuccess: async () => {
      await invalidateUsers();
      showSuccess('Berhasil', 'User berhasil dibuat');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal membuat user';
      showError('Gagal', message);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: async (_, variables) => {
      await invalidateUsers();
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'User berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui user';
      showError('Gagal', message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: async () => {
      await invalidateUsers();
      showSuccess('Berhasil', 'User berhasil dihapus');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal menghapus user');
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (id) => userApi.activateUser(id),
    onSuccess: async (_, id) => {
      await invalidateUsers();
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'User berhasil diaktifkan');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal mengaktifkan user');
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (id) => userApi.deactivateUser(id),
    onSuccess: async (_, id) => {
      await invalidateUsers();
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'User berhasil dinonaktifkan');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal menonaktifkan user');
    },
  });

  const forceLogoutMutation = useMutation({
    mutationFn: (id) => userApi.forceLogout(id),
    onSuccess: async (_, id) => {
      await invalidateUsers();
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'User berhasil dipaksa logout');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal force logout user');
    },
  });

  const resetLockMutation = useMutation({
    mutationFn: (id) => userApi.resetLock(id),
    onSuccess: async (_, id) => {
      await invalidateUsers();
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
        refetchType: 'all',
      });
      showSuccess('Berhasil', 'Lock user berhasil direset');
    },
    onError: (error) => {
      showError('Gagal', error.response?.data?.message || 'Gagal reset lock user');
    },
  });

  const handleDelete = (user) => {
    showWarning(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus user "${user.name}"?`,
      () => {
        deleteUserMutation.mutate(user.id);
      }
    );
  };

  const handleToggleActive = (user) => {
    if (user.is_active) {
      deactivateUserMutation.mutate(user.id);
    } else {
      activateUserMutation.mutate(user.id);
    }
  };

  const handleForceLogout = (user) => {
    showWarning(
      'Konfirmasi Force Logout',
      `Apakah Anda yakin ingin memaksa logout user "${user.name}"?`,
      () => {
        forceLogoutMutation.mutate(user.id);
      }
    );
  };

  const handleResetLock = (user) => {
    resetLockMutation.mutate(user.id);
  };

  const handleCreateUser = async (data) => {
    return createUserMutation.mutateAsync(data);
  };

  const handleUpdateUser = async (id, data) => {
    return updateUserMutation.mutateAsync({ id, data });
  };

  const isMutating =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending ||
    activateUserMutation.isPending ||
    deactivateUserMutation.isPending ||
    forceLogoutMutation.isPending ||
    resetLockMutation.isPending;

  return {
    useUsers,
    useRoles,
    useStatistics,
    useUser,

    handleDelete,
    handleToggleActive,
    handleForceLogout,
    handleResetLock,
    handleCreateUser,
    handleUpdateUser,

    isMutating,
    invalidateUsers,
    invalidateRoles,

    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    activateUserMutation,
    deactivateUserMutation,
    forceLogoutMutation,
    resetLockMutation,
  };
};