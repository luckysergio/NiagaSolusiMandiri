import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/UserManajemen/User';
import Roles from './pages/RoleManajemen/Roles';
import Profile from './pages/Profile';

import About from './pages/About';
import Services from './pages/Services';
import BetonReadymix from './pages/BetonReadymix';
import PompaBeton from './pages/PompaBeton';
import JasaFinishing from './pages/JasaFinishing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ModalProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tentang" element={<About />} />
              <Route path="/layanan" element={<Services />} />
              <Route path="/layanan/beton-readymix" element={<BetonReadymix />} />
              <Route path="/layanan/pompa-beton" element={<PompaBeton />} />
              <Route path="/layanan/jasa-finishing" element={<JasaFinishing />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              {/* Protected Routes - Hanya untuk Super Admin */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Users />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Roles />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback - Redirect ke Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;