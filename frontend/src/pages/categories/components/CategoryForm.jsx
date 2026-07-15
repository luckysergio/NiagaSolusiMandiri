import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Info, Loader2 } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import Card from '../../../common/Card';

const CategoryForm = ({ isOpen, onClose, onSuccess, editingCategory }) => {
  const { 
    handleCreate, 
    handleUpdate, 
    createMutation, 
    updateMutation,
    useNextSortOrder,
  } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: suggestedSortOrder } = useNextSortOrder();

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name || '',
          slug: editingCategory.slug || '',
          description: editingCategory.description || '',
          sort_order: editingCategory.sort_order ?? 0,
          is_active: Boolean(editingCategory.is_active),
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          sort_order: suggestedSortOrder || 1,
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [editingCategory, isOpen, suggestedSortOrder]);

  useEffect(() => {
    if (!editingCategory && isOpen && suggestedSortOrder) {
      setFormData(prev => {
        if (prev.sort_order === 0) {
          return { ...prev, sort_order: suggestedSortOrder };
        }
        return prev;
      });
    }
  }, [isOpen, editingCategory, suggestedSortOrder]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let finalValue = value;
    if (name === 'is_active') {
      finalValue = value === 'true';
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Nama kategori wajib diisi';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nama kategori maksimal 100 karakter';
    }

    if (formData.slug && formData.slug.length > 120) {
      newErrors.slug = 'Slug maksimal 120 karakter';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Deskripsi maksimal 500 karakter';
    }

    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Sort order minimal 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        sort_order: parseInt(formData.sort_order, 10) || 0,
        is_active: formData.is_active ? '1' : '0',
      };

      if (!editingCategory) {
        await handleCreate(payload);
      } else {
        await handleUpdate(editingCategory.id, payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

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
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleIn relative overflow-hidden">
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-white font-medium">
                {editingCategory ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl">
              <FolderOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <p className="text-slate-400 text-sm">
                {editingCategory ? 'Perbarui detail kategori di bawah ini' : 'Isi formulir untuk menambahkan kategori baru'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Kategori"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Pompa Beton"
              error={errors.name}
              disabled={isPending}
              required
            />

            <Input
              label="Slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="pompa-beton"
              error={errors.slug}
              disabled={isPending}
              helperText="Kosongkan untuk generate otomatis"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isPending}
              rows={3}
              className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
              }`}
              placeholder="Deskripsi singkat tentang kategori ini"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Sort Order
              </label>
              <input
                name="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={handleInputChange}
                disabled={isPending}
                min={0}
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.sort_order ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                }`}
                placeholder="0"
              />
              {errors.sort_order ? (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.sort_order}
                </p>
              ) : !editingCategory && (
                <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Auto-filled
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Status
              </label>
              <select
                name="is_active"
                value={formData.is_active ? 'true' : 'false'}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

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
              icon={isPending ? Loader2 : FolderOpen}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingCategory ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingCategory ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CategoryForm;