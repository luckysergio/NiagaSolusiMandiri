import React, { useState, useEffect } from 'react';
import { X, Shield, Loader2 } from 'lucide-react';
import { useRoleManagement } from '../../hooks/useRoleManagement';
import Input from '../../common/Input';
import Button from '../../common/Button';

const RoleForm = ({ isOpen, onClose, onSuccess, editingRole }) => {
  const { handleCreateRole, handleUpdateRole, createRoleMutation, updateRoleMutation } =
    useRoleManagement();

  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
  });
  const [errors, setErrors] = useState({});

  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (editingRole) {
        setFormData({
          name: editingRole.name || '',
          display_name: editingRole.display_name || '',
        });
      } else {
        setFormData({
          name: '',
          display_name: '',
        });
      }
      setErrors({});
    }
  }, [editingRole, isOpen]);

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

    if (!formData.name) {
      newErrors.name = 'Nama role wajib diisi';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Nama role maksimal 50 karakter';
    } else if (!/^[a-z_]+$/.test(formData.name)) {
      newErrors.name = 'Nama role hanya boleh huruf kecil dan underscore';
    }

    if (!formData.display_name) {
      newErrors.display_name = 'Display name wajib diisi';
    } else if (formData.display_name.length > 100) {
      newErrors.display_name = 'Display name maksimal 100 karakter';
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
      if (!editingRole) {
        await handleCreateRole(formData);
      } else {
        await handleUpdateRole(editingRole.id, formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isPending, onClose]);

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
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 max-h-[90vh] flex flex-col animate-scaleIn relative">
        {/* ✅ Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <p className="text-white font-medium">
                {editingRole ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {editingRole ? 'Edit Role' : 'Tambah Role Baru'}
            </h3>
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          <Input
            label="Nama Role"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="contoh: super_admin"
            error={errors.name}
            disabled={isPending}
            required
            helperText={editingRole ? 'Nama role tidak dapat diubah' : 'Hanya huruf kecil dan underscore'}
          />

          <Input
            label="Display Name"
            name="display_name"
            type="text"
            value={formData.display_name}
            onChange={handleInputChange}
            placeholder="contoh: Super Admin"
            error={errors.display_name}
            disabled={isPending}
            required
            helperText="Nama yang ditampilkan di UI"
          />

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 shrink-0">
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
              icon={isPending ? Loader2 : Shield}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingRole ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingRole ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;