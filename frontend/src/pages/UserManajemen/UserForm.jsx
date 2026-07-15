import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Card from '../../common/Card';

const UserForm = ({ isOpen, onClose, onSuccess, editingUser, roles = [] }) => {
  const { handleCreateUser, handleUpdateUser, createUserMutation, updateUserMutation } =
    useUserManagement();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    role_id: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  const isPending = createUserMutation.isPending || updateUserMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          role_id: String(editingUser.role_id || ''),
          name: editingUser.name || '',
          email: editingUser.email || '',
          password: '',
          password_confirmation: '',
        });
      } else {
        setFormData({
          role_id: '',
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
        });
      }
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [editingUser, isOpen]);

  // ✅ Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ✅ ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isPending, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.role_id) {
      newErrors.role_id = 'Role wajib dipilih';
    }
    if (!formData.name) {
      newErrors.name = 'Nama wajib diisi';
    }
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!editingUser && !formData.password) {
      newErrors.password = 'Password wajib diisi untuk user baru';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Password dan konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const payload = {
        role_id: formData.role_id,
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.password_confirmation = formData.password_confirmation;
      }

      if (!editingUser) {
        await handleCreateUser(payload);
      } else {
        await handleUpdateUser(editingUser.id, payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleIn relative overflow-hidden">
        {/* ✅ Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-white font-medium">
                {editingUser ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl">
              <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <p className="text-slate-400 text-sm">
                {editingUser ? 'Perbarui detail user di bawah ini' : 'Isi formulir untuk menambahkan user baru'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                disabled={isPending}
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.role_id ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                }`}
                required
              >
                <option value="">Pilih Role</option>
                {Array.isArray(roles) && roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.display_name}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.role_id}
                </p>
              )}
            </div>

            <Input
              label="Nama Lengkap"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              error={errors.name}
              disabled={isPending}
              required
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@domain.com"
            error={errors.email}
            disabled={isPending}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password {!editingUser && <span className="text-red-400">*</span>}
                {editingUser && (
                  <span className="text-xs text-slate-400 ml-2 font-normal">
                    (Kosongkan jika tidak diubah)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                  }`}
                  placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Konfirmasi Password {!editingUser && <span className="text-red-400">*</span>}
                {editingUser && (
                  <span className="text-xs text-slate-400 ml-2 font-normal">
                    (Kosongkan jika tidak diubah)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password_confirmation ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                  }`}
                  placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Konfirmasi password'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 shrink-0 mt-6">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              type="button" 
              disabled={isPending}
            >
              Batal
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              icon={isPending ? Loader2 : UserPlus}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingUser ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingUser ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;