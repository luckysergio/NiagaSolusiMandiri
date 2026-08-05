import '../config/api_config.dart';
import '../models/product.dart';
import 'dio_client.dart';

class DropdownService {
  static Future<List<Category>> getCategories() async {
    try {
      final response = await DioClient.dio.get(ApiConfig.categoriesDropdown);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final list = data is List ? data : [];
        return list.map((e) => Category.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  static Future<List<ProductType>> getProductTypes({int? categoryId}) async {
    try {
      final params = categoryId != null
          ? {'category_id': categoryId}
          : <String, dynamic>{};
      final response = await DioClient.dio.get(
        ApiConfig.productTypesDropdown,
        queryParameters: params,
      );
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final list = data is List ? data : [];
        return list.map((e) => ProductType.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}
