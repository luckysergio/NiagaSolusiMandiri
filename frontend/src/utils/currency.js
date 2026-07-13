/**
 * Format angka ke format Rupiah
 * @param {number|string} value - Nilai angka atau string
 * @returns {string} - Format "10.000" atau "10.000,00"
 */
export const formatRupiah = (value, withDecimal = false) => {
  if (value === null || value === undefined || value === '') return '';
  
  const numValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.-]/g, '')) 
    : value;
  
  if (isNaN(numValue)) return '';
  
  const formatted = numValue.toLocaleString('id-ID', {
    minimumFractionDigits: withDecimal ? 2 : 0,
    maximumFractionDigits: withDecimal ? 2 : 0,
  });
  
  return formatted;
};

/**
 * Parse format Rupiah ke number
 * @param {string} value - String format "10.000" atau "10.000,00"
 * @returns {number} - Angka asli
 */
export const parseRupiah = (value) => {
  if (!value) return 0;
  
  const cleaned = value
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format input saat user mengetik
 * @param {string} value - Input dari user
 * @returns {string} - Format "10.000"
 */
export const formatRupiahInput = (value) => {
  if (!value) return '';
  
  const digits = value.replace(/\D/g, '');
  
  if (!digits) return '';
  
  return parseInt(digits, 10).toLocaleString('id-ID');
};