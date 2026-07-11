// src/pages/admin/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';
import Input from '../../common/Input';
import Button from '../../common/Button';

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
          role_id: editingUser.role_id || '',
          name: editingUser.name,
          email: editingUser.email,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 max-h-[90vh] flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <UserPlus className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {editingUser ? 'Edit User' : 'Tambah User Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Role <span className="text-red-400">*</span>
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              disabled={isPending}
              className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 ${
                errors.role_id ? 'border-red-500/50' : 'border-slate-600/50'
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
              <p className="mt-1 text-xs text-red-400">{errors.role_id}</p>
            )}
          </div>

          <Input
            label="Nama"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nama lengkap"
            error={errors.name}
            disabled={isPending}
            required
          />

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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password {!editingUser && <span className="text-red-400">*</span>}
              {editingUser && (
                <span className="text-xs text-slate-400 ml-2">
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
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10 transition-all disabled:opacity-50 ${
                  errors.password ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
                placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Konfirmasi Password {!editingUser && <span className="text-red-400">*</span>}
              {editingUser && (
                <span className="text-xs text-slate-400 ml-2">
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
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10 transition-all disabled:opacity-50 ${
                  errors.password_confirmation ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
                placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Konfirmasi password'}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-xs text-red-400">{errors.password_confirmation}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 shrink-0">
            <Button variant="secondary" onClick={onClose} type="button" disabled={isPending}>
              Batal
            </Button>
            <Button variant="primary" type="submit" icon={UserPlus} disabled={isPending}>
              {isPending ? 'Menyimpan...' : editingUser ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;