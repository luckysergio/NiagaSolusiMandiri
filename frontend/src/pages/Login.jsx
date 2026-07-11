import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useModal } from '../contexts/ModalContext';
import logoNsm from '../assets/logo-nsm.png';

const loginSchema = z.object({
  email: z.string()
    .email('Email tidak valid')
    .min(1, 'Email wajib diisi'),
  password: z.string()
    .min(6, 'Password minimal 6 karakter')
    .max(255, 'Password terlalu panjang'),
});

const Login = () => {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { showLoading, closeLoading, showSuccess, showError } = useModal();
  const [isVerifying, setIsVerifying] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (executeRecaptcha) {
      setRecaptchaLoaded(true);
    }
  }, [executeRecaptcha]);

  const onSubmit = async (data) => {
    if (!executeRecaptcha) {
      showError('Login Gagal', 'reCAPTCHA belum siap. Silakan refresh halaman.');
      return;
    }

    try {
      setIsVerifying(true);
      showLoading('Memproses Login...', 'Mohon tunggu sebentar');

      const recaptchaToken = await executeRecaptcha('login');
      
      if (!recaptchaToken) {
        closeLoading();
        showError('Login Gagal', 'Gagal mendapatkan token reCAPTCHA. Silakan coba lagi.');
        setIsVerifying(false);
        return;
      }

      const result = await login(data, recaptchaToken);
      closeLoading();
      
      if (result.success) {
        const userRole = result.user?.role?.toLowerCase();
        
        if (userRole !== 'super_admin' && userRole !== 'superadmin') {
          await logout();
          showError(
            'Akses Ditolak',
            'Hanya Super Admin yang diizinkan mengakses aplikasi ini. Admin dan Sales silakan gunakan aplikasi mobile.'
          );
          return;
        }

        showSuccess(
          'Login Berhasil!',
          'Selamat datang kembali di Niaga Solusi Mandiri',
          () => navigate('/dashboard')
        );
      } else {
        showError('Login Gagal', result.error || 'Email atau password salah.');
      }
    } catch (err) {
      closeLoading();
      const errorMessage = err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.';
      showError('Login Gagal', errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Beton Berkualitas",
      description: "Mutu terjamin"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "Pompa Modern",
      description: "Armada 24 jam"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Tepat Waktu",
      description: "Cepat & profesional"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          {/* Left Side - Brand Info (Desktop Only) */}
          <div className="hidden lg:block space-y-8 animate-fadeIn">
            {/* Logo & Brand */}
            <div className="text-left">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-lg shadow-indigo-500/20 flex items-center justify-center p-2 border border-slate-200">
                  {logoNsm ? (
                    <img 
                      src={logoNsm} 
                      alt="Niaga Solusi Mandiri" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-indigo-600 font-bold text-xl">NSM</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Niaga Solusi Mandiri
                  </h1>
                  <p className="text-slate-400 text-sm">Readymix & Concrete Pump</p>
                </div>
              </div>
              
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Solusi Beton Terpercaya
                <br />
                <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Untuk Proyek Anda
                </span>
              </h2>
              
              <p className="text-slate-300 text-base xl:text-lg leading-relaxed mb-8">
                Supplier beton cor dan penyedia jasa sewa pompa beton berpengalaman lebih dari 10 tahun 
                di industri konstruksi Indonesia. Melayani wilayah Tangerang Raya dan sekitarnya.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-3">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group cursor-default"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-white font-semibold text-xs xl:text-sm">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-xs leading-tight">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto animate-scaleIn">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg shadow-indigo-500/20 mb-3 p-2 border border-slate-200">
                {logoNsm ? (
                  <img 
                    src={logoNsm} 
                    alt="Niaga Solusi Mandiri" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-indigo-600 font-bold text-xl">NSM</span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Selamat Datang</h2>
              <p className="text-slate-400 text-sm">Silakan login untuk melanjutkan</p>
            </div>

            {/* Form Card */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Login</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Masuk ke dashboard admin</p>
              </div>

              {/* reCAPTCHA Status */}
              <div className={`mb-5 px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-500 ${
                recaptchaLoaded 
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}>
                <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
                  recaptchaLoaded ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className="font-medium">
                  {recaptchaLoaded ? '✓ Sistem keamanan aktif' : '⟳ Memuat sistem keamanan...'}
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      {...register('email')}
                      className={`
                        block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-slate-700/50 border rounded-xl 
                        text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base
                        ${errors.email 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500"
                        }
                      `}
                      placeholder="masukkan@email.com"
                      disabled={isSubmitting || isVerifying}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register('password')}
                      className={`
                        block w-full pl-10 pr-12 py-2.5 sm:py-3 bg-slate-700/50 border rounded-xl 
                        text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base
                        ${errors.password 
                          ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500"
                        }
                      `}
                      placeholder="Masukkan password"
                      disabled={isSubmitting || isVerifying}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isVerifying || loading || !recaptchaLoaded}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`
                    w-full py-2.5 sm:py-3 px-4 rounded-xl font-medium text-white transition-all duration-200
                    flex items-center justify-center gap-2 group relative overflow-hidden text-sm sm:text-base
                    ${(isSubmitting || isVerifying || loading || !recaptchaLoaded)
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl transform hover:scale-[1.02]"
                    }
                  `}
                >
                  <div className={`absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-transform duration-700 ${isHovered && !(isSubmitting || isVerifying || loading || !recaptchaLoaded) ? 'translate-x-full' : '-translate-x-full'}`}></div>
                  
                  {(isSubmitting || isVerifying || loading) ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{isVerifying ? 'Verifikasi...' : 'Memproses...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-slate-400 text-xs">
                  © 2026 Niaga Solusi Mandiri. All rights reserved.
                </p>
                <p className="text-slate-500 text-[10px] mt-1">
                  Supplier Beton Cor & Sewa Pompa Beton Tangerang
                </p>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg backdrop-blur-sm border border-slate-700/30">
                <div className="text-base sm:text-xl font-bold text-white">10+</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Tahun</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg backdrop-blur-sm border border-slate-700/30">
                <div className="text-base sm:text-xl font-bold text-white">500+</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Proyek</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-slate-800/30 rounded-lg backdrop-blur-sm border border-slate-700/30">
                <div className="text-base sm:text-xl font-bold text-white">100%</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Puas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;