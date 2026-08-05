import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/product.dart';
import 'dio_client.dart';

class ProductService {
  static Future<Map<String, dynamic>> getAll({
    int page = 1,
    int perPage = 12,
    String? search,
    int? categoryId,
    int? productTypeId,
    String? isActive,
    String? featured,
  }) async {
    try {
      final params = <String, dynamic>{
        'page': page,
        'per_page': perPage,
      };
      if (search != null && search.isNotEmpty) {
        params['search'] = search;
      }
      if (categoryId != null) {
        params['category_id'] = categoryId;
      }
      if (productTypeId != null) {
        params['product_type_id'] = productTypeId;
      }
      if (isActive != null && isActive.isNotEmpty) {
        params['is_active'] = isActive;
      }
      if (featured != null && featured.isNotEmpty) {
        params['featured'] = featured;
      }

      final response = await DioClient.dio.get(
        ApiConfig.products,
        queryParameters: params,
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final meta = response.data['meta'];
        final List<dynamic> rawData =
            data is List ? data : (data['data'] ?? []);
        return {
          'products': rawData.map((e) => Product.fromJson(e)).toList(),
          'meta': meta,
        };
      }
      throw Exception('Gagal memuat produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Product> getById(int id) async {
    try {
      final response = await DioClient.dio.get('${ApiConfig.products}/$id');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Product.fromJson(data);
      }
      throw Exception('Gagal memuat detail produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Product> create(Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.post(ApiConfig.products, data: payload);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] ?? response.data;
        return Product.fromJson(data);
      }
      throw Exception('Gagal menambahkan produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Product> update(int id, Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.put('${ApiConfig.products}/$id', data: payload);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Product.fromJson(data);
      }
      throw Exception('Gagal memperbarui produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> delete(int id) async {
    try {
      await DioClient.dio.delete('${ApiConfig.products}/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Product> toggleActive(int id) async {
    try {
      final response =
          await DioClient.dio.patch('${ApiConfig.products}/$id/toggle-active');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Product.fromJson(data);
      }
      throw Exception('Gagal mengubah status');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<Product> toggleFeatured(int id) async {
    try {
      final response = await DioClient.dio
          .patch('${ApiConfig.products}/$id/toggle-featured');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return Product.fromJson(data);
      }
      throw Exception('Gagal mengubah featured');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<int> getNextSortOrder({int? productTypeId}) async {
    try {
      final params = productTypeId != null
          ? {'product_type_id': productTypeId}
          : <String, dynamic>{};
      final response = await DioClient.dio.get(
        '${ApiConfig.products}/next-sort-order',
        queryParameters: params,
      );
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return data['next_sort_order'] ?? 1;
      }
      return 1;
    } catch (_) {
      return 1;
    }
  }

  static Future<String> generateCode(int productTypeId, String name) async {
    try {
      final response = await DioClient.dio.get(
        '${ApiConfig.products}/generate-code',
        queryParameters: {'product_type_id': productTypeId, 'name': name},
      );
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return data['code'] ?? '';
      }
      return '';
    } catch (_) {
      return '';
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
