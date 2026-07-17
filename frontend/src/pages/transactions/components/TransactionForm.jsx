import React, { useState, useEffect } from 'react';
import { X, Receipt, Loader2, Plus } from 'lucide-react';
import { useTransactions } from '../../../hooks/useTransactions';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import Card from '../../../common/Card';
import TransactionDetailRow from './TransactionDetailRow';
import { formatRupiah, formatRupiahInput, parseRupiah } from '../../../utils/currency';

const TransactionForm = ({ isOpen, onClose, onSuccess, editingTransaction }) => {
  const { handleCreate, handleUpdate, createMutation, updateMutation } = useTransactions();

  const [formData, setFormData] = useState({
    transaction_date: '',
    customer_name: '',
    project_name: '',
    project_address: '',
    status: 'dipesan',
    notes: '',
    details: [],
  });
  const [errors, setErrors] = useState({});

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        transaction_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        project_name: '',
        project_address: '',
        status: 'dipesan',
        notes: '',
        details: [],
      });
      setErrors({});
      return;
    }

    if (editingTransaction) {
      const detailsArray = editingTransaction?.details || [];
      const formattedDetails = detailsArray.map(detail => {
        const price = parseFloat(detail.product_price) || 0;
        const expense = parseFloat(detail.expense) || 0;
        
        return {
          product_id: detail.product_id?.toString() || detail.product?.id?.toString() || '',
          unit: detail.unit || detail.product?.unit || 'unit',
          product_price: formatRupiahInput(Math.round(price).toString()),
          qty: detail.qty || 1,
          supplier_id: detail.supplier_id?.toString() || detail.supplier?.id?.toString() || '',
          expense: formatRupiahInput(Math.round(expense).toString()),
        };
      });

      setFormData({
        transaction_date: editingTransaction.transaction_date 
          ? new Date(editingTransaction.transaction_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        customer_name: editingTransaction.customer_name || '',
        project_name: editingTransaction.project_name || '',
        project_address: editingTransaction.project_address || '',
        status: editingTransaction.status?.value || editingTransaction.status || 'dipesan',
        notes: editingTransaction.notes || '',
        details: formattedDetails,
      });
    } else {
      setFormData({
        transaction_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        project_name: '',
        project_address: '',
        status: 'dipesan',
        notes: '',
        details: [],
      });
    }
    setErrors({});
  }, [isOpen, editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDetailChange = (index, updatedDetail) => {
    setFormData((prev) => {
      const newDetails = [...prev.details];
      newDetails[index] = updatedDetail;
      return { ...prev, details: newDetails };
    });
  };

  const handleAddDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { product_id: '', unit: 'unit', product_price: '', qty: 1, supplier_id: '', expense: '' },
      ],
    }));
  };

  const handleRemoveDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const calculateSummary = () => {
    let totalTransaction = 0;
    let totalExpense = 0;

    formData.details.forEach(detail => {
      const price = parseRupiah(detail.product_price);
      const qty = parseFloat(detail.qty) || 0;
      const expense = parseRupiah(detail.expense);

      totalTransaction += price * qty;
      totalExpense += expense;
    });

    return {
      totalTransaction,
      totalExpense,
      profit: totalTransaction - totalExpense,
    };
  };

  const summary = calculateSummary();

  const validate = () => {
    const newErrors = {};
    if (!formData.transaction_date) newErrors.transaction_date = 'Tanggal transaksi wajib diisi';
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nama pelanggan wajib diisi';
    } else if (formData.customer_name.length > 150) {
      newErrors.customer_name = 'Nama pelanggan maksimal 150 karakter';
    }
    if (formData.project_name && formData.project_name.length > 200) {
      newErrors.project_name = 'Nama proyek maksimal 200 karakter';
    }
    if (formData.details.length > 0) {
      formData.details.forEach((detail, index) => {
        if (!detail.product_id) newErrors[`detail_${index}_product`] = 'Produk wajib dipilih';
        if (!detail.qty || parseFloat(detail.qty) <= 0) newErrors[`detail_${index}_qty`] = 'Quantity minimal 0.01';
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        transaction_date: formData.transaction_date,
        customer_name: formData.customer_name.trim(),
        project_name: formData.project_name.trim() || undefined,
        project_address: formData.project_address.trim() || undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
        details: formData.details.map(detail => ({
          product_id: parseInt(detail.product_id),
          unit: detail.unit || 'unit',
          product_price: parseRupiah(detail.product_price) || 0,
          qty: parseFloat(detail.qty) || 1,
          supplier_id: detail.supplier_id ? parseInt(detail.supplier_id) : null,
          expense: parseRupiah(detail.expense) || 0,
        })),
      };

      if (!editingTransaction) {
        await handleCreate(payload);
      } else {
        await handleUpdate(editingTransaction.id, payload);
      }

      onSuccess(); // ✅ Ini akan memanggil handleFormSuccess di TransactionsPage
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
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
      onClick={(e) => { if (e.target === e.currentTarget && !isPending) onClose(); }}
    >
      <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] flex flex-col animate-scaleIn relative overflow-hidden">
        {isPending && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <p className="text-white font-medium">{editingTransaction ? 'Memperbarui...' : 'Menyimpan...'}</p>
              <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl">
              <Receipt className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
              </h3>
              <p className="text-slate-400 text-sm">
                {editingTransaction ? 'Perbarui detail transaksi di bawah ini' : 'Isi formulir untuk menambahkan transaksi baru'}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tanggal Transaksi <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.transaction_date ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600'
                  }`}
                />
                {errors.transaction_date && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"></span>{errors.transaction_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="dipesan">Dipesan</option>
                  <option value="dikerjakan">Dikerjakan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            <Input
              label="Nama Pelanggan"
              name="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={handleInputChange}
              placeholder="Contoh: PT Maju Jaya"
              error={errors.customer_name}
              disabled={isPending}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Proyek"
                name="project_name"
                type="text"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Contoh: Proyek Gedung A"
                error={errors.project_name}
                disabled={isPending}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Alamat Proyek</label>
                <input
                  type="text"
                  name="project_address"
                  value={formData.project_address}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Alamat proyek"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Catatan</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                disabled={isPending}
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Catatan tambahan (opsional)"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Detail Transaksi</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddDetail}
                  disabled={isPending}
                >
                  Tambah Item
                </Button>
              </div>

              {formData.details.length === 0 ? (
                <div className="text-center py-8 bg-slate-700/20 border border-dashed border-slate-600/50 rounded-xl">
                  <p className="text-slate-400 text-sm">Belum ada item. Klik "Tambah Item" untuk menambahkan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.details.map((detail, index) => (
                    <TransactionDetailRow
                      key={index}
                      detail={detail}
                      index={index}
                      onChange={handleDetailChange}
                      onRemove={handleRemoveDetail}
                      disabled={isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            {formData.details.length > 0 && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 space-y-2">
                <h4 className="text-sm font-semibold text-white mb-3">Ringkasan</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Transaksi:</span>
                  <span className="font-semibold text-emerald-400">{formatRupiah(summary.totalTransaction)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Pengeluaran:</span>
                  <span className="font-semibold text-red-400">{formatRupiah(summary.totalExpense)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-600/50">
                  <span className="text-slate-400 font-medium">Profit:</span>
                  <span className={`font-bold text-lg ${summary.profit >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                    {formatRupiah(summary.profit)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-slate-700/50 shrink-0 bg-slate-800 rounded-b-2xl">
            <Button variant="secondary" onClick={onClose} type="button" disabled={isPending}>
              Batal
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              icon={isPending ? Loader2 : Receipt}
              iconClassName={isPending ? 'animate-spin' : ''}
              disabled={isPending}
            >
              {isPending ? (editingTransaction ? 'Memperbarui...' : 'Menyimpan...') : (editingTransaction ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TransactionForm;