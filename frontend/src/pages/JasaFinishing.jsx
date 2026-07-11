import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  HardHat, 
  CheckCircle, 
  Brush,
  PaintBucket,
  Award,
  Clock,
  Phone,
  MessageCircle,
  Info,
  Sparkles,
  Shield,
  Zap,
  Ruler,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2
} from 'lucide-react';

// Import trowel images
import trowel1 from '../assets/images/trowel/1.jpg';

export default function JasaFinishing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [trowel1];

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
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const goToNextImage = useCallback(() => {
    if (heroImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }
  }, [heroImages.length]);

  const goToPreviousImage = useCallback(() => {
    if (heroImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
    }
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
    if (heroImages.length <= 1) return;
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

  const hargaFinishing = [
    { dosis: "3 Kg/m²", naturalLokal: "Rp 30.000/m²", warnaLokal: "Rp 40.000/m²", naturalSika: "Rp 40.000/m²", warnaSika: "Rp 50.000/m²" },
    { dosis: "5 Kg/m²", naturalLokal: "Rp 40.000/m²", warnaLokal: "Rp 50.000/m²", naturalSika: "Rp 50.000/m²", warnaSika: "Rp 60.000/m²" }
  ];

  const jasaTrowel = { jasa: "Jasa Trowel", harga: "Rp 12.000/m²" };

  const keunggulan = [
    { icon: Sparkles, title: "Hasil Premium", desc: "Rata, halus, dan tahan lama", gradient: "from-blue-600 to-cyan-600" },
    { icon: Shield, title: "Bahan Berkualitas", desc: "Menggunakan Sika/Fosroc", gradient: "from-emerald-600 to-teal-600" },
    { icon: Award, title: "Tenaga Profesional", desc: "Berpengalaman dan terlatih", gradient: "from-purple-600 to-pink-600" },
    { icon: Zap, title: "Pengerjaan Cepat", desc: "Rapi dan tepat waktu", gradient: "from-amber-600 to-orange-600" },
    { icon: Clock, title: "Garansi Kepuasan", desc: "Hasil kerja terjamin", gradient: "from-rose-600 to-red-600" },
    { icon: Ruler, title: "Harga Kompetitif", desc: "Bersaing dan transparan", gradient: "from-indigo-600 to-purple-600" }
  ];

  const aplikasiFinishing = [
    "Gudang dan pabrik",
    "Parkiran gedung bertingkat",
    "Lantai showroom",
    "Area loading dock",
    "Lantai rumah sakit",
    "Lantai supermarket"
  ];

  const prosesPengerjaan = [
    { step: "01", title: "Konsultasi", desc: "Diskusi kebutuhan dan spesifikasi", icon: MessageCircle },
    { step: "02", title: "Survey Lokasi", desc: "Tim kami survey area yang akan dikerjakan", icon: MapPin },
    { step: "03", title: "Pengerjaan", desc: "Proses finishing dengan tenaga profesional", icon: HardHat },
    { step: "04", title: "Quality Control", desc: "Pengecekan hasil akhir", icon: CheckCircle }
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
        title="Jasa Finishing Lantai | Floor Hardener & Trowel Tangerang"
        description="Jasa finishing lantai beton, floor hardener, dan trowel. Harga mulai Rp 12.000/m². Menggunakan bahan Sika/Fosroc berkualitas."
        canonicalUrl="https://solusipompabeton.com/layanan/jasa-finishing"
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
              <img src={img} alt={`Finishing Trowel`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {heroImages.length > 1 && (
          <>
            <button onClick={goToPreviousImage} className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button onClick={goToNextImage} className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentImageIndex ? 'w-8 h-1.5 bg-white' : 'w-2 h-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto">
            <HardHat className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">JASA FINISHING</span>
          </div>

          <h1 data-aos="zoom-in" className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Jasa Finishing &</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              Floor Hardener Profesional
            </span>
          </h1>

          <p data-aos="fade-up" className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Layanan finishing lantai beton dengan hasil rata, halus, dan tahan lama. Menggunakan bahan berkualitas untuk hasil maksimal.
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pesan Sekarang</span>
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

      {/* Price Table Section */}
      <section id="harga" className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Info className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">HARGA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Daftar Harga Floor Hardener</h2>
            <p className="text-slate-400">Harga per meter persegi (m²)</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100" className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="py-4 px-4 text-center rounded-tl-xl text-sm sm:text-base">Dosis</th>
                    <th className="py-4 px-4 text-center text-sm sm:text-base">Natural Lokal</th>
                    <th className="py-4 px-4 text-center text-sm sm:text-base">Warna Lokal</th>
                    <th className="py-4 px-4 text-center text-sm sm:text-base">Sika Natural</th>
                    <th className="py-4 px-4 text-center rounded-tr-xl text-sm sm:text-base">Sika Warna</th>
                  </tr>
                </thead>
                <tbody>
                  {hargaFinishing.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-slate-700/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-700/30'
                      } hover:bg-slate-700/50`}
                    >
                      <td className="py-3 px-4 text-center font-semibold text-white text-sm sm:text-base">{item.dosis}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.naturalLokal}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.warnaLokal}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.naturalSika}</td>
                      <td className="py-3 px-4 text-center text-slate-300 text-sm sm:text-base">{item.warnaSika}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="150" className="mt-6">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <Brush className="w-5 h-5" />
                  <span className="font-semibold">{jasaTrowel.jasa}</span>
                </div>
                <div className="text-2xl font-bold">{jasaTrowel.harga}</div>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" className="mt-4 p-4 bg-slate-800/50 rounded-xl text-center border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              <Info className="w-4 h-4 inline mr-1 text-indigo-400" />
              Harga dapat berubah sewaktu-waktu. Hubungi kami untuk harga terbaru dan volume besar.
            </p>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">KEUNGGULAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Keunggulan Finishing Kami</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Berbagai keunggulan yang membuat layanan finishing kami menjadi pilihan utama</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keunggulan.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all hover:-translate-y-2 hover:shadow-xl text-center"
                >
                  <div className={`w-14 h-14 mx-auto bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
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

      {/* Aplikasi Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div data-aos="fade-right" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <PaintBucket className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">APLIKASI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Aplikasi Finishing Lantai</h2>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Layanan finishing lantai kami cocok untuk berbagai jenis bangunan dan area, 
                dengan hasil yang optimal dan tahan lama.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {aplikasiFinishing.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-300 justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left" className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hasil Finishing Premium</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Kami menggunakan bahan berkualitas Sika/Fosroc dan teknologi modern 
                untuk menghasilkan lantai yang rata, halus, dan tahan lama.
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-white">100+</div>
                  <div className="text-slate-400">Proyek Selesai</div>
                </div>
                <div className="w-px bg-slate-700"></div>
                <div className="text-center">
                  <div className="font-bold text-white">100%</div>
                  <div className="text-slate-400">Kepuasan Klien</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proses Pengerjaan */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">PROSES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Proses Pengerjaan</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami bekerja dengan prosedur yang terstandar untuk hasil terbaik</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {prosesPengerjaan.map((item, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="text-center group">
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
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
              <Ruler className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">SPESIFIKASI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Spesifikasi Teknis</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Standar kualitas yang kami terapkan untuk setiap proyek finishing</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Ketebalan Minimal", value: "5 cm" },
              { label: "Kekerasan", value: "60-70 MPa" },
              { label: "Toleransi Kerataan", value: "± 2mm" },
              { label: "Garansi Pengerjaan", value: "6 bulan" }
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Butuh Jasa Finishing Lantai?</h2>
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