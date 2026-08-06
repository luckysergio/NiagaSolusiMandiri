import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/category.dart';
import 'dio_client.dart';

class CategoryService {
  static Future<Map<String, dynamic>> getAll({
    int page = 1,
    int perPage = 12,
    String? search,
    String? isActive,
  }) async {
    try {
      final params = <String, dynamic>{'page': page, 'per_page': perPage};
      if (search != null && search.isNotEmpty) params['search'] = search;
      if (isActive != null && isActive.isNotEmpty) {
        params['is_active'] = isActive;
      }

      final response = await DioClient.dio.get(
        ApiConfig.categories,
        queryParameters: params,
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final meta = response.data['meta'];
        final List<dynamic> rawData =
            data is List ? data : (data['data'] ?? []);
        return {
          'categories': rawData.map((e) => Category.fromJson(e)).toList(),
          'meta': meta,
        };
      }
      throw Exception('Gagal memuat data kategori');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Category> create(Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.post(ApiConfig.categories, data: payload);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] ?? response.data;
        return Category.fromJson(data);
      }
      throw Exception('Gagal menambahkan kategori');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Category> update(int id, Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.put('${ApiConfig.categories}/$id', data: payload);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Category.fromJson(data);
      }
      throw Exception('Gagal memperbarui kategori');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> delete(int id) async {
    try {
      await DioClient.dio.delete('${ApiConfig.categories}/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Category> toggleActive(int id) async {
    try {
      final response = await DioClient.dio
          .patch('${ApiConfig.categories}/$id/toggle-active');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Category.fromJson(data);
      }
      throw Exception('Gagal mengubah status kategori');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<int> getNextSortOrder() async {
    try {
      final response =
          await DioClient.dio.get('${ApiConfig.categories}/next-sort-order');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return data['next_sort_order'] ?? 1;
      }
      return 1;
    } catch (_) {
      return 1;
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
