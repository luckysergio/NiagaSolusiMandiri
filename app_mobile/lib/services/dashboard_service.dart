import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';
import '../config/api_config.dart';
import 'dio_client.dart';

class DashboardService {
  /// Helper aman untuk extract data dari response API
  /// Menangani kasus: response.data = Map, response.data.data = Map/List/null
  static dynamic _extractData(dynamic responseData) {
    if (responseData is Map && responseData.containsKey('data')) {
      return responseData['data'];
    }
    return responseData;
  }

  /// Helper aman untuk convert ke List<Map>
  /// Jika data bukan List, kembalikan list kosong alih-alih crash
  static List<Map<String, dynamic>> _safeToList(dynamic data) {
    if (data == null) return [];
    if (data is List) {
      return data.whereType<Map<String, dynamic>>().toList();
    }
    // Jika data adalah Map tunggal, bungkus dalam list
    if (data is Map<String, dynamic>) {
      return [data];
    }
    return [];
  }

  static Future<Map<String, dynamic>> getStats() async {
    try {
      final response = await DioClient.dio.get(ApiConfig.stats);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractData(response.data);
        // Stats selalu berupa Map, pastikan tidak null
        if (data is Map<String, dynamic>) return data;
        return {};
      }
      throw Exception(
          response.data['message'] ?? 'Gagal memuat statistik dashboard');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getTransactionChart(
      {String period = 'monthly'}) async {
    try {
      final response = await DioClient.dio.get(
        ApiConfig.transactionChart,
        queryParameters: {'period': period},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractData(response.data);
        return _safeToList(data);
      }
      throw Exception(
          response.data['message'] ?? 'Gagal memuat grafik transaksi');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getTopProducts(
      {int limit = 5}) async {
    try {
      final response = await DioClient.dio.get(
        ApiConfig.topProducts,
        queryParameters: {'limit': limit},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractData(response.data);
        return _safeToList(data);
      }
      throw Exception(
          response.data['message'] ?? 'Gagal memuat produk terlaris');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<Map<String, dynamic>>> getRecentTransactions(
      {int limit = 5}) async {
    try {
      final response = await DioClient.dio.get(
        ApiConfig.recentTransactions,
        queryParameters: {'limit': limit},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractData(response.data);
        return _safeToList(data);
      }
      throw Exception(
          response.data['message'] ?? 'Gagal memuat transaksi terbaru');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> exportTransactionsExcel({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await DioClient.dio.get(
        ApiConfig.exportTransactions,
        queryParameters: {
          if (startDate != null) 'start_date': startDate,
          if (endDate != null) 'end_date': endDate,
        },
        options: Options(responseType: ResponseType.bytes),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final bytes = response.data;
        final dir = await getTemporaryDirectory();
        final fileName =
            'Laporan_Transaksi_${DateTime.now().millisecondsSinceEpoch}.xlsx';
        final file = File('${dir.path}/$fileName');
        await file.writeAsBytes(bytes);
        await OpenFile.open(file.path);
      } else {
        throw Exception('Gagal mengunduh file Excel');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Exception _handleError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      return Exception(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    }
    if (e.response != null) {
      final errorData = e.response?.data;
      if (errorData is Map) {
        if (errorData.containsKey('message')) {
          return Exception(errorData['message']);
        }
        if (errorData.containsKey('errors') && errorData['errors'] is Map) {
          final errors = errorData['errors'] as Map;
          if (errors.isNotEmpty) {
            final firstError = errors.values.first;
            if (firstError is List && firstError.isNotEmpty) {
              return Exception(firstError.first);
            }
          }
        }
      }
    }
    return Exception(e.message ?? 'Terjadi kesalahan pada dashboard');
  }
}
