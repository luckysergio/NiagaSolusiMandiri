// lib/config/env_config.dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  // ============================================
  // API CONFIGURATION
  // ============================================
  static String get apiUrl =>
      dotenv.env['API_URL'] ?? 'http://10.0.2.2:8000/api';
  static String get apiUrlProduction =>
      dotenv.env['API_URL_PRODUCTION'] ??
      'https://www.betoncortangerang.com/api';

  // ============================================
  // APP CONFIGURATION
  // ============================================
  static String get appName => dotenv.env['APP_NAME'] ?? 'NSM System';
  static String get appEnv => dotenv.env['APP_ENV'] ?? 'development';
  static String get appVersion => dotenv.env['APP_VERSION'] ?? '1.0.0';
  static bool get appDebug => dotenv.env['APP_DEBUG']?.toLowerCase() == 'true';

  // ============================================
  // RECAPTCHA CONFIGURATION
  // ============================================
  static String get recaptchaSiteKey => dotenv.env['RECAPTCHA_SITE_KEY'] ?? '';
  static String get recaptchaSecretKey =>
      dotenv.env['RECAPTCHA_SECRET_KEY'] ?? '';
  static bool get enableRecaptcha =>
      dotenv.env['ENABLE_RECAPTCHA']?.toLowerCase() == 'true';

  // ============================================
  // PUSHER CONFIGURATION
  // ============================================
  static String get pusherKey => dotenv.env['PUSHER_KEY'] ?? '';
  static String get pusherSecret => dotenv.env['PUSHER_SECRET'] ?? '';
  static String get pusherCluster => dotenv.env['PUSHER_CLUSTER'] ?? 'ap1';
  static String get pusherChannel =>
      dotenv.env['PUSHER_CHANNEL'] ?? 'nsm-channel';
  static String get pusherEvent => dotenv.env['PUSHER_EVENT'] ?? 'nsm-event';
  static bool get enablePusher =>
      dotenv.env['ENABLE_PUSHER']?.toLowerCase() == 'true';

  // ============================================
  // CACHE CONFIGURATION
  // ============================================
  static int get cacheStaleTime {
    final time = dotenv.env['CACHE_STALE_TIME'];
    return time != null ? int.tryParse(time) ?? 300000 : 300000;
  }

  static int get cacheCacheTime {
    final time = dotenv.env['CACHE_CACHE_TIME'];
    return time != null ? int.tryParse(time) ?? 600000 : 600000;
  }

  // ============================================
  // LOCALE
  // ============================================
  static String get appLocale => dotenv.env['APP_LOCALE'] ?? 'id';
  static String get appFallbackLocale =>
      dotenv.env['APP_FALLBACK_LOCALE'] ?? 'en';

  // ============================================
  // HELPERS
  // ============================================
  static bool get isDevelopment => appEnv == 'development';
  static bool get isStaging => appEnv == 'staging';
  static bool get isProduction => appEnv == 'production';

  static String get currentApiUrl {
    if (isProduction && apiUrlProduction.isNotEmpty) {
      return apiUrlProduction;
    }
    return apiUrl;
  }

  static String get environmentDisplay {
    switch (appEnv) {
      case 'production':
        return '🚀 Production';
      case 'staging':
        return '🧪 Staging';
      case 'development':
      default:
        return '💻 Development';
    }
  }

  static void printConfig() {}
}
