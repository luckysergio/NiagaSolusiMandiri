import React, { useState, useEffect } from 'react';
import { X, Truck, Loader2 } from 'lucide-react';
import { useSuppliers } from '../../../hooks/useSuppliers';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import Card from '../../../common/Card';

const SupplierForm = ({ isOpen, onClose, onSuccess, editingSupplier }) => {
  const { 
    handleCreate, 
    handleUpdate, 
    createMutation, 
    updateMutation,
  } = useSuppliers();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (editingSupplier) {
        setFormData({
          name: editingSupplier.name || '',
          address: editingSupplier.address || '',
          phone: editingSupplier.phone || '',
          is_active: Boolean(editingSupplier.is_active),
        });
      } else {
        setFormData({
          name: '',
          address: '',
          phone: '',
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, editingSupplier]);

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
    
    let finalValue = value;
    if (name === 'is_active') {
      finalValue = value === 'true';
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama supplier wajib diisi';
    } else if (formData.name.length > 150) {
      newErrors.name = 'Nama supplier maksimal 150 karakter';
    }

    if (formData.phone && formData.phone.length > 30) {
      newErrors.phone = 'Nomor telepon maksimal 30 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        is_active: formData.is_active ? '1' : '0',
      };

      if (!editingSupplier) {
        await handleCreate(payload);
      } else {
        await handleUpdate(editingSupplier.id, payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

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
      <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleIn relative overflow-hidden">
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-white font-medium">
                {editingSupplier ? 'Memperbarui...' : 'Menyimpan...'}
              </p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl">
              <Truck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
              </h3>
              <p className="text-slate-400 text-sm">
                {editingSupplier ? 'Perbarui detail supplier di bawah ini' : 'Isi formulir untuk menambahkan supplier baru'}
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
              label="Nama Supplier"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: PT Semen Indonesia"
              error={errors.name}
              disabled={isPending}
              required
            />

            <Input
              label="Nomor Telepon"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contoh: 0812-3456-7890"
              error={errors.phone}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Alamat
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isPending}
              rows={3}
              className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.address ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
              }`}
              placeholder="Alamat lengkap supplier"
            />
            {errors.address && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                {errors.address}
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
              icon={isPending ? Loader2 : Truck}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending 
                ? (editingSupplier ? 'Memperbarui...' : 'Menyimpan...') 
                : (editingSupplier ? 'Update' : 'Simpan')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SupplierForm;