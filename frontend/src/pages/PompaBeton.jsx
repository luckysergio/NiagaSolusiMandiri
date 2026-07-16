import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Truck, CheckCircle, Gauge, Ruler, Zap, Clock, Phone, 
  MessageCircle, Info, Shield, Users, MapPin, Award, 
  ChevronLeft, ChevronRight, Building2, Timer, Wallet, HandMetal
} from 'lucide-react';

// Import pompa beton images
import pompaBetons1 from '../assets/images/pompabeton/1.jpg';
import pompaBetons2 from '../assets/images/pompabeton/2.jpg';
import pompaBetons3 from '../assets/images/pompabeton/3.jpg';
import pompaBetons4 from '../assets/images/pompabeton/4.jpg';
import pompaBetons5 from '../assets/images/pompabeton/5.jpg';
import pompaBetons6 from '../assets/images/pompabeton/6.jpg';
import pompaBetons7 from '../assets/images/pompabeton/7.jpg';
import pompaBetons8 from '../assets/images/pompabeton/8.jpg';

export default function PompaBeton() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [pompaBetons1, pompaBetons2, pompaBetons3, pompaBetons4, pompaBetons5, pompaBetons6, pompaBetons7, pompaBetons8];

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
    AOS.refresh();
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

  // ✅ DATA FILOSOFI 3 HEMAT (Ditekankan secara visual)
  const tigaHemat = [
    {
      icon: Timer,
      title: "Hemat Waktu",
      desc: "Mobilisasi cepat dan operator profesional memastikan proses pengecoran berjalan lancar tanpa hambatan.",
      color: "from-blue-600 to-cyan-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },
    {
      icon: Wallet,
      title: "Hemat Biaya",
      desc: "Harga sewa transparan dan kompetitif, mengoptimalkan anggaran proyek tanpa biaya tersembunyi.",
      color: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400"
    },
    {
      icon: HandMetal,
      title: "Hemat Tenaga",
      desc: "Menggantikan tenaga manual dengan mesin pompa modern, meningkatkan efisiensi dan keselamatan kerja.",
      color: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400"
    }
  ];

  const hargaPompa = [
    { volume: "5 m³ s/d 25 m³", standar: "Rp 4.000.000", longboom: "Rp 5.000.000", superLongboom: "Rp 7.500.000" },
    { volume: "26 m³ s/d 50 m³", standar: "Rp 4.200.000", longboom: "Rp 5.250.000", superLongboom: "Rp 7.750.000" },
    { volume: "51 m³ s/d 75 m³", standar: "Rp 4.400.000", longboom: "Rp 5.500.000", superLongboom: "Rp 8.000.000" },
    { volume: "76 m³ s/d 100 m³", standar: "Rp 4.600.000", longboom: "Rp 5.750.000", superLongboom: "Rp 8.250.000" }
  ];

  const hargaPerM3 = [
    { volume: "Di atas 100 m³", standar: "Rp 45.000/m³", longboom: "Rp 60.000/m³", superLongboom: "Rp 85.000/m³" }
  ];

  const jenisPompa = [
    { name: "Pompa Standar / Mini", icon: Truck, desc: "Cocok untuk proyek dengan akses terbatas", jangkauan: "30-40 meter", gradient: "from-blue-600 to-cyan-600" },
    { name: "Pompa Longboom", icon: Ruler, desc: "Jangkauan lebih jauh untuk proyek besar", jangkauan: "47-50 meter", gradient: "from-purple-600 to-pink-600" },
    { name: "Pompa Super Longboom", icon: Gauge, desc: "Untuk proyek dengan jangkauan ekstra", jangkauan: "50+ meter", gradient: "from-emerald-600 to-teal-600" }
  ];

  const keunggulan = [
    { icon: Users, title: "Operator Berpengalaman", desc: "Tim tersertifikasi dan profesional", gradient: "from-blue-600 to-cyan-600" },
    { icon: Shield, title: "Unit Terawat", desc: "Pompa dalam kondisi prima", gradient: "from-emerald-600 to-teal-600" },
    { icon: Clock, title: "Mobilisasi Cepat", desc: "Tepat waktu sesuai jadwal", gradient: "from-purple-600 to-pink-600" },
    { icon: Zap, title: "Harga Kompetitif", desc: "Sewa dengan harga terbaik", gradient: "from-amber-600 to-orange-600" }
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
        title="Sewa Pompa Beton | Harga & Jenis Pompa Tangerang"
        description="Daftar harga sewa pompa beton berbagai jenis: Standar, Longboom, Super Longboom. Hemat Waktu, Hemat Biaya, Hemat Tenaga. Layanan 24 jam di Tangerang."
        canonicalUrl="https://solusipompabeton.com/layanan/pompa-beton"
      />

      {/* 1. Hero Section - FIXED PADDING & RESPONSIVE */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/90 to-slate-950/70 z-10"></div>
              <img src={img} alt={`Pompa Beton ${index + 1}`} className="w-full h-full object-cover scale-105" loading="eager" />
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
              <Truck className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">SEWA POMPA BETON</span>
            </div>

            <div className="space-y-4 max-w-5xl">
              <h1 data-aos="zoom-in" data-aos-duration="1000" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl">
                <span className="block">Sewa Pompa Beton</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  Armada Lengkap & Operator Profesional
                </span>
              </h1>
            </div>

            <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="800" className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-2">
              Menyewakan berbagai jenis pompa beton dengan operator berpengalaman untuk kelancaran dan efisiensi proyek pengecoran Anda di Tangerang dan sekitarnya.
            </p>

            {/* 3 Hemat Badges in Hero */}
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
                <span>Sewa Sekarang</span>
              </button>
              <button onClick={() => scrollToSection('harga')} className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-slate-600/50 hover:border-indigo-500/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg w-full sm:w-auto">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Lihat Harga</span>
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

      {/* 2. ✅ SECTION KHUSUS: FILOSOFI 3 HEMAT */}
      <section className="py-16 sm:py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 tracking-wide">MENGAPA SEWA POMPA KAMI?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Solusi <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">3 Hemat</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Memilih layanan sewa pompa beton kami adalah keputusan strategis untuk efisiensi proyek Anda dari segala aspek.
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

      {/* 3. Jenis Pompa Section */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">JENIS POMPA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Jenis Pompa Beton</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Pilih armada yang sesuai dengan kebutuhan dan skala proyek Anda</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jenisPompa.map((pompa, idx) => {
              const Icon = pompa.icon;
              return (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="group bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5 text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-linear-to-br ${pompa.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{pompa.name}</h3>
                  <p className="text-slate-400 text-sm sm:text-base mb-3">{pompa.desc}</p>
                  <p className="text-indigo-400 font-bold text-sm sm:text-base">Jangkauan: {pompa.jangkauan}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Price Table Section */}
      <section id="harga" className="py-16 sm:py-24 px-4 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">HARGA SEWA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Daftar Harga Sewa Pompa Beton</h2>
            <p className="text-slate-400 text-sm sm:text-base">Harga sewa per 8 jam (termasuk 1 kali mobilisasi)</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="overflow-x-auto rounded-2xl border border-slate-700/50 shadow-2xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base rounded-tl-2xl">Volume</th>
                  <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base">Standar / Mini</th>
                  <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base">Longboom</th>
                  <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base rounded-tr-2xl">Super Longboom</th>
                </tr>
              </thead>
              <tbody>
                {hargaPompa.map((item, idx) => (
                  <tr key={idx} className={`border-b border-slate-700/50 transition-colors ${idx % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-700/30'} hover:bg-indigo-500/10`}>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-white text-sm sm:text-base">{item.volume}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">{item.standar}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">{item.longboom}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">{item.superLongboom}</td>
                  </tr>
                ))}
                {hargaPerM3.map((item, idx) => (
                  <tr key={idx} className="bg-indigo-500/10 border-t-2 border-indigo-500/30">
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-white text-sm sm:text-base">{item.volume}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-indigo-300 text-sm sm:text-base font-bold">{item.standar}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-indigo-300 text-sm sm:text-base font-bold">{item.longboom}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-indigo-300 text-sm sm:text-base font-bold">{item.superLongboom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div data-aos="fade-up" className="mt-6 p-4 sm:p-6 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
            <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Harga dapat berubah sewaktu-waktu. Hubungi kami untuk <strong className="text-white">harga khusus volume besar</strong> dan ketersediaan di lokasi Anda.</span>
            </p>
          </div>
        </div>
      </section>

      {/* 5. Keunggulan Section */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">KEUNGGULAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Keunggulan Sewa Pompa Kami</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Berbagai keunggulan yang membuat layanan sewa pompa kami menjadi pilihan utama</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {keunggulan.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="group bg-slate-800/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5 text-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Layanan & Spesifikasi Section (Combined) */}
      <section className="py-16 sm:py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div data-aos="fade-right" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">LAYANAN LENGKAP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">Layanan & Spesifikasi</h2>
              <ul className="space-y-3 sm:space-y-4 mb-8">
                {[
                  "Operator berpengalaman dan tersertifikasi",
                  "Unit pompa terawat dan berkualitas tinggi",
                  "Mobilisasi cepat tepat waktu sesuai jadwal",
                  "Harga sewa kompetitif dan transparan",
                  "Layanan 24 jam siap membantu kebutuhan Anda",
                  "Pilihan armada lengkap dari Mini hingga Super Longboom"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Kapasitas Standar", value: "80-120 m³/jam" },
                  { label: "Kapasitas Longboom", value: "100-150 m³/jam" },
                  { label: "Tekanan Maksimal", value: "70-85 bar" },
                  { label: "Garansi Operator", value: "100% profesional" }
                ].map((spec, idx) => (
                  <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 100} className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl text-center border border-slate-800 hover:border-indigo-500/30 transition-all">
                    <div className="text-xs text-slate-400 mb-1">{spec.label}</div>
                    <div className="font-bold text-white text-sm sm:text-base">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">WILAYAH LAYANAN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">Jangkauan Luas</h2>
              <p className="text-slate-400 mb-6 text-sm sm:text-base leading-relaxed">
                Kami melayani berbagai perumahan dan kawasan di wilayah Tangerang dan sekitarnya dengan respon cepat dan pengiriman tepat waktu.
              </p>
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {["Tangerang", "Jakarta", "Bekasi", "Depok", "Bogor", "Serang", "Cilegon", "BSD", "Alam Sutera"].map((city, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg text-sm border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800 transition-all">
                    {city}
                  </span>
                ))}
              </div>
              <div className="p-4 sm:p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Melayani seluruh wilayah Jabodetabek dan sekitarnya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Service Area Detail Section */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">WILAYAH LAYANAN DETAIL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Melayani Tangerang Raya & Sekitarnya</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Respon cepat dan pengiriman tepat waktu ke berbagai kawasan strategis</p>
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

      {/* 8. Contact Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
              Butuh Sewa Pompa Beton?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Hubungi tim marketing kami untuk konsultasi kebutuhan armada, estimasi volume, dan penawaran harga terbaik untuk proyek Anda.
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
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Konsultasi gratis • Respon cepat • Harga bersaing
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}