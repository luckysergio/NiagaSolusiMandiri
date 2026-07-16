import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Building2, Truck, HardHat, ArrowRight, CheckCircle, Clock, 
  MapPin, Phone, MessageCircle, Shield, Award, Users, Info, 
  ChevronLeft, ChevronRight, Zap, Target, Heart, Timer, Wallet, HandMetal
} from 'lucide-react';

// Import hero images
import img1 from '../assets/images/header/1.jpg';
import img2 from '../assets/images/header/2.jpg';
import img3 from '../assets/images/header/3.jpg';
import img4 from '../assets/images/header/4.jpg';
import img5 from '../assets/images/header/5.jpg';
import img6 from '../assets/images/header/6.jpg';
import img7 from '../assets/images/header/7.jpg';
import img8 from '../assets/images/header/8.jpg';
import img9 from '../assets/images/header/9.jpg';
import img10 from '../assets/images/header/10.jpg';

export default function Services() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  // ✅ OPTIMASI AOS: Inisialisasi sekali dan refresh setelah window load
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
    
    const handleLoad = () => AOS.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  }, [heroImages.length]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  const goToImage = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) goToNextImage();
      else goToPreviousImage();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const tigaHemat = [
    {
      icon: Timer,
      title: "Hemat Waktu",
      desc: "Proses terintegrasi dari supply beton, pompa, hingga finishing, memangkas waktu tunggu antar vendor secara signifikan.",
      color: "from-blue-600 to-cyan-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },
    {
      icon: Wallet,
      title: "Hemat Biaya",
      desc: "Paket layanan terpadu dengan harga kompetitif, menghilangkan biaya koordinasi dan markup ganda dari berbagai pihak.",
      color: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400"
    },
    {
      icon: HandMetal,
      title: "Hemat Tenaga",
      desc: "Satu pintu untuk semua kebutuhan konstruksi lantai Anda, memudahkan manajemen proyek dan mengurangi beban kerja.",
      color: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400"
    }
  ];

  const services = [
    {
      id: "beton-readymix",
      title: "Beton Cor Readymix",
      icon: Building2,
      gradient: "from-blue-600 to-cyan-600",
      description: "Beton cor siap pakai untuk berbagai kebutuhan konstruksi. Tersedia pilihan mutu dari K125 hingga K500 sesuai spesifikasi proyek Anda.",
      features: [
        "Pilihan mutu lengkap K125 - K500",
        "Tersedia mobil minimix dan standar",
        "Kualitas terjamin sesuai standar SNI",
        "Pengiriman tepat waktu"
      ],
      path: "/layanan/beton-readymix"
    },
    {
      id: "pompa-beton",
      title: "Sewa Pompa Beton",
      icon: Truck,
      gradient: "from-purple-600 to-pink-600",
      description: "Menyewakan pompa beton dengan berbagai ukuran untuk memudahkan proses pengecoran di lokasi proyek Anda.",
      features: [
        "Pompa standar untuk akses terbatas",
        "Pompa longboom jangkauan lebih jauh",
        "Pompa super longboom untuk area luas",
        "Dengan operator berpengalaman"
      ],
      path: "/layanan/pompa-beton"
    },
    {
      id: "jasa-finishing",
      title: "Jasa Finishing Lantai",
      icon: HardHat,
      gradient: "from-emerald-600 to-teal-600",
      description: "Jasa finishing lantai beton untuk menghasilkan permukaan yang rata, halus, dan siap pakai dengan kualitas premium.",
      features: [
        "Jasa trowel untuk lantai beton",
        "Floor hardener natural atau warna",
        "Menggunakan bahan Sika/Fosroc",
        "Hasil rapi dan tahan lama"
      ],
      path: "/layanan/jasa-finishing"
    }
  ];

  const advantages = [
    { icon: Clock, title: "Layanan Fleksibel", desc: "Menyesuaikan jadwal sesuai kebutuhan proyek Anda", gradient: "from-blue-600 to-cyan-600" },
    { icon: MapPin, title: "Jangkauan Luas", desc: "Melayani Tangerang Raya dan sekitarnya", gradient: "from-emerald-600 to-teal-600" },
    { icon: Users, title: "Tim Berpengalaman", desc: "Tenaga profesional yang mengerti kebutuhan konstruksi", gradient: "from-purple-600 to-pink-600" },
    { icon: Shield, title: "Kualitas Terjaga", desc: "Material dan peralatan dalam kondisi prima", gradient: "from-amber-600 to-orange-600" },
    { icon: Award, title: "Harga Bersaing", desc: "Penawaran terbaik dengan kualitas premium", gradient: "from-rose-600 to-red-600" },
    { icon: Phone, title: "Konsultasi Mudah", desc: "Tim marketing siap membantu 24/7", gradient: "from-indigo-600 to-purple-600" }
  ];

  const faqs = [
    { q: "Apakah melayani proyek skala kecil?", a: "Ya, kami melayani proyek dari skala kecil hingga besar. Bahkan untuk volume di bawah 5 m³ pun tetap kami layani dengan harga kompetitif." },
    { q: "Berapa lama waktu respon?", a: "Tim marketing kami biasanya merespon dalam waktu kurang dari 10 menit di jam kerja. Untuk konsultasi di luar jam kerja, akan direspon keesokan harinya." },
    { q: "Apakah bisa survey lokasi terlebih dahulu?", a: "Tentu, tim kami dapat melakukan survey lokasi untuk memberikan rekomendasi yang tepat sesuai kondisi proyek Anda. Survey gratis tanpa biaya." },
    { q: "Apakah ada biaya konsultasi?", a: "Konsultasi awal kami berikan gratis. Anda bisa diskusi terlebih dahulu tanpa ada kewajiban apapun." }
  ];

  const serviceAreas = [
    {
      region: "Tangerang Raya",
      areas: ["BSD City", "Alam Sutera", "Gading Serpong", "Bintaro Jaya", "Pondok Aren", "Ciputat", "Pamulang", "Serpong", "Cisauk"]
    },
    {
      region: "Tangerang Selatan",
      areas: ["BSD", "Bintaro", "Pondok Aren", "Ciputat Timur", "Pamulang Barat", "Serpong Utara", "Setu", "Jurang Mangu"]
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Layanan Kami | Beton Cor Readymix & Sewa Pompa Beton Tangerang"
        description="Layanan beton cor readymix, sewa pompa beton, dan jasa finishing floor hardener di Tangerang. Hemat Waktu, Hemat Biaya, Hemat Tenaga."
        canonicalUrl="https://betoncortangerang.com/layanan"
      />

      <main className="overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/90 to-slate-950/70 z-10"></div>
                <img 
                  src={img} 
                  alt={`Hero background ${index + 1}`} 
                  className="w-full h-full object-cover scale-105" 
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
            ))}
          </div>

          <button onClick={goToPreviousImage} className="absolute left-4 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group" aria-label="Previous image">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={goToNextImage} className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group" aria-label="Next image">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
              <div data-aos="fade-down" data-aos-duration="800" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/20">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">LAYANAN KAMI</span>
              </div>

              <div className="space-y-4 max-w-5xl">
                <h1 data-aos="zoom-in" data-aos-duration="1000" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
                  <span className="block">Layanan yang Kami</span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                    Sediakan untuk Anda
                  </span>
                </h1>
              </div>

              <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="800" className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-2">
                Tiga layanan utama untuk mendukung kelancaran proyek konstruksi Anda. Mulai dari penyediaan beton, sewa pompa, hingga finishing lantai.
              </p>

              <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="800" className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {tigaHemat.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 ${item.bg} border ${item.border} rounded-lg sm:rounded-xl ${item.text} text-xs sm:text-sm font-bold backdrop-blur-md hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{item.title}</span>
                      <span className="sm:hidden">{item.title.split(" ")[1]}</span>
                    </div>
                  );
                })}
              </div>

              <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="800" className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
                <button onClick={() => scrollToSection('contact')} className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Konsultasi Gratis</span>
                </button>
                <button onClick={() => scrollToSection('contact')} className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-slate-600/50 hover:border-indigo-500/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg w-full sm:w-auto">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Hubungi Kami</span>
                </button>
              </div>

              <div data-aos="fade-up" data-aos-delay="500" data-aos-duration="800" className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 w-full max-w-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-medium">10+ Tahun</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-xs sm:text-sm font-medium">SNI</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className="text-xs sm:text-sm font-medium">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SECTION KHUSUS: FILOSOFI 3 HEMAT */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300 tracking-wide">NILAI TAMBAH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Solusi Terpadu <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">3 Hemat</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Menggabungkan supply beton, pompa, dan finishing dalam satu atap memberikan efisiensi maksimal untuk proyek Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {tigaHemat.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 150} className={`relative group bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${item.border} hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}>
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    <div className="relative z-10">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${item.bg} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.text}`} />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Services Grid */}
        <section className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">LAYANAN UTAMA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Solusi Konstruksi Lengkap</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Pilih layanan yang sesuai dengan kebutuhan spesifik proyek Anda</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-700/50 hover:border-indigo-500/40 flex flex-col">
                    <div className="p-6 sm:p-8 border-b border-slate-700/50 text-center flex-1">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-linear-to-br ${service.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{service.description}</p>
                    </div>
                    <div className="p-6 sm:p-8 bg-slate-800/60">
                      <div className="space-y-3 mb-6">
                        {service.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link to={service.path} className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-700/50 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-600 hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Why Choose Us */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">KEUNGGULAN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Mengapa Memilih Kami?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Alasan pelanggan mempercayakan proyek mereka kepada kami</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {advantages.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="flex gap-4 p-5 sm:p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                    <div className={`w-12 h-12 shrink-0 bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">PROSES KERJA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Cara Kami Bekerja</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Proses kerja sederhana dan transparan untuk kenyamanan Anda</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { step: "01", title: "Konsultasi", desc: "Diskusi kebutuhan dan spesifikasi proyek", icon: MessageCircle },
                { step: "02", title: "Penawaran", desc: "Kami berikan harga dan jadwal pelaksanaan", icon: Target },
                { step: "03", title: "Eksekusi", desc: "Tim kami melakukan pengerjaan sesuai kesepakatan", icon: Zap },
                { step: "04", title: "Serah Terima", desc: "Hasil kerja diperiksa bersama dan diserahkan", icon: Heart }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="text-center group p-4 sm:p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                    <div className="relative mb-4 sm:mb-5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {item.step}
                      </div>
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                    </div>
                    <h3 className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">FAQ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Informasi yang perlu Anda ketahui sebelum menggunakan layanan kami</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} className="bg-slate-900/60 backdrop-blur-sm p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300">
                  <h3 className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg">{faq.q}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Service Area Section */}
        <section className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">WILAYAH LAYANAN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Melayani Tangerang Raya & Sekitarnya</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Respon cepat dan pengerjaan tepat waktu ke berbagai kawasan strategis</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {serviceAreas.map((region, regionIdx) => (
                <div key={regionIdx} data-aos="fade-up" data-aos-delay={regionIdx * 100} className="bg-slate-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="p-2.5 sm:p-3 bg-indigo-500/10 rounded-lg sm:rounded-xl">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{region.region}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {region.areas.map((area, areaIdx) => (
                      <div key={areaIdx} data-aos="zoom-in" data-aos-delay={areaIdx * 50} className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-slate-900 rounded-lg sm:rounded-xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-slate-300">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div data-aos="fade-up" className="mt-8 sm:mt-12 text-center">
              <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                <span className="font-semibold text-white">Tidak menemukan wilayah Anda?</span> Hubungi kami untuk konfirmasi ketersediaan layanan.
              </p>
              <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-600/25">
                <MessageCircle className="w-5 h-5" />
                <span>Hubungi Kami Sekarang</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section id="contact" className="py-16 sm:py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
                Ada pertanyaan atau butuh informasi?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                Tim marketing kami siap membantu Anda. Konsultasi awal gratis untuk memastikan solusi terbaik bagi proyek Anda.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
                <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/25">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Ade SE
                </a>
                <a href="https://wa.me/6285780679887" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/25">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Zulfikar
                </a>
                <a href="/kontak" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all hover:scale-105 border border-slate-700">
                  <Phone className="w-5 h-5" />
                  Halaman Kontak
                </a>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                Konsultasi gratis • Respon cepat • Harga bersaing
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}