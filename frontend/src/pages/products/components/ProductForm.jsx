import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Info, Loader2, RefreshCw } from 'lucide-react';
import { useProducts } from '../../../hooks/useProducts';
import { useProductTypes } from '../../../hooks/useProductTypes';
import Input from '../../../common/Input';
import RupiahInput from '../../../common/RupiahInput';
import Button from '../../../common/Button';
import { parseRupiah, formatRupiahInput } from '../../../utils/currency';

const ProductForm = ({ isOpen, onClose, onSuccess, editingProduct, categories = [] }) => {
  const { 
    handleCreate, 
    handleUpdate, 
    createMutation, 
    updateMutation,
    useNextSortOrder,
    useGenerateCode,
  } = useProducts();

  const { useDropdown: useProductTypesDropdown } = useProductTypes();

  const [formData, setFormData] = useState({
    product_type_id: '',
    code: '',
    name: '',
    description: '',
    price: '',
    unit: 'unit',
    minimum_order: 1,
    sort_order: 0,
    featured: false,
    is_active: true,
  });
  
  const [errors, setErrors] = useState({});
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [shouldGenerateCode, setShouldGenerateCode] = useState(false);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isInitializedRef = useRef(false);

  const { data: productTypes = [] } = useProductTypesDropdown(
    selectedCategoryId ? parseInt(selectedCategoryId) : null
  );

  const { data: suggestedSortOrder } = useNextSortOrder(
    formData.product_type_id ? parseInt(formData.product_type_id) : null
  );

  const { 
    data: generatedCode, 
    isLoading: isGeneratingCode,
    refetch: refetchCode 
  } = useGenerateCode(
    formData.product_type_id ? parseInt(formData.product_type_id) : null,
    formData.name,
    shouldGenerateCode
  );

  useEffect(() => {
    if (!isOpen) {
      isInitializedRef.current = false;
      return;
    }

    if (isInitializedRef.current) return;

    if (editingProduct) {
      // ✅ FIX 1: Konversi harga ke Number, bulatkan, baru format
      const rawPrice = Number(editingProduct.price) || 0;
      const cleanPrice = Math.round(rawPrice);
      
      setFormData({
        product_type_id: editingProduct.product_type_id?.toString() || '',
        code: editingProduct.code || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: formatRupiahInput(cleanPrice.toString()), 
        unit: editingProduct.unit || 'unit',
        
        // ✅ FIX 2: Gunakan parseFloat agar "1.00" menjadi 1 (hilangkan desimal)
        minimum_order: parseFloat(editingProduct.minimum_order) || 1, 
        
        // ✅ FIX 3: Pastikan sort_order adalah integer
        sort_order: parseInt(editingProduct.sort_order) || 0, 
        
        featured: editingProduct.featured ?? false,
        is_active: editingProduct.is_active ?? true,
      });

      if (editingProduct.product_type?.category_id) {
        setSelectedCategoryId(editingProduct.product_type.category_id.toString());
      }
    } else {
      setFormData({
        product_type_id: '',
        code: '',
        name: '',
        description: '',
        price: '',
        unit: 'unit',
        minimum_order: 1,
        sort_order: 0,
        featured: false,
        is_active: true,
      });
      setSelectedCategoryId('');
    }

    setErrors({});
    setCodeGenerated(false);
    setShouldGenerateCode(false);
    isInitializedRef.current = true;
  }, [isOpen, editingProduct]);

  useEffect(() => {
    if (!isOpen || editingProduct) return;
    if (!suggestedSortOrder) return;
    
    setFormData(prev => {
      if (prev.sort_order === 0) {
        return { ...prev, sort_order: suggestedSortOrder };
      }
      return prev;
    });
  }, [isOpen, editingProduct, suggestedSortOrder]);

  useEffect(() => {
    if (generatedCode && shouldGenerateCode) {
      setFormData(prev => ({
        ...prev,
        code: generatedCode,
      }));
      setCodeGenerated(true);
      setShouldGenerateCode(false);
    }
  }, [generatedCode, shouldGenerateCode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let finalValue = value;
    if (name === 'is_active' || name === 'featured') {
      finalValue = value === 'true' || value === true;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setFormData(prev => ({
      ...prev,
      product_type_id: '',
      sort_order: 0,
      code: '',
    }));
    setCodeGenerated(false);
  };

  const handleGenerateCode = async () => {
    if (!formData.product_type_id) {
      setErrors(prev => ({ ...prev, product_type_id: 'Pilih jenis produk terlebih dahulu' }));
      return;
    }
    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Nama produk wajib diisi untuk generate kode' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, product_type_id: null, name: null }));
    setShouldGenerateCode(true);
    await refetchCode();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.product_type_id) {
      newErrors.product_type_id = 'Jenis produk wajib dipilih';
    }

    if (!formData.name) {
      newErrors.name = 'Nama produk wajib diisi';
    } else if (formData.name.length > 150) {
      newErrors.name = 'Nama produk maksimal 150 karakter';
    }

    if (formData.code && formData.code.length > 30) {
      newErrors.code = 'Kode produk maksimal 30 karakter';
    }

    const priceValue = parseRupiah(formData.price);
    if (priceValue < 0) {
      newErrors.price = 'Harga minimal 0';
    }

    if (formData.minimum_order < 0) {
      newErrors.minimum_order = 'Minimum order minimal 0';
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
        product_type_id: formData.product_type_id,
        code: formData.code || undefined,
        name: formData.name,
        description: formData.description || undefined,
        price: parseRupiah(formData.price) || 0,
        unit: formData.unit || 'unit',
        minimum_order: parseFloat(formData.minimum_order) || 1,
        sort_order: parseInt(formData.sort_order) || 0,
        featured: formData.featured ? '1' : '0',
        is_active: formData.is_active ? '1' : '0',
      };

      if (!editingProduct) {
        await handleCreate(payload);
      } else {
        await handleUpdate(editingProduct.id, payload);
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
      if (e.key === 'Escape' && isOpen && !isPending) onClose();
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
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-700/50 max-h-[90vh] flex flex-col animate-scaleIn relative">
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-white font-medium">
                {editingProduct ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Package className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Kategori <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kategori</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Jenis Produk <span className="text-red-400">*</span>
              </label>
              <select
                name="product_type_id"
                value={formData.product_type_id}
                onChange={handleInputChange}
                disabled={isPending || !selectedCategoryId}
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.product_type_id ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
              >
                <option value="">Pilih Jenis</option>
                {Array.isArray(productTypes) && productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.product_type_id && (
                <p className="mt-1 text-xs text-red-400">{errors.product_type_id}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Kode Produk
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.code ? 'border-red-500/50' : 'border-slate-600/50'
                  }`}
                  placeholder="Auto-generated (cth: BRT-K-300-STD)"
                />
                {codeGenerated && !errors.code && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400">
                    <Info className="w-3 h-3" />
                    <span className="text-xs">Generated</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleGenerateCode}
                disabled={isPending || isGeneratingCode}
                className="px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                title="Generate Kode Berdasarkan Jenis & Nama"
              >
                {isGeneratingCode ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
            {errors.code ? (
              <p className="mt-1 text-xs text-red-400">{errors.code}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Isi Jenis & Nama terlebih dahulu, lalu klik Generate
              </p>
            )}
          </div>

          <Input
            label="Nama Produk"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Beton Readymix Minimix K-300"
            error={errors.name}
            disabled={isPending}
            required
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
              rows={2}
              className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.description ? 'border-red-500/50' : 'border-slate-600/50'
              }`}
              placeholder="Deskripsi singkat tentang produk ini"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <RupiahInput
              label="Harga"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              error={errors.price}
              disabled={isPending}
              helperText="Ketik angka, titik ribuan otomatis"
            />

            <Input
              label="Unit"
              name="unit"
              type="text"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="unit, m³, m²"
              error={errors.unit}
              disabled={isPending}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Min. Order
              </label>
              <input
                name="minimum_order"
                type="number"
                value={formData.minimum_order}
                onChange={handleInputChange}
                disabled={isPending}
                min={0}
                step="1" 
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.minimum_order ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
                placeholder="1"
              />
              {errors.minimum_order && (
                <p className="mt-1 text-xs text-red-400">{errors.minimum_order}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
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
                  errors.sort_order ? 'border-red-500/50' : 'border-slate-600/50'
                }`}
                placeholder="0"
              />
              {errors.sort_order ? (
                <p className="mt-1 text-xs text-red-400">{errors.sort_order}</p>
              ) : !editingProduct && (
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Auto-filled
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Featured
              </label>
              <select
                name="featured"
                value={formData.featured.toString()}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="false">Non-Featured</option>
                <option value="true">Featured</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                name="is_active"
                value={formData.is_active.toString()}
                onChange={handleInputChange}
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

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
              icon={isPending ? Loader2 : Package}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingProduct ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingProduct ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;