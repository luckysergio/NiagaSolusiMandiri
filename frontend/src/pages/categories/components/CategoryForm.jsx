import React, { useState, useEffect } from 'react';
import { X, FolderOpen } from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';
import Input from '../../../common/Input';
import Button from '../../../common/Button';

const CategoryForm = ({ isOpen, onClose, onSuccess, editingCategory }) => {
  const { handleCreate, handleUpdate, createMutation, updateMutation } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name || '',
          slug: editingCategory.slug || '',
          description: editingCategory.description || '',
          sort_order: editingCategory.sort_order || 0,
          is_active: editingCategory.is_active ?? true,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          sort_order: 0,
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [editingCategory, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!validate()) {
      return;
    }

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        sort_order: parseInt(formData.sort_order) || 0,
        is_active: formData.is_active,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700/50 max-h-[90vh] flex flex-col animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
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
            placeholder="pompa-beton (kosongkan untuk auto-generate)"
            error={errors.slug}
            disabled={isPending}
            helperText="Kosongkan untuk generate otomatis dari nama"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isPending}
              rows={3}
              className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none disabled:opacity-50 ${
                errors.description ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="Deskripsi singkat tentang kategori ini"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sort Order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleInputChange}
              placeholder="0"
              error={errors.sort_order}
              disabled={isPending}
              min={0}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50"
              >
                <option value={true}>Aktif</option>
                <option value={false}>Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 shrink-0">
            <Button variant="secondary" onClick={onClose} type="button" disabled={isPending}>
              Batal
            </Button>
            <Button variant="primary" type="submit" icon={FolderOpen} disabled={isPending}>
              {isPending ? 'Menyimpan...' : editingCategory ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;