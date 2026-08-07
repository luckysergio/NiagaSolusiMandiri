import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/transaction.dart';
import 'dio_client.dart';

class TransactionService {
  static Future<Map<String, dynamic>> getAll({
    int page = 1,
    int perPage = 12,
    String? search,
    String? status,
    String? startDate,
    String? endDate,
    int? userId,
  }) async {
    try {
      final params = <String, dynamic>{'page': page, 'per_page': perPage};
      if (search != null && search.isNotEmpty) params['search'] = search;
      if (status != null && status.isNotEmpty) params['status'] = status;
      if (startDate != null && startDate.isNotEmpty) {
        params['start_date'] = startDate;
      }
      if (endDate != null && endDate.isNotEmpty) params['end_date'] = endDate;
      if (userId != null) params['user_id'] = userId;

      final response = await DioClient.dio.get(
        ApiConfig.transactions,
        queryParameters: params,
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final meta = response.data['meta'];
        final List<dynamic> rawData =
            data is List ? data : (data['data'] ?? []);
        return {
          'transactions': rawData.map((e) => Transaction.fromJson(e)).toList(),
          'meta': meta,
        };
      }
      throw Exception('Gagal memuat data transaksi');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Transaction> getById(int id) async {
    try {
      final response = await DioClient.dio.get('${ApiConfig.transactions}/$id');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Transaction.fromJson(data);
      }
      throw Exception('Gagal memuat detail transaksi');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Transaction> changeStatus(int id, String status) async {
    try {
      final response = await DioClient.dio.patch(
        '${ApiConfig.transactions}/$id/change-status',
        data: {'status': status},
      );
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Transaction.fromJson(data);
      }
      throw Exception('Gagal mengubah status');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> delete(int id) async {
    try {
      await DioClient.dio.delete('${ApiConfig.transactions}/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Transaction> create(Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.post(ApiConfig.transactions, data: payload);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] ?? response.data;
        return Transaction.fromJson(data);
      }
      throw Exception(
          response.data['message'] ?? 'Gagal menambahkan transaksi');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Transaction> update(
      int id, Map<String, dynamic> payload) async {
    try {
      final response = await DioClient.dio
          .put('${ApiConfig.transactions}/$id', data: payload);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Transaction.fromJson(data);
      }
      throw Exception(
          response.data['message'] ?? 'Gagal memperbarui transaksi');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Exception _handleError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      return Exception('Tidak dapat terhubung ke server');
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
    return Exception(e.message ?? 'Terjadi kesalahan');
  }
}
