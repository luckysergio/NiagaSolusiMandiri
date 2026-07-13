import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

import logoImage from '../assets/logo-nsm.png';
import ttdImage from '../assets/ttd.png';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 9, color: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1 solid #e5e7eb', marginBottom: 15 },
  logoContainer: { width: 100, height: 60 },
  logo: { width: '100%', height: '100%', objectFit: 'contain' },
  companyInfo: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  companyName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: '#1e3a8a' },
  companyDetail: { fontSize: 8, color: '#4b5563', textAlign: 'center', lineHeight: 1.4 },
  invoiceTitle: { fontSize: 20, fontWeight: 'bold', width: 100, textAlign: 'right', color: '#1e3a8a' },
  customerSection: { flexDirection: 'row', marginBottom: 20, marginTop: 10 },
  customerBox: { flex: 2 },
  customerName: { fontWeight: 'bold', fontSize: 11, marginBottom: 4, color: '#111827' },
  customerText: { fontSize: 9, marginBottom: 2, color: '#374151' },
  invoiceInfoBox: { flex: 2, alignItems: 'flex-end' },
  invoiceDate: { fontSize: 9, marginBottom: 2, color: '#374151' },
  invoiceNumber: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
  tableContainer: { marginTop: 15, marginBottom: 15 },
  table: { display: 'table', width: '100%', border: '0.5 solid #3b82f6' },
  tableRowHeader: { flexDirection: 'row', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: 9, borderBottom: '0.5 solid #3b82f6' },
  tableRow: { flexDirection: 'row', borderBottom: '0.5 solid #d1d5db' },
  tableRowAlt: { flexDirection: 'row', borderBottom: '0.5 solid #d1d5db', backgroundColor: '#f9fafb' },
  tableCell: { padding: 6, fontSize: 9, textAlign: 'center' },
  tableCellLeft: { padding: 6, fontSize: 9, textAlign: 'left' },
  tableCellRight: { padding: 6, fontSize: 9, textAlign: 'right' },
  totalSection: { marginTop: 15, padding: 12, backgroundColor: '#eff6ff', borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', border: '0.5 solid #bfdbfe' },
  terbilangContainer: { maxWidth: '60%' },
  terbilangLabel: { fontSize: 9, fontWeight: 'bold', color: '#2563eb', marginBottom: 2 },
  terbilangText: { fontSize: 9, fontStyle: 'italic', color: '#374151' },
  totalContainer: { textAlign: 'right' },
  totalLabel: { fontSize: 9, fontWeight: 'bold', color: '#2563eb' },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  bankInfo: { marginTop: 15, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4, textAlign: 'center', fontSize: 9, color: '#374151', border: '0.5 solid #e5e7eb' },
  footer: { marginTop: 30, paddingTop: 20, borderTop: '0.5 solid #e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  qrSection: { alignItems: 'center' },
  qrCode: { width: 80, height: 80, objectFit: 'contain' },
  qrLabel: { fontSize: 7, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  signatureSection: { alignItems: 'center' },
  signatureDate: { fontSize: 9, marginBottom: 8, textAlign: 'center', color: '#374151' },
  signatureImage: { width: 100, height: 60, objectFit: 'contain', marginBottom: 4 },
  signatureName: { fontSize: 9, fontWeight: 'bold', textAlign: 'center', borderBottom: '0.5 solid #000', paddingHorizontal: 20, paddingBottom: 2, color: '#111827' },
});

const formatRupiahPDF = (value) => {
  if (!value && value !== 0) return 'Rp 0';
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })
    .format(num).replace('IDR', 'Rp').trim();
};

const formatQtyPDF = (qty) => {
  if (!qty && qty !== 0) return '0';
  return Number(qty).toLocaleString('id-ID', { maximumFractionDigits: 2 });
};

const formatTanggalPDF = (isoDate) => {
  if (!isoDate) return '-';
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  try {
    const date = new Date(isoDate);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch {
    return isoDate;
  }
};

const sanitizeFilename = (str) => {
  if (!str) return '';
  return str.toString().replace(/[\/\\:*?"<>|]/g, '-').replace(/\s+/g, '_').trim();
};

const terbilang = (n) => {
  if (n === 0) return 'nol rupiah';
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const belasan = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
  const puluhan = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
  
  const convert = (num) => {
    if (num < 10) return satuan[num];
    if (num < 20) return belasan[num - 10];
    if (num < 100) return puluhan[Math.floor(num / 10)] + (num % 10 ? ' ' + satuan[num % 10] : '');
    if (num < 1000) return satuan[Math.floor(num / 100)] + ' ratus' + (num % 100 ? ' ' + convert(num % 100) : '');
    if (num < 10000) return 'seribu' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 1000000) return convert(Math.floor(num / 1000)) + ' ribu' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 1000000000) return convert(Math.floor(num / 1000000)) + ' juta' + (num % 1000000 ? ' ' + convert(num % 1000000) : '');
    if (num < 1000000000000) return convert(Math.floor(num / 1000000000)) + ' miliar' + (num % 1000000000 ? ' ' + convert(num % 1000000000) : '');
    return num.toString();
  };
  return convert(Math.floor(n)).trim() + ' rupiah';
};

const InvoiceDocument = ({ transaction, qrCodeImage }) => {
  const details = transaction?.details || [];
  const total = transaction?.total_transaction || details.reduce((sum, d) => sum + ((d?.qty || 0) * (d?.product_price || 0)), 0);

  const getCreatedBy = () => {
    if (transaction?.user?.name && transaction.user.name.trim()) return transaction.user.name;
    return 'Administrator';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}><Image src={logoImage} style={styles.logo} /></View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>NIAGA SOLUSI MANDIRI</Text>
            <Text style={styles.companyDetail}>Jl Masjid Ar Rahman cicentang RT 02 RW 01 No.84</Text>
            <Text style={styles.companyDetail}>Rawabuntu Serpong Tangerang Selatan</Text>
            <Text style={styles.companyDetail}>021-29179935 - 085881800604</Text>
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        <View style={styles.customerSection}>
          <View style={styles.customerBox}>
            <Text style={styles.customerName}>{transaction?.customer_name || 'Pelanggan'}</Text>
            {transaction?.project_name && <Text style={styles.customerText}>Proyek: {transaction.project_name}</Text>}
            {transaction?.project_address && <Text style={styles.customerText}>{transaction.project_address}</Text>}
          </View>
          <View style={styles.invoiceInfoBox}>
            <Text style={styles.invoiceDate}>Tanggal: {formatTanggalPDF(transaction?.transaction_date || transaction?.created_at)}</Text>
            <Text style={styles.invoiceNumber}>{transaction?.invoice || 'INV-000'}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={{ ...styles.tableCell, flex: 0.5 }}>No</Text>
              <Text style={{ ...styles.tableCellLeft, flex: 3.5, paddingLeft: 10 }}>Nama Produk</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>Qty</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>Satuan</Text>
              <Text style={{ ...styles.tableCellRight, flex: 1.2, paddingRight: 10 }}>Harga</Text>
              <Text style={{ ...styles.tableCellRight, flex: 1.2, paddingRight: 10 }}>Subtotal</Text>
            </View>
            {details.map((item, index) => {
              const product = item?.product || {};
              const subtotal = (item?.qty || 0) * (item?.product_price || 0);
              const satuan = item?.unit || product?.unit || 'unit';
              const isAlt = index % 2 === 1;
              return (
                <View key={item?.id || index} style={isAlt ? styles.tableRowAlt : styles.tableRow}>
                  <Text style={{ ...styles.tableCell, flex: 0.5 }}>{index + 1}</Text>
                  <Text style={{ ...styles.tableCellLeft, flex: 3.5, paddingLeft: 10 }}>{product?.name || 'Produk'}</Text>
                  <Text style={{ ...styles.tableCell, flex: 0.8 }}>{formatQtyPDF(item?.qty)}</Text>
                  <Text style={{ ...styles.tableCell, flex: 0.8 }}>{satuan}</Text>
                  <Text style={{ ...styles.tableCellRight, flex: 1.2, paddingRight: 10 }}>{formatRupiahPDF(item?.product_price)}</Text>
                  <Text style={{ ...styles.tableCellRight, flex: 1.2, paddingRight: 10 }}>{formatRupiahPDF(subtotal)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.terbilangContainer}>
            <Text style={styles.terbilangLabel}>Terbilang:</Text>
            <Text style={styles.terbilangText}>{terbilang(total)}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmount}>{formatRupiahPDF(total)}</Text>
          </View>
        </View>

        <View style={styles.bankInfo}>
          <Text>Pembayaran dapat dilakukan Transfer Ke Bank BCA No Rek 8990140074 a/n Ade</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.qrSection}>
            {qrCodeImage ? <Image src={qrCodeImage} style={styles.qrCode} /> : (
              <View style={{ width: 80, height: 80, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 6, color: '#6b7280', textAlign: 'center' }}>QR Code</Text>
              </View>
            )}
            <Text style={styles.qrLabel}>LOKASI KANTOR</Text>
          </View>
          <View style={styles.signatureSection}>
            <Text style={styles.signatureDate}>Tangerang Selatan, {formatTanggalPDF(transaction?.transaction_date || transaction?.created_at)}</Text>
            <Image src={ttdImage} style={styles.signatureImage} />
            <Text style={styles.signatureName}>{getCreatedBy()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const generateInvoicePDF = async (transaction) => {
  if (!transaction) throw new Error('Transaction data is required');
  
  let qrCodeImage = null;
  try {
    qrCodeImage = await QRCode.toDataURL('https://maps.app.goo.gl/LwQmA1JNhUUoqsUVA', {
      width: 120, margin: 1, color: { dark: '#000000', light: '#ffffff' }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  const invoiceNum = sanitizeFilename(transaction?.invoice || `INV-${transaction?.id}`);
  const filename = `Invoice_${invoiceNum}.pdf`;

  try {
    const blob = await pdf(<InvoiceDocument transaction={transaction} qrCodeImage={qrCodeImage} />).toBlob();
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.title = filename;
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          <style>
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f3f4f6; display: flex; flex-direction: column; height: 100vh; }
            .toolbar { padding: 12px 20px; background: #ffffff; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .filename { font-weight: 600; color: #111827; font-size: 14px; display: flex; align-items: center; gap: 8px; }
            .download-btn { background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
            .download-btn:hover { background: #1d4ed8; }
            iframe { flex: 1; width: 100%; border: none; background: #525659; }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <span class="filename">📄 ${filename}</span>
            <a href="${url}" download="${filename}" class="download-btn">⬇ Download PDF</a>
          </div>
          <iframe src="${url}" type="application/pdf"></iframe>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default InvoiceDocument;