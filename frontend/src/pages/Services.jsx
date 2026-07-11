import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  Building2, 
  Truck, 
  HardHat, 
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Shield,
  Award,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Heart
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
        title="Layanan | Solusi Pompa Beton & Beton Cor Tangerang"
        description="Layanan beton cor readymix, sewa pompa beton, dan jasa finishing floor hardener di Tangerang. Harga kompetitif dan kualitas terjamin."
        canonicalUrl="https://solusipompabeton.com/layanan"
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
            <span className="text-sm font-semibold text-white">LAYANAN KAMI</span>
          </div>

          <h1 data-aos="zoom-in" className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Layanan yang Kami</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              Sediakan untuk Anda
            </span>
          </h1>

          <p data-aos="fade-up" className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Tiga layanan utama untuk mendukung kelancaran proyek konstruksi Anda. 
            Mulai dari penyediaan beton, sewa pompa, hingga finishing lantai.
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi Gratis</span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600 shadow-sm hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Kami</span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /><span className="text-sm">Berpengalaman 10+ Tahun</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /><span className="text-sm">Kualitas Terjamin SNI</span></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /><span className="text-sm">24 Jam Siap Melayani</span></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border border-slate-700/50 hover:border-indigo-500/30"
                >
                  <div className="p-6 border-b border-slate-700/50 text-center">
                    <div className={`w-16 h-16 mx-auto bg-linear-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={service.path}
                      className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:gap-3 transition-all hover:text-indigo-300 w-full justify-center"
                    >
                      Lihat detail
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">KEUNGGULAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Alasan pelanggan mempercayakan proyek mereka kepada kami</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  data-aos="fade-up" 
                  data-aos-delay={idx * 100} 
                  className="flex gap-4 p-5 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-1 text-center sm:text-left"
                >
                  <div className={`w-12 h-12 shrink-0 bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto sm:mx-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">PROSES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cara Kami Bekerja</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Proses kerja sederhana dan transparan untuk kenyamanan Anda</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Konsultasi", desc: "Diskusi kebutuhan dan spesifikasi proyek", icon: MessageCircle },
              { step: "02", title: "Penawaran", desc: "Kami berikan harga dan jadwal pelaksanaan", icon: Target },
              { step: "03", title: "Eksekusi", desc: "Tim kami melakukan pengerjaan sesuai kesepakatan", icon: Zap },
              { step: "04", title: "Serah Terima", desc: "Hasil kerja diperiksa bersama dan diserahkan", icon: Heart }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Informasi yang perlu Anda ketahui sebelum menggunakan layanan kami</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">WILAYAH LAYANAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Melayani Tangerang Raya & Tangerang Selatan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Melayani berbagai perumahan dan kawasan di wilayah Tangerang dengan respon cepat</p>
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

      {/* CTA Section */}
      <section id="contact" className="py-24 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ada pertanyaan atau butuh informasi?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Tim marketing kami siap membantu Anda. Konsultasi awal gratis.
            </p>
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
              <CheckCircle className="w-4 h-4" />
              Konsultasi gratis • Respon cepat • Harga bersaing
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}