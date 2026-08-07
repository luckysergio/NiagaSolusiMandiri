import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:open_file/open_file.dart';
import 'package:flutter/foundation.dart';

import '../models/transaction.dart';
import 'dio_client.dart';
import '../config/api_config.dart';

class InvoiceService {
  static const String _companyName = 'NIAGA SOLUSI MANDIRI';
  static const String _owner = 'Ade';
  static const String _address =
      'Jl Masjid Ar Rahman Cicentang RT 02 RW 01 No.84, Rawabuntu Serpong Tangerang Selatan';
  static const String _phone = '021-29179935 - 085881800604';
  static const String _bankAccount = 'BCA No Rek 8990140074 a/n Ade';
  static const String _qrLink = 'https://maps.app.goo.gl/LwQmA1JNhUUoqsUVA';

  static String _terbilang(num n) {
    if (n == 0) return 'Nol rupiah';
    final satuan = [
      '',
      'satu',
      'dua',
      'tiga',
      'empat',
      'lima',
      'enam',
      'tujuh',
      'delapan',
      'sembilan',
      'sepuluh',
      'sebelas'
    ];

    String convert(int num) {
      if (num < 12) return satuan[num];
      if (num < 20) return '${convert(num - 10)} belas';
      if (num < 100) {
        return '${convert(num ~/ 10)} puluh ${convert(num % 10)}'.trim();
      }
      if (num < 200) return 'seratus ${convert(num - 100)}'.trim();
      if (num < 1000) {
        return '${convert(num ~/ 100)} ratus ${convert(num % 100)}'.trim();
      }
      if (num < 2000) return 'seribu ${convert(num - 1000)}'.trim();
      if (num < 1000000) {
        return '${convert(num ~/ 1000)} ribu ${convert(num % 1000)}'.trim();
      }
      if (num < 1000000000) {
        return '${convert(num ~/ 1000000)} juta ${convert(num % 1000000)}'
            .trim();
      }
      if (num < 1000000000000) {
        return '${convert(num ~/ 1000000000)} miliar ${convert(num % 1000000000)}'
            .trim();
      }
      if (num < 1000000000000000) {
        return '${convert(num ~/ 1000000000000)} triliun ${convert(num % 1000000000000)}'
            .trim();
      }
      return 'jumlah terlalu besar';
    }

    final result = convert(n.floor()).replaceAll(RegExp(r'\s+'), ' ').trim();
    return '${result[0].toUpperCase()}${result.substring(1)} rupiah';
  }

  static String _formatRupiah(num value) {
    if (value == 0) return 'Rp 0';
    final rounded = value.round();
    return 'Rp ${rounded.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]}.',
        )}';
  }

  static String _formatNumber(num value) {
    if (value == 0) return '0';

    // Jika angka bulat (misal: 1.0, 1000.00)
    if (value % 1 == 0) {
      return value.toInt().toString().replaceAllMapped(
            RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
            (Match m) => '${m[1]}.',
          );
    }

    // Jika ada desimal (misal: 1.50)
    String str = value.toStringAsFixed(2);
    List<String> parts = str.split('.');

    String intPart = int.parse(parts[0]).toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]}.',
        );

    String fracPart = parts[1].replaceAll(RegExp(r'0+$'), '');

    if (fracPart.isEmpty) {
      return intPart;
    }

    return '$intPart,$fracPart';
  }

  static String _formatTanggal(DateTime? date) {
    if (date == null) return '-';
    final months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];
    final day = date.day.toString().padLeft(2, '0');
    return '$day ${months[date.month - 1]} ${date.year}';
  }

  // --- LOGIKA UTAMA PDF ---
  static Future<void> generateAndSharePdf(Transaction transaction) async {
    final pdf = pw.Document();

    // 1. Load Assets
    ByteData? logoData, ttdData;
    try {
      logoData = await rootBundle.load('assets/images/logo-nsm.png');
      ttdData = await rootBundle.load('assets/images/ttd.png');
    } catch (e) {
      debugPrint('Error loading invoice assets: $e');
    }

    final logo =
        logoData != null ? pw.MemoryImage(logoData.buffer.asUint8List()) : null;
    final ttdImage =
        ttdData != null ? pw.MemoryImage(ttdData.buffer.asUint8List()) : null;

    // 2. Fetch Detail Transactions dari API
    List<Map<String, dynamic>> items = [];
    try {
      final response = await DioClient.dio
          .get('${ApiConfig.transactions}/${transaction.id}');
      final responseData = response.data;

      List<dynamic> detailsData = [];

      // Mencoba berbagai kemungkinan struktur respons dari backend
      if (responseData is Map) {
        if (responseData['data'] is Map &&
            responseData['data']['details'] is List) {
          detailsData = responseData['data']['details'];
        } else if (responseData['details'] is List) {
          detailsData = responseData['details'];
        } else if (responseData['data'] is List) {
          detailsData = responseData['data'];
        }
      }

      // ✅ DEBUG: Print struktur data agar Anda bisa melihat apa yang sebenarnya dikirim backend
      if (kDebugMode) {
        debugPrint('--- RAW DETAILS DATA DARI API ---');
        debugPrint(detailsData.toString());
        debugPrint('---------------------------------');
      }

      items = detailsData.asMap().entries.map((entry) {
        final index = entry.key;
        final d = entry.value as Map<String, dynamic>;

        // ✅ PERBAIKAN: Ambil data product dengan fallback yang lebih aman
        final productData =
            d['product'] is Map ? d['product'] as Map<String, dynamic> : {};

        // Coba berbagai kemungkinan nama key dari backend
        final productName =
            productData['name'] ?? d['product_name'] ?? d['name'] ?? 'Produk';
        final productUnit = d['unit'] ?? productData['unit'] ?? 'unit';

        // Parsing Qty dengan aman (bisa jadi int, double, atau string dari JSON)
        double qty = 1.0;
        if (d['qty'] != null) {
          if (d['qty'] is num) {
            qty = (d['qty'] as num).toDouble();
          } else {
            qty = double.tryParse(d['qty'].toString()) ?? 1.0;
          }
        }

        // Parsing Price dengan aman
        double price = 0.0;
        if (d['product_price'] != null) {
          if (d['product_price'] is num) {
            price = (d['product_price'] as num).toDouble();
          } else {
            price = double.tryParse(d['product_price'].toString()) ?? 0.0;
          }
        }

        final subtotal = price * qty;

        return {
          'no': (index + 1).toString(),
          'name': productName,
          'qty': _formatNumber(qty),
          'unit': productUnit,
          'price': _formatRupiah(price),
          'subtotal': _formatRupiah(subtotal),
        };
      }).toList();
    } catch (e) {
      debugPrint('Gagal memuat detail transaksi: $e');
    }

    // Fallback jika tidak ada detail (Hanya menampilkan Total Kasar)
    if (items.isEmpty) {
      items.add({
        'no': '1',
        'name': 'Paket Transaksi',
        'qty': '1',
        'unit': 'unit',
        'price': _formatRupiah(transaction.totalTransaction),
        'subtotal': _formatRupiah(transaction.totalTransaction),
      });
    }

    // 3. Build Layout PDF
    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(16),
        build: (context) {
          return [
            pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.stretch,
              children: [
                // HEADER
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: pw.CrossAxisAlignment.center,
                  children: [
                    pw.Container(
                      width: 120,
                      alignment: pw.Alignment.centerLeft,
                      child: logo != null ? pw.Image(logo) : pw.Text('LOGO'),
                    ),
                    pw.Expanded(
                      child: pw.Container(
                        alignment: pw.Alignment.center,
                        child: pw.Column(
                          mainAxisAlignment: pw.MainAxisAlignment.center,
                          crossAxisAlignment: pw.CrossAxisAlignment.center,
                          children: [
                            pw.Text(
                              _companyName,
                              style: pw.TextStyle(
                                  fontSize: 16,
                                  fontWeight: pw.FontWeight.bold,
                                  color: PdfColors.black),
                              textAlign: pw.TextAlign.center,
                            ),
                            pw.SizedBox(height: 2),
                            pw.Text(
                              _address,
                              style: pw.TextStyle(
                                  fontSize: 9, color: PdfColors.grey800),
                              textAlign: pw.TextAlign.center,
                            ),
                            pw.Text(
                              _phone,
                              style: pw.TextStyle(
                                  fontSize: 9, color: PdfColors.grey800),
                              textAlign: pw.TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                    pw.Container(
                      width: 80,
                      alignment: pw.Alignment.centerRight,
                      child: pw.Text(
                        'INVOICE',
                        style: pw.TextStyle(
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                            color: PdfColors.black),
                      ),
                    ),
                  ],
                ),

                pw.Divider(thickness: 1.5, color: PdfColors.grey400),
                pw.SizedBox(height: 12),

                // CUSTOMER INFO & INVOICE DETAILS
                pw.Row(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Expanded(
                      flex: 2,
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            transaction.customerName,
                            style: pw.TextStyle(
                                fontWeight: pw.FontWeight.bold, fontSize: 11),
                          ),
                          if ((transaction.projectName ?? '').isNotEmpty)
                            pw.Text('Proyek: ${transaction.projectName}',
                                style: pw.TextStyle(
                                    fontSize: 9, color: PdfColors.grey700)),
                          if ((transaction.projectAddress ?? '').isNotEmpty)
                            pw.Text(transaction.projectAddress!,
                                style: pw.TextStyle(
                                    fontSize: 9, color: PdfColors.grey700)),
                        ],
                      ),
                    ),
                    pw.SizedBox(width: 10),
                    pw.Expanded(
                      flex: 2,
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.end,
                        children: [
                          pw.Text(
                            _formatTanggal(transaction.transactionDate),
                            style: pw.TextStyle(
                                fontSize: 9, color: PdfColors.grey700),
                          ),
                          pw.Text(
                            transaction.invoice,
                            style: pw.TextStyle(
                                fontWeight: pw.FontWeight.bold, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                pw.SizedBox(height: 20),

                // TABLE ITEMS
                pw.TableHelper.fromTextArray(
                  border:
                      pw.TableBorder.all(color: PdfColors.grey300, width: 0.5),
                  headerStyle: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      color: PdfColors.white,
                      fontSize: 10),
                  headerDecoration: pw.BoxDecoration(color: PdfColors.blue),
                  headerAlignment: pw.Alignment.center,
                  cellStyle: pw.TextStyle(fontSize: 9),
                  cellAlignments: {
                    0: pw.Alignment.center,
                    1: pw.Alignment.centerLeft,
                    2: pw.Alignment.center,
                    3: pw.Alignment.center,
                    4: pw.Alignment.centerRight,
                    5: pw.Alignment.centerRight,
                  },
                  headers: const [
                    'No',
                    'Nama Produk',
                    'Qty',
                    'Satuan',
                    'Harga',
                    'Subtotal'
                  ],
                  data: items.map((item) {
                    return [
                      item['no'].toString(),
                      item['name'].toString(),
                      item['qty'].toString(),
                      item['unit'].toString(),
                      item['price'].toString(),
                      item['subtotal'].toString(),
                    ];
                  }).toList(),
                ),

                pw.SizedBox(height: 24),

                // TOTAL + TERBILANG
                pw.Container(
                  padding: const pw.EdgeInsets.symmetric(
                      horizontal: 16, vertical: 12),
                  decoration: pw.BoxDecoration(
                    color: PdfColors.blue50,
                    borderRadius: pw.BorderRadius.all(pw.Radius.circular(8)),
                  ),
                  child: pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Expanded(
                        flex: 3,
                        child: pw.Column(
                          crossAxisAlignment: pw.CrossAxisAlignment.start,
                          mainAxisSize: pw.MainAxisSize.min,
                          children: [
                            pw.Text(
                              'Terbilang:',
                              style: pw.TextStyle(
                                  fontSize: 10,
                                  fontWeight: pw.FontWeight.bold,
                                  color: PdfColors.blue),
                            ),
                            pw.SizedBox(height: 2),
                            pw.Text(
                              _terbilang(transaction.totalTransaction),
                              style: pw.TextStyle(
                                  fontSize: 11,
                                  fontStyle: pw.FontStyle.italic,
                                  color: PdfColors.grey700),
                            ),
                          ],
                        ),
                      ),
                      pw.SizedBox(width: 12),
                      pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.end,
                        mainAxisSize: pw.MainAxisSize.min,
                        children: [
                          pw.Text(
                            'TOTAL',
                            style: pw.TextStyle(
                                fontSize: 10,
                                fontWeight: pw.FontWeight.bold,
                                color: PdfColors.blue),
                          ),
                          pw.SizedBox(height: 2),
                          pw.Text(
                            _formatRupiah(transaction.totalTransaction),
                            style: pw.TextStyle(
                                fontSize: 16,
                                fontWeight: pw.FontWeight.bold,
                                color: PdfColors.blue),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                pw.SizedBox(height: 24),

                // BANK INFO
                pw.Container(
                  padding: const pw.EdgeInsets.all(10),
                  decoration: pw.BoxDecoration(
                    color: PdfColors.grey100,
                    borderRadius: pw.BorderRadius.all(pw.Radius.circular(6)),
                  ),
                  child: pw.Center(
                    child: pw.Text(
                      'Pembayaran dapat dilakukan Transfer Ke $_bankAccount',
                      style: pw.TextStyle(fontSize: 10, color: PdfColors.black),
                      textAlign: pw.TextAlign.center,
                    ),
                  ),
                ),

                pw.SizedBox(height: 40),

                // FOOTER SIGNATURE
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: pw.CrossAxisAlignment.end,
                  children: [
                    pw.Container(
                      height: 120,
                      child: pw.Column(
                        mainAxisAlignment: pw.MainAxisAlignment.end,
                        crossAxisAlignment: pw.CrossAxisAlignment.center,
                        children: [
                          pw.BarcodeWidget(
                            barcode: pw.Barcode.qrCode(),
                            data: _qrLink,
                            width: 70,
                            height: 70,
                          ),
                          pw.SizedBox(height: 4),
                          pw.Text(
                            'LOKASI KANTOR',
                            style: pw.TextStyle(
                                fontSize: 8, color: PdfColors.grey700),
                          ),
                        ],
                      ),
                    ),
                    pw.Container(
                      height: 120,
                      child: pw.Column(
                        mainAxisAlignment: pw.MainAxisAlignment.end,
                        crossAxisAlignment: pw.CrossAxisAlignment.center,
                        children: [
                          pw.Text(
                            'Tangerang Selatan, ${_formatTanggal(transaction.transactionDate)}',
                            style: pw.TextStyle(
                                fontSize: 10, color: PdfColors.black),
                          ),
                          pw.SizedBox(height: 8),
                          ttdImage != null
                              ? pw.Image(ttdImage,
                                  width: 120,
                                  height: 60,
                                  fit: pw.BoxFit.contain)
                              : pw.SizedBox(height: 60),
                          pw.SizedBox(height: 4),
                          pw.Text(
                            _owner,
                            style: pw.TextStyle(
                                fontSize: 10,
                                fontWeight: pw.FontWeight.bold,
                                color: PdfColors.black),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ];
        },
      ),
    );

    // 4. Save & Open
    final output = await getTemporaryDirectory();
    final file = File('${output.path}/Invoice_${transaction.invoice}.pdf');
    await file.writeAsBytes(await pdf.save());

    await OpenFile.open(file.path);
  }
}
