import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Building2, 
  Truck, 
  HardHat, 
  Award, 
  Clock, 
  Shield,
  ThumbsUp,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Heart,
  Target,
  Eye,
  Zap,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
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

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 80,
      easing: 'ease-in-out',
      delay: 0,
    });
    AOS.refresh();
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

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

  const stats = [
    { number: "10+", label: "Tahun Pengalaman", icon: Calendar, gradient: "from-blue-600 to-cyan-600" },
    { number: "500+", label: "Proyek Selesai", icon: Building2, gradient: "from-emerald-600 to-teal-600" },
    { number: "50+", label: "Unit Pompa", icon: Truck, gradient: "from-purple-600 to-pink-600" },
    { number: "100%", label: "Kepuasan Klien", icon: Heart, gradient: "from-rose-600 to-orange-600" }
  ];

  const advantages = [
    { icon: Shield, title: "Armada Lengkap", desc: "Berbagai kapasitas pompa beton siap pakai untuk proyek Anda", color: "from-indigo-600 to-blue-600" },
    { icon: Award, title: "Operator Berpengalaman", desc: "Tim profesional tersertifikasi dengan pengalaman lapangan", color: "from-emerald-600 to-teal-600" },
    { icon: TrendingUp, title: "Harga Kompetitif", desc: "Penawaran terbaik dengan kualitas premium", color: "from-amber-600 to-orange-600" },
    { icon: Clock, title: "Layanan 24/7", desc: "Siap melayani kebutuhan darurat kapan pun", color: "from-purple-600 to-pink-600" },
    { icon: ThumbsUp, title: "Maintenance Rutin", desc: "Unit selalu dalam kondisi prima dan terawat", color: "from-cyan-600 to-blue-600" },
    { icon: Users, title: "Tim Profesional", desc: "Berpengalaman dan berdedikasi tinggi", color: "from-rose-600 to-red-600" }
  ];

  const values = [
    { icon: Target, title: "Integritas", desc: "Bekerja dengan jujur, transparan, dan bertanggung jawab" },
    { icon: Heart, title: "Kepuasan Pelanggan", desc: "Prioritas utama dalam setiap proyek yang kami tangani" },
    { icon: Zap, title: "Inovasi", desc: "Terus berkembang mengikuti teknologi konstruksi terkini" },
    { icon: Users, title: "Kolaborasi", desc: "Membangun kemitraan jangka panjang yang saling menguntungkan" }
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
        title="Tentang Kami | Solusi Pompa Beton & Niaga Solusi Mandiri"
        description="Berpengalaman lebih dari 10 tahun dalam penyewaan pompa beton dan supplier beton cor di Tangerang. Didukung armada modern dan operator tersertifikasi."
        canonicalUrl="https://solusipompabeton.com/tentang"
      />
      
      {/* Hero Section with Carousel */}
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
              <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
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
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">TENTANG KAMI</span>
          </div>

          <h1 data-aos="zoom-in" className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Mitra Terpercaya untuk</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              Proyek Konstruksi Anda
            </span>
          </h1>

          <p data-aos="fade-up" className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Niaga Solusi Mandiri hadir sebagai solusi lengkap kebutuhan beton cor dan sewa pompa beton di Tangerang dan sekitarnya
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
            >
              <span>Hubungi Kami</span>
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600 shadow-sm hover:scale-105"
            >
              <span>Lihat Layanan</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /><span className="text-sm">Berpengalaman 10+ Tahun</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /><span className="text-sm">Kualitas Terjamin SNI</span></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /><span className="text-sm">24 Jam Siap Melayani</span></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl text-center border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className={`w-16 h-16 mx-auto bg-linear-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <HardHat className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">PROFIL PERUSAHAAN</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Niaga Solusi Mandiri
              </h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Kami adalah <strong className="text-white">supplier beton cor Tangerang</strong> dan penyedia 
                <strong className="text-white"> jasa sewa pompa beton</strong> yang telah berpengalaman lebih dari 10 tahun 
                dalam industri konstruksi di Indonesia.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Berkomitmen untuk mendukung kesuksesan proyek konstruksi Anda dengan armada modern, 
                operator profesional, dan pelayanan terbaik.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Kami melayani wilayah <strong className="text-white">Tangerang Raya dan Tangerang Selatan</strong>, 
                dengan dukungan tim yang siap membantu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg shadow-indigo-600/25"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi Kami
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-600 transition-all hover:scale-105"
                >
                  Lihat Layanan
                </button>
              </div>
            </div>

            <div data-aos="fade-left" className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Target className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Visi</h3>
                  <p className="text-sm text-slate-400">Menjadi mitra terpercaya dalam penyediaan solusi konstruksi terbaik di Indonesia</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Misi</h3>
                  <p className="text-sm text-slate-400">Memberikan layanan terbaik dengan kualitas premium dan harga kompetitif</p>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Komitmen</h3>
                  <p className="text-sm text-slate-400">Kepuasan pelanggan adalah prioritas utama kami</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 text-center">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Star className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Kualitas</h3>
                  <p className="text-sm text-slate-400">Standar tertinggi untuk setiap proyek yang kami tangani</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="services" className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">KEUNGGULAN KAMI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Berbagai keunggulan yang membuat kami menjadi pilihan tepat untuk proyek konstruksi Anda</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-xl text-center"
                >
                  <div className={`w-14 h-14 mx-auto bg-linear-to-br ${adv.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{adv.title}</h3>
                  <p className="text-slate-400 text-sm">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Heart className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">NILAI KAMI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Nilai-Nilai Perusahaan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Prinsip yang menjadi landasan kami dalam memberikan layanan terbaik</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  data-aos="flip-left"
                  data-aos-delay={idx * 100}
                  className="text-center group bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2"
                >
                  <div className="w-16 h-16 mx-auto bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-400">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">WILAYAH LAYANAN</span>
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
              <span className="font-semibold text-white">Tidak menemukan wilayah Anda?</span> Hubungi kami untuk konfirmasi ketersediaan layanan di area Anda.
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

      {/* CTA Section */}
      <section id="contact" className="py-24 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siap Memulai Proyek Konstruksi Anda?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Konsultasikan kebutuhan proyek Anda dengan tim profesional kami
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6281315913559"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Konsultasi Gratis
              </a>
              <a
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </a>
            </div>
            <p className="text-white/60 text-sm mt-6 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Respon cepat • Harga bersaing • Kualitas terjamin
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}