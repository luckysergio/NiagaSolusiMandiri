import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from './useAuth';

export const profileKeys = {
  all: ['user', 'profile'],
  detail: () => [...profileKeys.all, 'detail'],
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useModal();
  const { setUser, user } = useAuth();

  const useProfileData = () => {
    return useQuery({
      queryKey: profileKeys.detail(),
      queryFn: async () => {
        const response = await profileApi.getProfile();
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    });
  };

  const invalidateProfile = async () => {
    await queryClient.invalidateQueries({
      queryKey: profileKeys.all,
      refetchType: 'all',
    });
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: async (response) => {
      await invalidateProfile();
      
      if (response.data && setUser) {
        setUser((prev) => ({
          ...prev,
          name: response.data.name,
          email: response.data.email,
        }));
      }
      
      showSuccess('Berhasil', 'Profile berhasil diperbarui');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal memperbarui profile';
      showError('Gagal', message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
    onSuccess: () => {
      showSuccess('Berhasil', 'Password berhasil diubah');
    },
    onError: (error) => {
      const message = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : error.response?.data?.message || 'Gagal mengubah password';
      showError('Gagal', message);
    },
  });

  const handleUpdateProfile = async (data) => {
    return updateProfileMutation.mutateAsync(data);
  };

  const handleChangePassword = async (data) => {
    return changePasswordMutation.mutateAsync(data);
  };

  const isMutating =
    updateProfileMutation.isPending || changePasswordMutation.isPending;

  return {
    useProfileData,
    handleUpdateProfile,
    handleChangePassword,
    invalidateProfile,
    isMutating,
    updateProfileMutation,
    changePasswordMutation,
  };
};