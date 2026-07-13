import React, { useState, useMemo } from 'react';
import { Trash2, Search } from 'lucide-react';
import RupiahInput from '../../../common/RupiahInput';
import { useProducts } from '../../../hooks/useProducts';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { useCategories } from '../../../hooks/useCategories';
import { useProductTypes } from '../../../hooks/useProductTypes';
import { parseRupiah, formatRupiahInput } from '../../../utils/currency';

const TransactionDetailRow = ({ detail, index, onChange, onRemove, disabled }) => {
  const { useDropdown: useProductsDropdown } = useProducts();
  const { useDropdown: useSuppliersDropdown } = useSuppliers();
  const { useDropdown: useCategoriesDropdown } = useCategories();
  const { useDropdown: useProductTypesDropdown } = useProductTypes();

  const { data: categories = [] } = useCategoriesDropdown();
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const { data: types = [] } = useProductTypesDropdown(categoryFilter ? parseInt(categoryFilter) : null);
  
  const [typeFilter, setTypeFilter] = useState('');
  const [productSearch, setProductSearch] = useState('');
  
  const { data: allProducts = [] } = useProductsDropdown();
  const { data: suppliers = [] } = useSuppliersDropdown();

  // ✅ Filter produk berdasarkan Kategori, Jenis, dan Search
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(p => {
      const matchCategory = categoryFilter 
        ? p.product_type?.category_id?.toString() === categoryFilter 
        : true;
      const matchType = typeFilter 
        ? p.product_type_id?.toString() === typeFilter 
        : true;
      const matchSearch = productSearch 
        ? (p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
           p.code.toLowerCase().includes(productSearch.toLowerCase()))
        : true;
      return matchCategory && matchType && matchSearch;
    });

    // ✅ Safeguard: Pastikan produk yang sedang dipilih tetap muncul di dropdown
    if (detail.product_id && !filtered.some(p => p.id.toString() === detail.product_id.toString())) {
      const selected = allProducts.find(p => p.id.toString() === detail.product_id.toString());
      if (selected) filtered.unshift(selected);
    }

    return filtered;
  }, [allProducts, categoryFilter, typeFilter, productSearch, detail.product_id]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = allProducts.find(p => p.id.toString() === productId);
    
    if (product) {
      onChange(index, {
        ...detail,
        product_id: productId,
        unit: product.unit || 'unit',
        product_price: formatRupiahInput((Math.round(parseFloat(product.price) || 0)).toString()),
      });
    } else {
      onChange(index, { ...detail, product_id: '', unit: 'unit', product_price: '' });
    }
  };

  const handleFieldChange = (field, value) => {
    onChange(index, { ...detail, [field]: value });
  };

  const calculateTotal = () => {
    const price = parseRupiah(detail.product_price);
    const qty = parseFloat(detail.qty) || 0;
    return price * qty;
  };

  return (
    <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Item #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={disabled}
          className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Hapus Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setTypeFilter(''); // Reset jenis saat kategori berubah
          }}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          disabled={disabled || !categoryFilter}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Semua Jenis</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            disabled={disabled}
            placeholder="Cari nama/kode produk..."
            className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
          />
        </div>
      </div>

      {/* Product & Supplier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={detail.product_id}
          onChange={handleProductChange}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Pilih Produk</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.code})
            </option>
          ))}
        </select>

        <select
          value={detail.supplier_id || ''}
          onChange={(e) => handleFieldChange('supplier_id', e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Pilih Supplier (Opsional)</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
      </div>

      {/* Unit, Price, Qty */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Satuan</label>
          <input
            type="text"
            value={detail.unit}
            onChange={(e) => handleFieldChange('unit', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="unit"
          />
        </div>

        <RupiahInput
          label="Harga Satuan"
          value={detail.product_price}
          onChange={(e) => handleFieldChange('product_price', e.target.value)}
          placeholder="0"
          disabled={disabled}
        />

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Qty <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={detail.qty}
            onChange={(e) => handleFieldChange('qty', e.target.value)}
            disabled={disabled}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="1"
          />
        </div>
      </div>

      {/* Expense & Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RupiahInput
          label="Pengeluaran Item"
          value={detail.expense}
          onChange={(e) => handleFieldChange('expense', e.target.value)}
          placeholder="0"
          disabled={disabled}
        />

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Total Harga</label>
          <div className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-emerald-400 font-semibold flex items-center">
            {formatRupiahInput(Math.round(calculateTotal()).toString()) || '0'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailRow;