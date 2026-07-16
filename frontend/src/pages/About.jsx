import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { useEffect, useState, useCallback, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
  Heart,
  Target,
  Eye,
  Zap,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Timer,
  Wallet,
  HandMetal,
} from "lucide-react";

// Import hero images
import img1 from "../assets/images/header/1.jpg";
import img2 from "../assets/images/header/2.jpg";
import img3 from "../assets/images/header/3.jpg";
import img4 from "../assets/images/header/4.jpg";
import img5 from "../assets/images/header/5.jpg";
import img6 from "../assets/images/header/6.jpg";
import img7 from "../assets/images/header/7.jpg";
import img8 from "../assets/images/header/8.jpg";
import img9 from "../assets/images/header/9.jpg";
import img10 from "../assets/images/header/10.jpg";

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: "ease-out-cubic",
    });
    AOS.refresh();
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
  ];

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
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length,
    );
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
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ DATA FILOSOFI 3 HEMAT (Ditekankan secara visual)
  const tigaHemat = [
    {
      icon: Timer,
      title: "Hemat Waktu",
      desc: "Jadwal pengiriman presisi dan armada siap pakai memastikan proyek Anda tidak terhambat, selesai tepat waktu.",
      color: "from-blue-600 to-cyan-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    {
      icon: Wallet,
      title: "Hemat Biaya",
      desc: "Harga kompetitif langsung dari supplier tanpa perantara, dengan mutu terjamin untuk meminimalkan waste material.",
      color: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
    },
    {
      icon: HandMetal,
      title: "Hemat Tenaga",
      desc: "Didukung operator profesional bersertifikat dan mesin modern, mengurangi beban kerja manual di lapangan secara drastis.",
      color: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
    },
  ];

  const stats = [
    { number: "10+", label: "Tahun Pengalaman", icon: Calendar },
    { number: "500+", label: "Proyek Selesai", icon: Building2 },
    { number: "50+", label: "Unit Armada", icon: Truck },
    { number: "100%", label: "Kepuasan Klien", icon: Heart },
  ];

  const advantages = [
    {
      icon: Shield,
      title: "Armada Lengkap & Terawat",
      desc: "Berbagai kapasitas pompa beton siap pakai dengan maintenance rutin.",
    },
    {
      icon: Award,
      title: "Operator Tersertifikasi",
      desc: "Tim profesional berpengalaman yang mengutamakan keselamatan kerja.",
    },
    {
      icon: Clock,
      title: "Layanan Responsif 24/7",
      desc: "Siap melayani kebutuhan darurat dan konsultasi kapan pun Anda butuhkan.",
    },
    {
      icon: ThumbsUp,
      title: "Kualitas Mutu Terjamin",
      desc: "Beton cor sesuai standar SNI dengan slump test yang konsisten.",
    },
    {
      icon: Users,
      title: "Tim Manajemen Profesional",
      desc: "Dedikasi tinggi dalam menangani setiap detail proyek Anda.",
    },
    {
      icon: Zap,
      title: "Teknologi Modern",
      desc: "Menggunakan peralatan terbaru untuk efisiensi dan hasil maksimal.",
    },
  ];

  const serviceAreas = [
    {
      region: "Tangerang Raya",
      areas: [
        "BSD City",
        "Alam Sutera",
        "Gading Serpong",
        "Bintaro Jaya",
        "Pondok Aren",
        "Ciputat",
        "Pamulang",
        "Serpong",
        "Cisauk",
      ],
    },
    {
      region: "Tangerang Selatan",
      areas: [
        "BSD",
        "Bintaro",
        "Pondok Aren",
        "Ciputat Timur",
        "Pamulang Barat",
        "Serpong Utara",
        "Setu",
        "Jurang Mangu",
      ],
    },
  ];

  return (
    <Layout>
      <SEO
        title="Tentang Kami | Solusi Pompa Beton & Niaga Solusi Mandiri"
        description="Berpengalaman lebih dari 10 tahun. Hemat Waktu, Hemat Biaya, Hemat Tenaga dalam penyewaan pompa beton dan supplier beton cor di Tangerang."
        canonicalUrl="https://solusipompabeton.com/tentang"
      />

      {/* 1. Hero Section with Carousel - FIXED PADDING */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/90 to-slate-950/70 z-10"></div>
              <img
                src={img}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover scale-105"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPreviousImage}
          className="absolute left-4 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNextImage}
          className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Main Content Container - FIXED PADDING */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div
              data-aos="fade-down"
              data-aos-duration="800"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/20"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">
                Tentang Kami
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 max-w-5xl">
              <h1
                data-aos="zoom-in"
                data-aos-duration="1000"
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl"
              >
                <span className="block">Mitra Terpercaya untuk</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  Proyek Konstruksi Anda
                </span>
              </h1>
            </div>

            {/* 3 Hemat Badges */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
            >
              {tigaHemat.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 ${item.bg} border ${item.border} rounded-lg sm:rounded-xl ${item.text} text-xs sm:text-sm font-bold backdrop-blur-md hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{item.title}</span>
                    <span className="sm:hidden">{item.title.split(" ")[1]}</span>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="800"
              className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-2"
            >
              Niaga Solusi Mandiri hadir sebagai solusi lengkap kebutuhan beton
              cor dan sewa pompa beton di Tangerang, menghadirkan efisiensi
              maksimal untuk setiap proyek.
            </p>

            {/* CTA Buttons */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              data-aos-duration="800"
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4"
            >
              <button
                onClick={() => scrollToSection("contact")}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span>Hubungi Kami</span>
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-slate-600/50 hover:border-indigo-500/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg w-full sm:w-auto"
              >
                <span>Lihat Layanan</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="800"
              className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 w-full max-w-xl"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">
                  10+ Tahun
                </span>
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-slate-950 relative z-20 -mt-8 sm:-mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                    className="text-center group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 border border-slate-700 group-hover:border-indigo-500">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-slate-400 text-xs sm:text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ✅ SECTION KHUSUS: FILOSOFI 3 HEMAT */}
      <section className="py-16 sm:py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 tracking-wide">
                FILOSOFI KAMI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Prinsip{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                3 Hemat
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Kami tidak hanya menyediakan material, tetapi memberikan solusi
              yang membuat proyek Anda berjalan lebih efisien dari segala aspek.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {tigaHemat.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 150}
                  className={`relative group bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${item.border} hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${item.bg} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${item.text}`} />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. About Us / Profil Perusahaan */}
      <section
        id="about"
        className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <HardHat className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                  PROFIL PERUSAHAAN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">
                Niaga Solusi Mandiri
              </h2>
              <div className="space-y-3 sm:space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                <p>
                  Kami adalah{" "}
                  <strong className="text-white">
                    supplier beton cor Tangerang
                  </strong>{" "}
                  dan penyedia{" "}
                  <strong className="text-white">jasa sewa pompa beton</strong>{" "}
                  yang telah berpengalaman lebih dari 10 tahun dalam industri
                  konstruksi di Indonesia.
                </p>
                <p>
                  Berkomitmen untuk mendukung kesuksesan proyek konstruksi Anda
                  dengan armada modern, operator profesional, dan pelayanan
                  terbaik yang mengedepankan prinsip{" "}
                  <span className="text-emerald-400 font-semibold">
                    Hemat Waktu, Hemat Biaya, Hemat Tenaga
                  </span>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-105 shadow-lg shadow-indigo-600/25"
                >
                  <MessageCircle className="w-5 h-5" /> Hubungi Kami
                </button>
              </div>
            </div>

            <div data-aos="fade-left" className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  icon: Target,
                  title: "Visi",
                  desc: "Menjadi mitra terpercaya dalam penyediaan solusi konstruksi terbaik di Indonesia",
                  color: "text-indigo-400",
                  bg: "bg-indigo-500/10",
                },
                {
                  icon: Eye,
                  title: "Misi",
                  desc: "Memberikan layanan terbaik dengan kualitas premium dan harga yang kompetitif",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  icon: CheckCircle,
                  title: "Komitmen",
                  desc: "Kepuasan pelanggan dan keselamatan kerja adalah prioritas utama kami",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
                {
                  icon: Star,
                  title: "Kualitas",
                  desc: "Standar mutu tertinggi untuk setiap material dan layanan yang kami berikan",
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Advantages Section */}
      <section id="services" className="py-16 sm:py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                KEUNGGULAN KAMI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Berbagai keunggulan yang membuat kami menjadi pilihan tepat untuk
              efisiensi proyek Anda
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group bg-slate-800/30 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700/50 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {adv.title}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Service Area Section */}
      <section className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                WILAYAH LAYANAN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Melayani Tangerang Raya & Sekitarnya
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              Respon cepat dan pengiriman tepat waktu ke berbagai kawasan
              strategis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {serviceAreas.map((region, regionIdx) => (
              <div
                key={regionIdx}
                data-aos="fade-up"
                data-aos-delay={regionIdx * 100}
                className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2.5 sm:p-3 bg-indigo-500/10 rounded-lg sm:rounded-xl">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {region.region}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {region.areas.map((area, areaIdx) => (
                    <div
                      key={areaIdx}
                      data-aos="zoom-in"
                      data-aos-delay={areaIdx * 50}
                      className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300"
                    >
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-300">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div data-aos="fade-up" className="mt-8 sm:mt-12 text-center">
            <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
              <span className="font-semibold text-white">
                Tidak menemukan wilayah Anda?
              </span>{" "}
              Hubungi kami untuk konfirmasi ketersediaan layanan di area Anda.
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-600/25"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi Kami Sekarang</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section
        id="contact"
        className="py-16 sm:py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
              Siap Memulai Proyek Konstruksi Anda?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Konsultasikan kebutuhan proyek Anda dengan tim profesional kami.
              Wujudkan proyek yang{" "}
              <span className="text-emerald-400 font-bold">
                Hemat Waktu, Hemat Biaya, Hemat Tenaga
              </span>
              .
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
              <a
                href="https://wa.me/6281315913559"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/25"
              >
                <MessageCircle className="w-5 h-5" />
                Konsultasi Gratis via WA
              </a>
              <a
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all hover:scale-105 border border-slate-700"
              >
                <Phone className="w-5 h-5" />
                Hubungi Marketing
              </a>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Respon cepat • Harga bersaing • Kualitas terjamin SNI
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}