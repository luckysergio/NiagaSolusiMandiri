import 'dart:io';
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/product_type.dart';
import 'dio_client.dart';

class ProductTypeService {
  static Future<Map<String, dynamic>> getAll({
    int page = 1,
    int perPage = 12,
    String? search,
    int? categoryId,
    String? isActive,
  }) async {
    try {
      final params = <String, dynamic>{'page': page, 'per_page': perPage};
      if (search != null && search.isNotEmpty) params['search'] = search;
      if (categoryId != null) params['category_id'] = categoryId;
      if (isActive != null && isActive.isNotEmpty) {
        params['is_active'] = isActive;
      }

      final response = await DioClient.dio.get(
        ApiConfig.productTypes,
        queryParameters: params,
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final meta = response.data['meta'];
        final List<dynamic> rawData =
            data is List ? data : (data['data'] ?? []);
        return {
          'productTypes': rawData.map((e) => ProductType.fromJson(e)).toList(),
          'meta': meta,
        };
      }
      throw Exception('Gagal memuat data jenis produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<ProductType> create(
      Map<String, dynamic> payload, File? imageFile) async {
    try {
      final formData = FormData.fromMap({
        'category_id': payload['category_id'],
        'name': payload['name'],
        if (payload['slug'] != null) 'slug': payload['slug'],
        if (payload['description'] != null)
          'description': payload['description'],
        'sort_order': payload['sort_order'] ?? 0,
        'is_active': payload['is_active'] ? '1' : '0',
        if (imageFile != null)
          'image': await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
      });

      final response =
          await DioClient.dio.post(ApiConfig.productTypes, data: formData);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] ?? response.data;
        return ProductType.fromJson(data);
      }
      throw Exception('Gagal menambahkan jenis produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<ProductType> update(
      int id, Map<String, dynamic> payload, File? imageFile) async {
    try {
      final formData = FormData.fromMap({
        '_method':
            'PUT', // Wajib untuk Laravel spoofing method PUT dengan FormData
        'category_id': payload['category_id'],
        'name': payload['name'],
        if (payload['slug'] != null) 'slug': payload['slug'],
        if (payload['description'] != null)
          'description': payload['description'],
        'sort_order': payload['sort_order'] ?? 0,
        'is_active': payload['is_active'] ? '1' : '0',
        if (imageFile != null)
          'image': await MultipartFile.fromFile(
            imageFile.path,
            filename: imageFile.path.split('/').last,
          ),
      });

      final response = await DioClient.dio
          .post('${ApiConfig.productTypes}/$id', data: formData);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return ProductType.fromJson(data);
      }
      throw Exception('Gagal memperbarui jenis produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> delete(int id) async {
    try {
      await DioClient.dio.delete('${ApiConfig.productTypes}/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<ProductType> toggleActive(int id) async {
    try {
      final response = await DioClient.dio
          .patch('${ApiConfig.productTypes}/$id/toggle-active');
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return ProductType.fromJson(data);
      }
      throw Exception('Gagal mengubah status jenis produk');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<int> getNextSortOrder(int? categoryId) async {
    try {
      final params = categoryId != null
          ? {'category_id': categoryId}
          : <String, dynamic>{};
      final response = await DioClient.dio.get(
        '${ApiConfig.productTypes}/next-sort-order',
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
