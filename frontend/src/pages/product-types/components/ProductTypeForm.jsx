import React, { useState, useEffect } from 'react';
import { X, Layers, Info, Upload, Loader2 } from 'lucide-react';
import { useProductTypes } from '../../../hooks/useProductTypes';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import Card from '../../../common/Card';

const ProductTypeForm = ({ isOpen, onClose, onSuccess, editingProductType, categories = [] }) => {
  const { 
    handleCreate, 
    handleUpdate, 
    createMutation, 
    updateMutation,
    useNextSortOrder,
  } = useProductTypes();

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const isPending = createMutation.isPending || updateMutation.isPending;

  const categoryId = formData.category_id ? parseInt(formData.category_id, 10) : null;
  const { data: suggestedSortOrder } = useNextSortOrder(categoryId);

  useEffect(() => {
    if (isOpen) {
      if (editingProductType) {
        setFormData({
          category_id: String(editingProductType.category_id || ''),
          name: editingProductType.name || '',
          slug: editingProductType.slug || '',
          description: editingProductType.description || '',
          sort_order: editingProductType.sort_order ?? 0,
          is_active: Boolean(editingProductType.is_active),
        });
        setImagePreview(editingProductType.image_url || editingProductType.image || null);
      } else {
        setFormData({
          category_id: '',
          name: '',
          slug: '',
          description: '',
          sort_order: 1,
          is_active: true,
        });
        setImagePreview(null);
      }
      setImageFile(null);
      setErrors({});
    }
  }, [editingProductType, isOpen]);

  useEffect(() => {
    if (!editingProductType && isOpen && suggestedSortOrder) {
      setFormData(prev => ({
        ...prev,
        sort_order: suggestedSortOrder,
      }));
    }
  }, [suggestedSortOrder, editingProductType, isOpen]);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
      setErrors(prev => ({ ...prev, image: 'Format gambar harus JPG, JPEG, PNG, atau WebP' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Ukuran gambar maksimal 2MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: null }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori wajib dipilih';
    }

    if (!formData.name) {
      newErrors.name = 'Nama jenis produk wajib diisi';
    } else if (formData.name.length > 120) {
      newErrors.name = 'Nama jenis produk maksimal 120 karakter';
    }

    if (formData.slug && formData.slug.length > 150) {
      newErrors.slug = 'Slug maksimal 150 karakter';
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
      const payload = new FormData();
      
      payload.append('category_id', parseInt(formData.category_id, 10));
      payload.append('name', formData.name);
      
      if (formData.slug) payload.append('slug', formData.slug);
      if (formData.description) payload.append('description', formData.description);
      
      payload.append('sort_order', parseInt(formData.sort_order, 10) || 0);
      
      payload.append('is_active', formData.is_active ? '1' : '0');

      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (!editingProductType) {
        await handleCreate(payload);
      } else {
        payload.append('_method', 'PUT');
        await handleUpdate(editingProductType.id, payload);
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
                {editingProductType ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingProductType ? 'Edit Jenis Produk' : 'Tambah Jenis Produk Baru'}
              </h3>
              <p className="text-slate-400 text-sm">
                {editingProductType ? 'Perbarui detail jenis produk di bawah ini' : 'Isi formulir untuk menambahkan jenis produk baru'}
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
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Kategori <span className="text-red-400">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                disabled={isPending}
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.category_id ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                }`}
              >
                <option value="">Pilih Kategori</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400"></span>
                  {errors.category_id}
                </p>
              )}
            </div>

            <Input
              label="Nama Jenis Produk"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Standar, Mini, Longboom"
              error={errors.name}
              disabled={isPending}
              required
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="standar (kosongkan untuk auto-generate)"
            error={errors.slug}
            disabled={isPending}
            helperText="Kosongkan untuk generate otomatis dari nama"
          />

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
              placeholder="Deskripsi singkat tentang jenis produk ini"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Gambar
            </label>
            
            {imagePreview ? (
              <div className="relative group">
                <div className="w-full h-48 bg-slate-700/50 border border-slate-600/50 rounded-xl overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                  title="Hapus Gambar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label 
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  errors.image 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-slate-600 hover:border-indigo-500/50'
                } bg-slate-700/30 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold">Klik untuk upload</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    JPG, JPEG, PNG, atau WebP (Max. 2MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isPending}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                {errors.image}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                step="1"
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
              ) : !editingProductType && (
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
              icon={isPending ? Loader2 : Layers}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingProductType ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingProductType ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductTypeForm;