import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'config/env_config.dart';
import 'services/dio_client.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/main_layout.dart';
import 'screens/home/beranda_screen.dart';
import 'screens/transactions/active_transactions_screen.dart';
import 'screens/transactions/completed_transactions_screen.dart';
import 'screens/transactions/transaction_form_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/products/products_screen.dart';
import 'screens/products/product_form_screen.dart';
import 'screens/users/user_management_screen.dart';
import 'screens/suppliers/supplier_screen.dart';
import 'screens/categories/category_screen.dart';
import 'screens/product_types/product_type_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'models/product.dart';
import 'models/transaction.dart';
import 'utils/app_navigator.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inisialisasi format tanggal untuk Bahasa Indonesia
  await initializeDateFormatting('id_ID', null);

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
      redirect: (context, state) async {
        final authProvider = context.read<AuthProvider>();
        final isLoggedIn =
            authProvider.isAuthenticated && authProvider.isTokenValid();

        final currentPath = state.uri.path;
        final isAuthRoute = currentPath == '/login' || currentPath == '/splash';
        final isGoingToLogin = currentPath == '/login';

        if (!isLoggedIn && !isAuthRoute) {
          return '/login';
        }

        if (isLoggedIn && isGoingToLogin) {
          return '/home';
        }

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
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/transactions/active',
                  builder: (context, state) => const ActiveTransactionsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/transactions/done',
                  builder: (context, state) =>
                      const CompletedTransactionsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/home',
                  builder: (context, state) => const BerandaScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/products',
                  builder: (context, state) => const ProductsScreen(),
                ),
              ],
            ),
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
        GoRoute(
          path: '/reports',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const DashboardScreen(),
        ),
        GoRoute(
          path: '/products/create',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const ProductFormScreen(),
        ),
        GoRoute(
          path: '/products/edit/:id',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) {
            final product = state.extra as Product?;
            return ProductFormScreen(editingProduct: product);
          },
        ),
        GoRoute(
          path: '/transactions/create',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const TransactionFormScreen(),
        ),
        GoRoute(
          path: '/transactions/edit/:id',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) {
            final transaction = state.extra as Transaction?;
            return TransactionFormScreen(editingTransaction: transaction);
          },
        ),
        GoRoute(
          path: '/users',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const UserManagementScreen(),
        ),
        GoRoute(
          path: '/suppliers',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const SupplierScreen(),
        ),
        GoRoute(
          path: '/product-categories',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const CategoryScreen(),
        ),
        GoRoute(
          path: '/product-types',
          parentNavigatorKey: AppNavigator.navigatorKey,
          builder: (context, state) => const ProductTypeScreen(),
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
