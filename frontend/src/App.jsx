import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Landing from './pages/Landing';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const BetonReadymix = lazy(() => import('./pages/BetonReadymix'));
const PompaBeton = lazy(() => import('./pages/PompaBeton'));
const JasaFinishing = lazy(() => import('./pages/JasaFinishing'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Users = lazy(() => import('./pages/UserManajemen/User'));
const Roles = lazy(() => import('./pages/RoleManajemen/Roles'));
const Profile = lazy(() => import('./pages/Profile'));
const CategoriesPage = lazy(() => import('./pages/categories/CategoriesPage'));
const ProductTypesPage = lazy(() => import('./pages/product-types/ProductTypesPage'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
const SuppliersPage = lazy(() => import('./pages/suppliers/SuppliersPage'));
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500"></div>
      <p className="text-slate-400 animate-pulse">Memuat halaman...</p>
    </div>
  </div>
);

function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/tentang" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
          <Route path="/layanan" element={<Suspense fallback={<PageLoader />}><Services /></Suspense>} />
          <Route path="/layanan/beton-readymix" element={<Suspense fallback={<PageLoader />}><BetonReadymix /></Suspense>} />
          <Route path="/layanan/pompa-beton" element={<Suspense fallback={<PageLoader />}><PompaBeton /></Suspense>} />
          <Route path="/layanan/jasa-finishing" element={<Suspense fallback={<PageLoader />}><JasaFinishing /></Suspense>} />
          <Route path="/kontak" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
          <Route path="/blog" element={<Suspense fallback={<PageLoader />}><Blog /></Suspense>} />
          <Route path="/blog/:slug" element={<Suspense fallback={<PageLoader />}><BlogDetail /></Suspense>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><Users /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><Roles /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><CategoriesPage /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-types"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><ProductTypesPage /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><ProductsPage /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><SuppliersPage /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><TransactionsPage /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><Profile /></Suspense>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  );
}

export default App;