// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Key,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Calendar,
  Clock,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const Profile = () => {
  const { user: authUser } = useAuth();
  const {
    useProfileData,
    handleUpdateProfile,
    handleChangePassword,
    invalidateProfile,
    isMutating,
    updateProfileMutation,
    changePasswordMutation,
  } = useProfile();

  const { data: profileData, isLoading, refetch, isFetching } = useProfileData();

  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Sync form with profile data
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [profileData]);

  const isProfilePending = updateProfileMutation.isPending;
  const isPasswordPending = changePasswordMutation.isPending;

  /*
  |--------------------------------------------------------------------------
  | Handlers
  |--------------------------------------------------------------------------
  */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!formData.name && !formData.email && !formData.password) {
      newErrors.form = 'Minimal satu field harus diisi';
    }

    if (formData.name && formData.name.length > 150) {
      newErrors.name = 'Nama maksimal 150 karakter';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Password lama wajib diisi';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'Password baru wajib diisi';
    } else if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Password baru minimal 6 karakter';
    }

    if (!passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password wajib diisi';
    } else if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Konfirmasi password tidak cocok';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      const payload = {};
      if (formData.name && formData.name !== profileData?.name) {
        payload.name = formData.name;
      }
      if (formData.email && formData.email !== profileData?.email) {
        payload.email = formData.email;
      }
      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      if (Object.keys(payload).length === 0) {
        setErrors({ form: 'Tidak ada perubahan yang disimpan' });
        return;
      }

      await handleUpdateProfile(payload);

      // Reset password fields after success
      setFormData((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      await handleChangePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      console.error('Change password error:', err);
    }
  };

  const handleRefresh = async () => {
    await invalidateProfile();
    await refetch();
  };

  const handleResetProfile = () => {
    setFormData({
      name: profileData?.name || '',
      email: profileData?.email || '',
      password: '',
      password_confirmation: '',
    });
    setErrors({});
  };

  const handleResetPassword = () => {
    setPasswordData({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    });
    setPasswordErrors({});
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Belum pernah';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleName = (role) => {
    if (!role) return '-';
    if (typeof role === 'string') return role;
    if (typeof role === 'object' && role.display_name) return role.display_name;
    if (typeof role === 'object' && role.name) return role.name;
    return '-';
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 animate-pulse">Memuat profile...</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Profile</h1>
          <p className="text-slate-400 mt-1 text-sm">Kelola informasi akun Anda</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Profile Info Card */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-indigo-500/30">
              {getInitials(profileData?.name)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-800" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{profileData?.name}</h2>
            <p className="text-slate-400 mt-1">{profileData?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300 font-medium">
                  {getRoleName(profileData?.role)}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-sm text-emerald-300 font-medium">
                  {profileData?.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {profileData?.created_at && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    Bergabung: {formatDate(profileData.created_at)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  Login terakhir: {formatDateTime(profileData?.last_login_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card variant="glass" padding="none">
        <div className="flex flex-wrap gap-2 p-4 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'password'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Ubah Password
          </button>
        </div>

        {/* Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile} className="p-6 space-y-4">
            {errors.form && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <Input
              label="Nama"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nama lengkap"
              error={errors.name}
              disabled={isProfilePending}
              icon={User}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@domain.com"
              error={errors.email}
              disabled={isProfilePending}
              icon={Mail}
            />

            <div className="pt-4 border-t border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                Ubah Password <span className="text-slate-500 text-xs">(opsional)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isProfilePending}
                      className={`w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${
                        errors.password ? 'border-red-500/50' : 'border-slate-600/50'
                      }`}
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="password_confirmation"
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      disabled={isProfilePending}
                      className={`w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${
                        errors.password_confirmation ? 'border-red-500/50' : 'border-slate-600/50'
                      }`}
                      placeholder="Konfirmasi password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-xs text-red-400">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <Button
                variant="secondary"
                type="button"
                onClick={handleResetProfile}
                disabled={isProfilePending}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={Save}
                disabled={isProfilePending}
              >
                {isProfilePending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        )}

        {/* Change Password Form */}
        {activeTab === 'password' && (
          <form onSubmit={handleSubmitPassword} className="p-6 space-y-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <p className="text-sm text-indigo-300">
                💡 Untuk keamanan, Anda harus memasukkan password lama sebelum mengganti password baru.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password Lama <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="current_password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={handlePasswordInputChange}
                  disabled={isPasswordPending}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${
                    passwordErrors.current_password ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  placeholder="Masukkan password lama"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.current_password && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password Baru <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={handlePasswordInputChange}
                  disabled={isPasswordPending}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${
                    passwordErrors.new_password ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.new_password && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.new_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Konfirmasi Password Baru <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="new_password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordInputChange}
                  disabled={isPasswordPending}
                  className={`w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${
                    passwordErrors.new_password_confirmation ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  placeholder="Konfirmasi password baru"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.new_password_confirmation && (
                <p className="mt-1 text-xs text-red-400">{passwordErrors.new_password_confirmation}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
              <Button
                variant="secondary"
                type="button"
                onClick={handleResetPassword}
                disabled={isPasswordPending}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={Lock}
                disabled={isPasswordPending}
              >
                {isPasswordPending ? 'Menyimpan...' : 'Ubah Password'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Profile;