import 'env_config.dart';

class ApiConfig {
  static String get baseUrl => EnvConfig.currentApiUrl;

  // AUTH
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';

  // ADMIN
  static const String categories = '/admin/product-categories';
  static const String products = '/admin/products';
  static const String productTypes = '/admin/product-types';
  static const String suppliers = '/admin/suppliers';
  static const String transactions = '/admin/transactions';
  static const String users = '/admin/users';
  static const String rolesDropdown = '/admin/roles/dropdown';
  static const String dashboard = '/admin/dashboard';

  // DROPDOWN ENDPOINTS
  static const String categoriesDropdown = '/admin/product-categories/dropdown';
  static const String productTypesDropdown = '/admin/product-types/dropdown';

  // PROFILE
  static const String profile = '/user/me';
  static const String updateProfile = '/user/profile';
  static const String changePassword = '/user/change-password';

  static Map<String, String> getHeaders({String? token}) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Map<String, String> getMultipartHeaders({String? token}) {
    return {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
}
