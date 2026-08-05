import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'config/env_config.dart';
import 'services/dio_client.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/main_layout.dart';
import 'screens/home/beranda_screen.dart';
import 'screens/transactions/transaction_history_screen.dart';
import 'screens/catalog/product_catalog_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'utils/app_navigator.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: ".env");
    EnvConfig.printConfig();
  } catch (e) {
    debugPrint('⚠️ Error loading .env file: $e');
    try {
      await dotenv.load();
    } catch (e) {
      debugPrint('⚠️ Error loading .env from assets: $e');
    }
  }

  DioClient.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      navigatorKey: AppNavigator.navigatorKey,
      initialLocation: '/splash',

      // GLOBAL REDIRECT: Cek authentication state setiap navigasi
      redirect: (context, state) async {
        final authProvider = context.read<AuthProvider>();
        final isLoggedIn =
            authProvider.isAuthenticated && authProvider.isTokenValid();

        final currentPath = state.uri.path;
        final isAuthRoute = currentPath == '/login' || currentPath == '/splash';
        final isGoingToLogin = currentPath == '/login';

        // 1. Jika belum login DAN bukan di route auth → paksa ke login
        if (!isLoggedIn && !isAuthRoute) {
          return '/login';
        }

        // 2. Jika sudah login DAN coba akses /login → redirect ke beranda
        if (isLoggedIn && isGoingToLogin) {
          return '/home';
        }

        // 3. Jika token expired saat di protected route → ke login
        if (authProvider.isAuthenticated &&
            !authProvider.isTokenValid() &&
            !isAuthRoute) {
          return '/login';
        }

        return null;
      },

      routes: [
        GoRoute(
          path: '/splash',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: '/login',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const LoginScreen(),
        ),
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return MainLayout(navigationShell: navigationShell);
          },
          branches: [
            // Branch 0: Transaction Active
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/transactions/active',
                  builder: (context, state) =>
                      const TransactionHistoryScreen(initialTab: 0),
                ),
              ],
            ),

            // Branch 1: Transaction Done
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/transactions/done',
                  builder: (context, state) =>
                      const TransactionHistoryScreen(initialTab: 1),
                ),
              ],
            ),

            // Branch 2: Beranda (default)
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/home',
                  builder: (context, state) => const BerandaScreen(),
                ),
              ],
            ),

            // Branch 3: Product Catalog
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/catalog',
                  builder: (context, state) => const ProductCatalogScreen(),
                ),
              ],
            ),

            // Branch 4: Profile
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/profile',
                  builder: (context, state) => const ProfileScreen(),
                ),
              ],
            ),
          ],
        ),
      ],
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp.router(
        title: EnvConfig.appName,
        debugShowCheckedModeBanner: EnvConfig.appDebug,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            primary: const Color(0xFF4F46E5),
          ),
          useMaterial3: true,
          fontFamily: 'Poppins',
          scaffoldBackgroundColor: const Color(0xFF0F172A),
        ),
        routerConfig: router,
      ),
    );
  }
}
