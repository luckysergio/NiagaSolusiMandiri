import 'env_config.dart';

class ApiConfig {
  // Base URL
  static String get baseUrl => EnvConfig.currentApiUrl;

  // ============================================
  // AUTH ENDPOINTS
  // ============================================
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';
  static const String refresh = '/auth/refresh';

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================
  static const String categories = '/admin/product-categories';
  static const String products = '/admin/products';
  static const String productTypes = '/admin/product-types';
  static const String suppliers = '/admin/suppliers';
  static const String transactions = '/admin/transactions';
  static const String users = '/admin/users';
  static const String dashboard = '/admin/dashboard';

  // ============================================
  // PROFILE ENDPOINTS
  // ============================================
  static const String profile = '/user/me'; // GET - ambil data profile
  static const String updateProfile = '/user/profile'; // PUT - update profile
  static const String changePassword = '/user/change-password'; // POST
  static const String userRoles = '/user/roles';
  static const String switchRole = '/user/switch-role';

  // ============================================
  // HEADERS
  // ============================================
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
