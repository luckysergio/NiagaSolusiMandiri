import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Truck, 
  CheckCircle, 
  Gauge,
  Ruler,
  Zap,
  Clock,
  Phone,
  MessageCircle,
  Info,
  Shield,
  Users,
  MapPin,
  Award,
  ChevronLeft,
  ChevronRight,
  Building2
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
      duration: 1000,
      once: false,
      offset: 80,
      easing: 'ease-in-out',
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        description="Daftar harga sewa pompa beton berbagai jenis: Standar, Longboom, Super Longboom. Harga sewa per 8 jam. Layanan 24 jam di Tangerang."
        canonicalUrl="https://solusipompabeton.com/layanan/pompa-beton"
      />

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 z-10"></div>
              <img src={img} alt={`Pompa Beton ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <button onClick={goToPreviousImage} className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={goToNextImage} className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto">
            <Truck className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">SEWA POMPA BETON</span>
          </div>

          <h1 data-aos="zoom-in" className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Sewa Pompa Beton</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              Armada Lengkap & Operator Profesional
            </span>
          </h1>

          <p data-aos="fade-up" className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Menyewakan berbagai jenis pompa beton dengan operator berpengalaman untuk kelancaran proyek pengecoran Anda.
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Sewa Sekarang</span>
            </button>
            <button 
              onClick={() => scrollToSection('harga')}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600 shadow-sm hover:scale-105"
            >
              <Info className="w-4 h-4" />
              <span>Lihat Harga</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /><span className="text-sm">Berpengalaman 10+ Tahun</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /><span className="text-sm">Kualitas Terjamin SNI</span></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /><span className="text-sm">24 Jam Siap Melayani</span></div>
          </div>
        </div>
      </section>

      {/* Jenis Pompa Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">JENIS POMPA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Jenis Pompa Beton</h2>
            <p className="text-slate-400">Pilih sesuai kebutuhan proyek Anda</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jenisPompa.map((pompa, idx) => {
              const Icon = pompa.icon;
              return (
                <div 
                  key={idx} 
                  data-aos="fade-up" 
                  data-aos-delay={idx * 100} 
                  className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-xl text-center"
                >
                  <div className={`w-16 h-16 mx-auto bg-linear-to-br ${pompa.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pompa.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{pompa.desc}</p>
                  <p className="text-indigo-400 font-semibold text-sm">Jangkauan: {pompa.jangkauan}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Price Table Section */}
      <section id="harga" className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">HARGA SEWA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Daftar Harga Sewa Pompa Beton</h2>
            <p className="text-slate-400">Harga sewa per 8 jam (1 kali mobilisasi)</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="py-4 px-4 text-center rounded-tl-xl text-sm sm:text-base">Volume</th>
                    <th className="py-4 px-4 text-center text-sm sm:text-base">Standar / Mini</th>
                    <th className="py-4 px-4 text-center text-sm sm:text-base">Longboom</th>
                    <th className="py-4 px-4 text-center rounded-tr-xl text-sm sm:text-base">Super Longboom</th>
                  </tr>
                </thead>
                <tbody>
                  {hargaPompa.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-slate-700/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-700/30'
                      } hover:bg-slate-700/50`}
                    >
                      <td className="py-3 px-4 text-center font-semibold text-white text-sm sm:text-base">{item.volume}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.standar}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.longboom}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.superLongboom}</td>
                    </tr>
                  ))}
                  {hargaPerM3.map((item, idx) => (
                    <tr key={idx} className="bg-indigo-500/10">
                      <td className="py-3 px-4 text-center font-bold text-white text-sm sm:text-base">{item.volume}</td>
                      <td className="py-3 px-4 text-center text-indigo-300 text-sm sm:text-base">{item.standar}</td>
                      <td className="py-3 px-4 text-center text-indigo-300 text-sm sm:text-base">{item.longboom}</td>
                      <td className="py-3 px-4 text-center text-indigo-300 text-sm sm:text-base">{item.superLongboom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div data-aos="fade-up" className="mt-6 p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              <Info className="w-4 h-4 inline mr-1 text-indigo-400" />
              Harga dapat berubah sewaktu-waktu. Hubungi kami untuk harga terbaru dan volume besar.
            </p>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">KEUNGGULAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Keunggulan Sewa Pompa Kami</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Berbagai keunggulan yang membuat layanan sewa pompa kami menjadi pilihan utama</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keunggulan.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-xl text-center"
                >
                  <div className={`w-14 h-14 mx-auto bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Layanan & Wilayah Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div data-aos="fade-right" className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 justify-center lg:justify-start">
                <Zap className="w-6 h-6 text-indigo-400" />
                Layanan Lengkap
              </h2>
              <ul className="space-y-3">
                {[
                  "Operator berpengalaman dan tersertifikasi",
                  "Unit pompa terawat dan berkualitas",
                  "Mobilisasi cepat tepat waktu",
                  "Harga sewa kompetitif",
                  "Layanan 24 jam siap membantu",
                  "Pilihan armada lengkap"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-aos="fade-left" className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="w-6 h-6 text-indigo-400" />
                Wilayah Layanan
              </h2>
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {["Tangerang", "Jakarta", "Bekasi", "Depok", "Bogor", "Serang", "Cilegon", "BSD", "Alam Sutera"].map((city, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-sm border border-slate-700/50">
                    {city}
                  </span>
                ))}
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-sm flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Melayani seluruh wilayah Jabodetabek dan sekitarnya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">WILAYAH LAYANAN DETAIL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Melayani Tangerang Raya & Tangerang Selatan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami melayani berbagai perumahan dan kawasan di wilayah Tangerang dengan respon cepat</p>
          </div>

          <div className="space-y-8">
            {serviceAreas.map((region, regionIdx) => (
              <div key={regionIdx} data-aos="fade-up" data-aos-delay={regionIdx * 100} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{region.region}</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {region.areas.map((area, areaIdx) => (
                    <div 
                      key={areaIdx} 
                      data-aos="zoom-in" 
                      data-aos-delay={areaIdx * 50}
                      className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-700/30 hover:border-indigo-500/30 transition-all hover:bg-slate-700/50"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium text-slate-300">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div data-aos="fade-up" className="mt-8 text-center">
            <p className="text-slate-400 text-sm mb-4">
              <span className="font-semibold text-white">Tidak menemukan wilayah Anda?</span> Hubungi kami untuk konfirmasi ketersediaan layanan.
            </p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-600/25"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi Kami Sekarang</span>
            </button>
          </div>
        </div>
      </section>

      {/* Spesifikasi Teknis */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">SPESIFIKASI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Spesifikasi Teknis</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Standar kualitas yang kami terapkan untuk setiap unit pompa beton</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Kapasitas Standar", value: "80-120 m³/jam" },
              { label: "Kapasitas Longboom", value: "100-150 m³/jam" },
              { label: "Tekanan Maksimal", value: "70-85 bar" },
              { label: "Garansi Operator", value: "100% profesional" }
            ].map((spec, idx) => (
              <div
                key={idx}
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
                className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl text-center border border-slate-700/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="text-xs text-slate-400 mb-1">{spec.label}</div>
                <div className="font-semibold text-white text-sm sm:text-base">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Butuh Sewa Pompa Beton?</h2>
            <p className="text-white/80 text-lg mb-8">Hubungi tim marketing kami untuk konsultasi dan pemesanan</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6281315913559"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Ade SE
              </a>
              <a
                href="https://wa.me/6285780679887"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Zulfikar
              </a>
              <a
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Halaman Kontak
              </a>
            </div>
            <p className="text-white/60 text-sm mt-6 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Konsultasi gratis • Respon cepat • Harga bersaing
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}