import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useState, useEffect, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  MessageCircle, Phone, MapPin, Clock, Mail, Building2, 
  Calendar, CheckCircle, Send, FileText, ArrowRight, Award, 
  Star, Zap, Shield, Users, ChevronLeft, ChevronRight, 
  Target, Heart, Timer, Wallet, HandMetal
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    volume: '',
    location: '',
    message: ''
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ DATA FILOSOFI 3 HEMAT
  const tigaHemat = [
    {
      icon: Timer,
      title: "Hemat Waktu",
      desc: "Respon cepat dan pengiriman tepat jadwal memastikan proyek Anda tidak terhambat.",
      color: "from-blue-600 to-cyan-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400"
    },
    {
      icon: Wallet,
      title: "Hemat Biaya",
      desc: "Konsultasi gratis dan penawaran harga transparan tanpa biaya tersembunyi.",
      color: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400"
    },
    {
      icon: HandMetal,
      title: "Hemat Tenaga",
      desc: "Tim marketing profesional siap membantu mengurus semua kebutuhan proyek Anda.",
      color: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400"
    }
  ];

  const contactPersons = [
    {
      name: "Ade SE",
      wa: "6281315913559",
      mobile: "+62 813 1591 3559",
      role: "Marketing Executive",
      avatar: "👨‍💼",
      expertise: "Beton Cor & Sewa Pompa",
      experience: "5 tahun",
      badge: "Senior Marketing",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      name: "Zulfikar",
      wa: "6285780679887",
      mobile: "+62 857 8067 9887",
      role: "Marketing Executive",
      avatar: "👨‍💼",
      expertise: "Pompa Beton & Finishing",
      experience: "4 tahun",
      badge: "Marketing",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      name: "Lucky Sergio",
      wa: "6281210243379",
      mobile: "+62 857 8216 3531",
      role: "Admin Website",
      avatar: "👨‍💻",
      expertise: "Technical Support",
      experience: "3 tahun",
      badge: "Online Support",
      gradient: "from-emerald-600 to-teal-600"
    }
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

  const handleWhatsApp = (contact, type, data = {}) => {
    let message = '';
    if (type === 'order') {
      message = `Halo ${contact.name}, saya ingin memesan beton cor untuk proyek saya.%0A%0A` +
        `Detail Pemesanan:%0A` +
        `Jenis: ${data.jenis || 'Beton Cor'}%0A` +
        `Volume: ${data.volume || '_____'} m³%0A` +
        `Lokasi: ${data.lokasi || 'Tangerang'}%0A%0A` +
        `Mohon info harga dan ketersediaan. Terima kasih.`;
    } else if (type === 'consult') {
      message = `Halo ${contact.name}, saya ingin konsultasi tentang kebutuhan proyek saya.%0A%0A` +
        `Detail Proyek:%0A` +
        `Jenis Proyek: ${data.project || '_____'}%0A` +
        `Lokasi: ${data.location || 'Tangerang'}%0A` +
        `Estimasi Volume: ${data.volume || '_____'} m³%0A%0A` +
        `Mohon bantuan konsultasinya. Terima kasih.`;
    } else {
      message = `Halo ${contact.name}, saya tertarik dengan layanan Solusi Pompa Beton.%0A%0A` +
        `Mohon informasinya lebih lanjut. Terima kasih.`;
    }
    window.open(`https://wa.me/${contact.wa}?text=${message}`, '_blank');
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `*PESANAN BARU DARI WEBSITE*%0A%0A` +
      `Nama: ${formData.name}%0A` +
      `Email: ${formData.email || '-'}%0A` +
      `Telepon: ${formData.phone}%0A` +
      `Tipe Proyek: ${formData.projectType || '-'}%0A` +
      `Volume: ${formData.volume || '-'} m³%0A` +
      `Lokasi: ${formData.location || '-'}%0A` +
      `Pesan: ${formData.message}%0A%0A` +
      `Mohon segera dihubungi. Terima kasih.`;
    window.open(`https://wa.me/6281315913559?text=${message}`, '_blank');
  };

  return (
    <Layout>
      <SEO 
        title="Kontak Kami | Solusi Pompa Beton & Niaga Solusi Mandiri"
        description="Hubungi tim marketing kami Ade SE, Zulfikar, atau Lucky Sergio untuk konsultasi dan pemesanan sewa pompa beton serta beton cor di Tangerang. Hemat Waktu, Hemat Biaya, Hemat Tenaga."
        canonicalUrl="https://solusipompabeton.com/kontak"
      />
      
      {/* ✅ FIX: Wrapper dengan overflow-x-hidden untuk mencegah scroll horizontal */}
      <div className="w-full overflow-x-hidden">
        
        {/* 1. Hero Section */}
        <section className="relative w-full min-h-[60vh] flex items-center justify-center px-4 pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-linear-to-br from-slate-950/90 via-slate-950/80 to-slate-950/90 z-10"></div>
                <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover scale-105" />
              </div>
            ))}
          </div>

          <button onClick={goToPreviousImage} className="absolute left-4 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group active:scale-95" aria-label="Previous image">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={goToNextImage} className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-slate-900/60 hover:bg-indigo-600/90 backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110 border border-white/10 group active:scale-95" aria-label="Next image">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-12" data-aos="fade-up" data-aos-duration="1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full mb-6 mx-auto">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">HUBUNGI KAMI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              <span className="block">Ada yang ingin</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                ditanyakan?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Hubungi tim marketing kami untuk konsultasi, informasi harga, atau pemesanan beton cor dan sewa pompa beton.
            </p>

            {/* 3 Hemat Badges in Hero */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
              <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                <span>WhatsApp Ade SE</span>
              </a>
              <a href="https://wa.me/6285780679887" target="_blank" rel="noopener noreferrer" className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-slate-600/50 hover:border-indigo-500/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>WhatsApp Zulfikar</span>
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10 w-full max-w-xl mx-auto">
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
        </section>

        {/* 2. Contact Persons Section */}
        <section className="w-full py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">TIM MARKETING</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">Hubungi Tim Marketing Kami</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">Siap membantu Anda dengan pelayanan terbaik dan respon cepat</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {contactPersons.map((contact, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 relative flex flex-col"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/20 font-semibold">
                      {contact.badge}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br ${contact.gradient} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {contact.avatar}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{contact.name}</h3>
                      <p className="text-sm text-indigo-400 font-medium">{contact.role}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-center">
                        <Award className="w-3 h-3 text-amber-400" />
                        {contact.expertise}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-center gap-2 text-slate-300 text-sm sm:text-base">
                        <MessageCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-mono">{contact.wa}</span>
                      </div>
                      <button
                        onClick={() => handleWhatsApp(contact, "order", { jenis: "Beton Cor" })}
                        className="px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white text-sm font-bold transition-all flex items-center gap-2 w-full justify-center shadow-lg shadow-indigo-600/20 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Pesan Sekarang
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 p-3 sm:p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-center gap-2 text-slate-300 text-sm sm:text-base">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-mono">{contact.mobile}</span>
                      </div>
                      <button
                        onClick={() => handleCall(contact.mobile)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-bold transition-all flex items-center gap-2 w-full justify-center border border-slate-700 hover:border-slate-600 active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        Telepon
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-3 text-center font-medium">Aksi cepat:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleWhatsApp(contact, "order", { jenis: "Beton Cor" })}
                        className="py-2 bg-slate-900/50 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-1.5 border border-slate-700/50 hover:border-indigo-500/30 active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Pesan Beton
                      </button>
                      <button
                        onClick={() => handleWhatsApp(contact, "consult")}
                        className="py-2 bg-slate-900/50 hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-1.5 border border-slate-700/50 hover:border-indigo-500/30 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Konsultasi
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-400 font-medium">{contact.experience} pengalaman</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Form & Info Section */}
        <section className="w-full py-16 sm:py-24 px-4 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Info */}
              <div>
                <div data-aos="fade-right" className="text-center lg:text-left mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300 tracking-wide">INFORMASI KONTAK</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight">Informasi yang Perlu Anda Ketahui</h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Tim marketing kami siap melayani Anda untuk konsultasi, pemesanan, dan informasi teknis.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: MapPin, title: "Alamat", content: "Jl. Masjid Ar Rahman cicentang RT.02/RW.01, Rawabuntu, Serpong, Tangerang Selatan", color: "text-indigo-400" },
                    { icon: Mail, title: "Email", content: "adminwebsitensm@gmail.com", action: "mailto:adminwebsitensm@gmail.com", color: "text-indigo-400" },
                    { icon: Clock, title: "Jam Operasional", content: "08:00 - 22.00 (24/7 untuk darurat)", color: "text-indigo-400" }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const ContentWrapper = item.action ? 'a' : 'div';
                    const props = item.action ? { href: item.action, className: "block hover:text-indigo-300 transition-colors" } : {};
                    return (
                      <div
                        key={idx}
                        data-aos="fade-right"
                        data-aos-delay={idx * 100}
                        className="flex flex-col items-center text-center sm:items-start sm:text-left p-5 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className={`w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0`}>
                            <Icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <ContentWrapper {...props}>
                            <h3 className="font-bold text-white text-lg">{item.title}</h3>
                            <p className="text-slate-400 text-sm break-all">{item.content}</p>
                          </ContentWrapper>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <div data-aos="fade-left">
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-5 text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 justify-center">
                      <Send className="w-5 h-5" />
                      Kirim Pesan
                    </h3>
                    <p className="text-indigo-100 text-sm mt-1">Isi form berikut, kami akan segera merespon via WhatsApp</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Nama Lengkap <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama Anda"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all active:scale-[0.99]"
                          required
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Nomor Telepon <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+62 xxx xxx xxx"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all active:scale-[0.99]"
                          required
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all active:scale-[0.99]"
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Tipe Proyek
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none transition-all active:scale-[0.99]"
                          onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                        >
                          <option value="">Pilih Tipe Proyek</option>
                          <option value="Beton Cor Readymix">Beton Cor Readymix</option>
                          <option value="Sewa Pompa Beton">Sewa Pompa Beton</option>
                          <option value="Jasa Finishing">Jasa Finishing</option>
                          <option value="Konsultasi">Konsultasi</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Volume (m³)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 50"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all active:scale-[0.99]"
                          onChange={(e) => setFormData({...formData, volume: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                          Lokasi Proyek
                        </label>
                        <input
                          type="text"
                          placeholder="Tangerang, Jakarta, dll"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all active:scale-[0.99]"
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2 text-left">
                        Pesan / Detail Proyek <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        placeholder="Jelaskan kebutuhan proyek Anda..."
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 resize-none transition-all active:scale-[0.99]"
                        required
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Kirim via WhatsApp
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                      Pesan akan dikirim langsung ke tim marketing kami via WhatsApp
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Service Area Section */}
        <section className="w-full py-16 sm:py-24 px-4 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">WILAYAH LAYANAN</span>
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
              <button onClick={() => scrollToSection('contact')} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/25">
                <MessageCircle className="w-5 h-5" />
                <span>Hubungi Kami Sekarang</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="w-full py-16 sm:py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
                Butuh informasi lebih lanjut?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                Hubungi tim marketing kami untuk konsultasi dan informasi harga. Wujudkan proyek yang <span className="text-emerald-400 font-bold">Hemat Waktu, Hemat Biaya, Hemat Tenaga</span>.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
                <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/25">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Ade SE
                </a>
                <a href="https://wa.me/6285780679887" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/25">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Zulfikar
                </a>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                Konsultasi gratis • Respon cepat • Harga bersaing
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}