import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useState, useEffect, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Mail,
  Building2,
  Calendar,
  CheckCircle,
  Send,
  FileText,
  ArrowRight,
  Award,
  Star,
  Zap,
  Shield,
  Users,
  ChevronLeft,
  ChevronRight,
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
        description="Hubungi tim marketing kami Ade SE, Zulfikar, atau Lucky Sergio untuk konsultasi dan pemesanan sewa pompa beton serta beton cor di Tangerang."
        canonicalUrl="https://solusipompabeton.com/kontak"
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
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">HUBUNGI KAMI</span>
          </div>

          <h1 data-aos="zoom-in" className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">Ada yang ingin</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              ditanyakan?
            </span>
          </h1>

          <p data-aos="fade-up" className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Hubungi tim marketing kami untuk konsultasi, informasi harga, atau pemesanan beton cor dan sewa pompa beton.
          </p>

          <div data-aos="fade-up" className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281315913559"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Ade SE</span>
            </a>
            <a
              href="https://wa.me/6285780679887"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600 shadow-sm hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Zulfikar</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /><span className="text-sm">Berpengalaman 10+ Tahun</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /><span className="text-sm">Kualitas Terjamin SNI</span></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /><span className="text-sm">24 Jam Siap Melayani</span></div>
          </div>
        </div>
      </section>

      {/* Contact Persons Section */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">TIM MARKETING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Hubungi Tim Marketing Kami</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Siap membantu Anda dengan pelayanan terbaik</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactPersons.map((contact, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20">
                    {contact.badge}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${contact.gradient} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {contact.avatar}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-indigo-400 font-medium">{contact.role}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 justify-center">
                      <Award className="w-3 h-3 text-amber-400" />
                      {contact.expertise}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2 p-3 bg-slate-700/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                      <MessageCircle className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm">{contact.wa}</span>
                    </div>
                    <button
                      onClick={() => handleWhatsApp(contact, "order", { jenis: "Beton Cor" })}
                      className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 w-full justify-center shadow-lg shadow-indigo-600/25"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pesan Sekarang
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 p-3 bg-slate-700/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm">{contact.mobile}</span>
                    </div>
                    <button
                      onClick={() => handleCall(contact.mobile)}
                      className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 w-full justify-center"
                    >
                      <Phone className="w-4 h-4" />
                      Telepon
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-3 text-center">Aksi cepat:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleWhatsApp(contact, "order", { jenis: "Beton Cor" })}
                      className="py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      Pesan Beton
                    </button>
                    <button
                      onClick={() => handleWhatsApp(contact, "consult")}
                      className="py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-xs font-medium text-slate-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Konsultasi
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-slate-400">{contact.experience} pengalaman</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div data-aos="fade-right" className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-400">INFORMASI KONTAK</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Informasi yang Perlu Anda Ketahui</h2>
                <p className="text-slate-400 mb-8">Tim marketing kami siap melayani Anda untuk konsultasi, pemesanan, dan informasi teknis.</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Alamat", content: "Jl. Masjid Ar Rahman cicentang RT.02/RW.01, Rawabuntu, Serpong, Tangerang Selatan", color: "text-indigo-400" },
                  { icon: Mail, title: "Email", content: "adminwebsitensm@gmail.com", action: "mailto:adminwebsitensm@gmail.com", color: "text-indigo-400" },
                  { icon: Clock, title: "Jam Operasional", content: "08:00 - 22.00 (24/7 untuk darurat)", color: "text-indigo-400" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const ContentWrapper = item.action ? 'a' : 'div';
                  const props = item.action ? { href: item.action, className: "block" } : {};
                  return (
                    <div
                      key={idx}
                      data-aos="fade-right"
                      data-aos-delay={idx * 100}
                      className="flex flex-col items-center text-center p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mb-3">
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <ContentWrapper {...props}>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="text-slate-400 text-sm break-all">{item.content}</p>
                      </ContentWrapper>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <div data-aos="fade-left">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 text-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center">
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </h3>
                  <p className="text-white/80 text-sm">Isi form berikut, kami akan segera merespon</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Nama Lengkap <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nama Anda"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                        required
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Nomor Telepon <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+62 xxx xxx xxx"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                        required
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Tipe Proyek
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Volume (m³)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 50"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                        onChange={(e) => setFormData({...formData, volume: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                        Lokasi Proyek
                      </label>
                      <input
                        type="text"
                        placeholder="Tangerang, Jakarta, dll"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 text-left">
                      Pesan / Detail Proyek <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      placeholder="Jelaskan kebutuhan proyek Anda..."
                      rows="4"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 resize-none"
                      required
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Kirim via WhatsApp
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    Pesan akan dikirim ke tim marketing kami
                  </p>
                </form>
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

      {/* CTA Section */}
      <section className="py-24 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Butuh informasi lebih lanjut?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Hubungi tim marketing kami untuk konsultasi dan informasi harga
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/6281315913559"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Ade SE
              </a>
              <a
                href="https://wa.me/6285780679887"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all hover:scale-105 border border-white/20"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Zulfikar
              </a>
            </div>
            <p className="text-white/60 text-sm mt-6 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Konsultasi gratis • Respon cepat • Harga bersaing
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}