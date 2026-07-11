import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import {
  Building2,
  ArrowUpRight,
  MessageCircle,
  Truck,
  Shield,
  Clock,
  Award,
  MapPin,
  Calendar,
  CheckCircle,
  Brush,
  Wrench,
  Phone,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Gauge,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users,
  Star,
  Quote,
  Zap,
  Target,
  Heart,
} from 'lucide-react';
import logoNsm from '../assets/logo-nsm.png';

// Import Hero Images
import heroImg1 from '../assets/images/header/1.jpg';
import heroImg2 from '../assets/images/header/2.jpg';
import heroImg3 from '../assets/images/header/3.jpg';
import heroImg4 from '../assets/images/header/4.jpg';
import heroImg5 from '../assets/images/header/5.jpg';
import heroImg6 from '../assets/images/header/6.jpg';
import heroImg7 from '../assets/images/header/7.jpg';
import heroImg8 from '../assets/images/header/8.jpg';
import heroImg9 from '../assets/images/header/9.jpg';
import heroImg10 from '../assets/images/header/10.jpg';

// Import Beton Readymix Images
import betonReadymix1 from '../assets/images/betonreadymix/1.jpg';
import betonReadymix2 from '../assets/images/betonreadymix/2.jpg';
import betonReadymix3 from '../assets/images/betonreadymix/3.jpg';
import betonReadymix4 from '../assets/images/betonreadymix/4.jpg';

// Import Pompa Beton Images
import pompaBeton1 from '../assets/images/pompabeton/1.jpg';
import pompaBeton2 from '../assets/images/pompabeton/2.jpg';
import pompaBeton3 from '../assets/images/pompabeton/3.jpg';
import pompaBeton4 from '../assets/images/pompabeton/4.jpg';
import pompaBeton5 from '../assets/images/pompabeton/5.jpg';
import pompaBeton6 from '../assets/images/pompabeton/6.jpg';
import pompaBeton7 from '../assets/images/pompabeton/7.jpg';
import pompaBeton8 from '../assets/images/pompabeton/8.jpg';

// Import Trowel Images
import trowel1 from '../assets/images/trowel/1.jpg';

const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8, heroImg9, heroImg10];
const betonReadymixImages = [betonReadymix1, betonReadymix2, betonReadymix3, betonReadymix4];
const pompaBetonImages = [pompaBeton1, pompaBeton2, pompaBeton3, pompaBeton4, pompaBeton5, pompaBeton6, pompaBeton7, pompaBeton8];
const trowelImages = [trowel1];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [serviceImageIndex, setServiceImageIndex] = useState({});
  const testimonialsRef = useRef(null);

  // Inisialisasi AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 80,
      easing: 'ease-in-out',
      delay: 0,
    });
    // Refresh AOS setelah load
    AOS.refresh();
  }, []);

  // FAQ Data
  const faqData = [
    {
      question: "Apa itu beton readymix dan kapan sebaiknya digunakan?",
      answer: "Beton readymix adalah beton cor siap pakai yang diproduksi di batching plant dengan kontrol kualitas ketat. Sangat cocok untuk proyek dengan volume besar seperti pondasi gedung, jalan raya, jembatan, dan lantai pabrik karena kualitasnya konsisten dan pengerjaan lebih cepat."
    },
    {
      question: "Kapan saya membutuhkan sewa pompa beton?",
      answer: "Sewa pompa beton diperlukan saat lokasi pengecoran sulit dijangkau truk mixer. Misalnya area perumahan dengan gang sempit, lantai atas bangunan bertingkat, atau area dengan jarak jauh dari akses truk. Kami menyediakan berbagai jenis pompa sesuai kebutuhan."
    },
    {
      question: "Apa manfaat finishing trowel untuk lantai beton?",
      answer: "Finishing trowel membuat lantai beton menjadi rata sempurna, anti slip, tahan benturan dan oli, bebas perawatan, serta lebih awet. Sangat cocok untuk gudang, pabrik, area parkir, dan showroom."
    },
    {
      question: "Berapa lama waktu pengerjaan finishing trowel?",
      answer: "Finishing trowel dikerjakan 3-4 jam setelah pengecoran beton. Proses ini memastikan permukaan lantai rata dan halus. Total waktu pengerjaan tergantung luas area dan kondisi cuaca."
    },
    {
      question: "Bagaimana cara memesan layanan?",
      answer: "Hubungi tim marketing kami via WhatsApp atau telepon. Konsultasikan kebutuhan proyek Anda, tim kami akan memberikan penawaran harga dan jadwal pelaksanaan yang sesuai."
    }
  ];

  // Services Data
  const services = [
    {
      id: 1,
      title: "Beton Readymix",
      icon: Building2,
      images: betonReadymixImages,
      description: "Beton cor siap pakai dengan mutu K-125 hingga K-500 untuk pondasi gedung, jalan raya, jembatan, dan infrastruktur lainnya.",
      features: [
        "Mutu lengkap K-125 s/d K-500",
        "Waktu pengerasan 60-90 menit",
        "Slump test 8-12 cm",
        "Bebas retak & porosity rendah"
      ],
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 2,
      title: "Sewa Pompa Beton",
      icon: Truck,
      images: pompaBetonImages,
      description: "Pompa beton untuk memindahkan beton cair ke lokasi pengecoran yang sulit dijangkau. Cocok untuk proyek bertingkat dan area dengan akses terbatas.",
      features: [
        "Pompa Mini (12-30m)",
        "Pompa Standar (18-40m)",
        "Pompa Longboom (24-50m)",
        "Pompa Moli (36-200m)"
      ],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: 3,
      title: "Jasa Finishing Trowel",
      icon: Brush,
      images: trowelImages,
      description: "Menghaluskan permukaan lantai beton menggunakan mesin khusus, menghasilkan lantai rata, halus, anti slip, dan tahan lama.",
      features: [
        "Permukaan rata & halus",
        "Anti retak & awet",
        "Ketahanan tinggi terhadap benturan",
        "Anti slip & aman"
      ],
      gradient: "from-emerald-600 to-teal-600"
    }
  ];

  // Testimonials Data - Diperbanyak
  const testimonials = [
    {
      id: 1,
      name: "Bapak Ahmad",
      project: "Pembangunan Ruko 3 Lantai",
      text: "Pelayanan sangat profesional dan tepat waktu. Beton readymix berkualitas tinggi, hasil cor sangat memuaskan. Timnya juga sangat kooperatif.",
      rating: 5,
      image: null
    },
    {
      id: 2,
      name: "Ibu Siti",
      project: "Renovasi Pabrik",
      text: "Sewa pompa beton sangat membantu proyek kami. Akses ke area pabrik yang sempit tidak masalah dengan pompa mini mereka. Sangat direkomendasikan!",
      rating: 5,
      image: null
    },
    {
      id: 3,
      name: "Bapak Budi",
      project: "Pembangunan Perumahan",
      text: "Kombinasi beton readymix dan finishing trowel menghasilkan lantai yang sangat rata dan halus. Harga kompetitif dan kualitas terbaik.",
      rating: 5,
      image: null
    },
    {
      id: 4,
      name: "Ibu Rina",
      project: "Gudang Logistik",
      text: "Layanan finishing trowel sangat memuaskan. Lantai gudang menjadi rata, anti slip, dan tahan lama. Tim pekerja sangat profesional dan rapi.",
      rating: 5,
      image: null
    },
    {
      id: 5,
      name: "Bapak Dedi",
      project: "Pembangunan Jembatan",
      text: "Beton readymix dari Niaga Solusi Mandiri sangat berkualitas. Pengiriman tepat waktu dan harga bersaing. Proyek jembatan selesai sesuai target.",
      rating: 5,
      image: null
    },
    {
      id: 6,
      name: "Ibu Anita",
      project: "Hotel 5 Lantai",
      text: "Pompa beton longboom mereka sangat membantu pengecoran lantai atas. Operator berpengalaman dan proses cepat. Sangat puas dengan hasilnya!",
      rating: 5,
      image: null
    }
  ];

  // Auto slide hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Service image navigation
  const nextServiceImage = (serviceId, images) => {
    setServiceImageIndex(prev => ({
      ...prev,
      [serviceId]: ((prev[serviceId] || 0) + 1) % images.length
    }));
  };

  const prevServiceImage = (serviceId, images) => {
    setServiceImageIndex(prev => ({
      ...prev,
      [serviceId]: ((prev[serviceId] || 0) - 1 + images.length) % images.length
    }));
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Intersection Observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Generate star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
      />
    ));
  };

  const contactMarketing = {
    ade: {
      name: "Ade SE",
      wa: "6281315913559",
      tel: "+6281315913559"
    },
    zulfikar: {
      name: "Zulfikar",
      wa: "6285780679887",
      tel: "+6285780679887"
    }
  };

  const renderServiceCard = (service, idx) => {
    const Icon = service.icon;
    const currentIndex = serviceImageIndex[service.id] || 0;
    const hasMultipleImages = service.images.length > 1;
    const delay = idx * 100;

    return (
      <div 
        key={idx} 
        data-aos="fade-up" 
        data-aos-delay={delay}
        data-aos-duration="800"
        className="group bg-slate-800 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-700/50 hover:border-indigo-500/40 hover:-translate-y-3 relative"
      >
        {/* Gradient Overlay */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${service.gradient}`}></div>

        {/* Image Carousel */}
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-800">
            {service.images.map((img, imgIdx) => (
              <div
                key={imgIdx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  imgIdx === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`${service.title} - Image ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-800/60"></div>
          </div>

          {/* Icon Overlay */}
          <div className="absolute top-3 left-3 p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700/50 z-10">
            <Icon className="w-5 h-5 text-indigo-400" />
          </div>

          {/* Navigation arrows for multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevServiceImage(service.id, service.images); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 hover:scale-110 z-10 text-white backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextServiceImage(service.id, service.images); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 hover:scale-110 z-10 text-white backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {service.images.map((_, imgIdx) => (
                  <button
                    key={imgIdx}
                    onClick={(e) => { e.stopPropagation(); setServiceImageIndex(prev => ({ ...prev, [service.id]: imgIdx })); }}
                    className={`transition-all duration-300 rounded-full ${
                      imgIdx === currentIndex
                        ? 'w-6 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${imgIdx + 1}`}
                  />
                ))}
              </div>

              {/* Image counter */}
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full z-10 backdrop-blur-sm">
                {currentIndex + 1} / {service.images.length}
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.description}</p>
          <ul className="space-y-2 mb-5">
            {service.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => scrollToSection('contact')}
            className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:gap-3 transition-all duration-300 hover:text-indigo-300 group-hover:translate-x-1"
          >
            <span>Konsultasi Sekarang</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <SEO 
        title="Solusi Pompa Beton | Sewa Pompa Beton & Supplier Beton Cor Tangerang"
        description="Niaga Solusi Mandiri - Penyedia jasa sewa pompa beton, beton readymix, dan finishing trowel di Tangerang. Armada lengkap, harga kompetitif."
        canonicalUrl="https://solusipompabeton.com/"
      />

      {/* Hero Section with Carousel */}
      <section 
        id="hero" 
        className="min-h-screen flex items-center pt-16 relative overflow-hidden"
        data-aos="fade-in"
        data-aos-duration="1000"
      >
        {/* Hero Background Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 z-10"></div>
              <img
                src={img}
                alt={`Hero background ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div 
              className="text-center lg:text-left order-2 lg:order-1"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 animate-pulse">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">NIAGA SOLUSI MANDIRI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Solusi Beton & 
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Pompa Beton Terpercaya</span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Supplier beton cor Tangerang dengan pengalaman 10+ tahun. 
                Melayani beton readymix, sewa pompa beton, dan finishing trowel 
                untuk proyek konstruksi Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => scrollToSection('services')}
                  className="group px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
                >
                  <span>Lihat Layanan</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-600 shadow-sm hover:shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Hubungi Kami</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-slate-700/50">
                {[
                  { number: "10+", label: "Tahun Pengalaman", icon: Award },
                  { number: "500+", label: "Proyek Selesai", icon: CheckCircle },
                  { number: "50+", label: "Unit Pompa", icon: Truck },
                  { number: "24/7", label: "Jam Layanan", icon: Clock }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx} 
                      className="text-center group"
                      data-aos="zoom-in"
                      data-aos-delay={idx * 100}
                      data-aos-duration="600"
                    >
                      <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-1 group-hover:scale-125 transition-transform duration-300" />
                      <div className="text-xl font-bold text-white">{stat.number}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content - Logo Card */}
            <div 
              className="order-1 lg:order-2"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl animate-pulse"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-indigo-500/10">
                  <div className="aspect-4/3 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-4 p-3 border border-slate-200 hover:scale-105 transition-transform duration-500">
                        {logoNsm ? (
                          <img 
                            src={logoNsm} 
                            alt="Niaga Solusi Mandiri" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-indigo-600">NSM</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white">Niaga Solusi Mandiri</h3>
                      <p className="text-slate-400 text-sm">Readymix &amp; Concrete Pump</p>
                      <div className="flex items-center justify-center gap-3 mt-3">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Shield className="w-3 h-3 text-emerald-400" /> Terpercaya
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3 text-blue-400" /> Profesional
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <ThumbsUp className="w-3 h-3 text-amber-400" /> Berpengalaman
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
              data-aos="fade-down"
              data-aos-duration="600"
            >
              <Wrench className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">LAYANAN KAMI</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              Layanan Unggulan
            </h2>
            <p 
              className="text-slate-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="200"
            >
              Solusi lengkap untuk kebutuhan konstruksi Anda dengan kualitas terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => renderServiceCard(service, idx))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className="order-2 lg:order-1"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">TENTANG KAMI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Mitra Terpercaya untuk Proyek Konstruksi Anda
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Niaga Solusi Mandiri adalah supplier beton cor Tangerang dan penyedia jasa sewa pompa beton yang telah berpengalaman lebih dari 10 tahun dalam industri konstruksi di Indonesia.
              </p>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Berkomitmen untuk mendukung kesuksesan proyek konstruksi Anda dengan armada modern, operator profesional, dan pelayanan terbaik. Kami melayani wilayah Tangerang Raya dan Tangerang Selatan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Pengalaman", value: "10+ Tahun" },
                  { label: "Proyek", value: "500+" },
                  { label: "Armada", value: "50+ Unit" },
                  { label: "Kepuasan", value: "100%" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:scale-105"
                    data-aos="zoom-in"
                    data-aos-delay={idx * 100}
                    data-aos-duration="500"
                  >
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">{item.value}</div>
                    <div className="text-sm text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="order-1 lg:order-2"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div 
                    className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300"
                    data-aos="flip-up"
                    data-aos-delay="100"
                    data-aos-duration="600"
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
                    <p className="text-sm font-medium">Tim Profesional</p>
                    <p className="text-2xl font-bold">20+</p>
                    <p className="text-xs text-white/60">Tenaga Ahli</p>
                  </div>
                  <div 
                    className="bg-linear-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300"
                    data-aos="flip-up"
                    data-aos-delay="200"
                    data-aos-duration="600"
                  >
                    <Truck className="w-8 h-8 mx-auto mb-2 text-white/80" />
                    <p className="text-sm font-medium">Armada</p>
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-xs text-white/60">Unit Pompa</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div 
                    className="bg-linear-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300"
                    data-aos="flip-up"
                    data-aos-delay="300"
                    data-aos-duration="600"
                  >
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-white/80" />
                    <p className="text-sm font-medium">Proyek</p>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-white/60">Telah Selesai</p>
                  </div>
                  <div 
                    className="bg-linear-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300"
                    data-aos="flip-up"
                    data-aos-delay="400"
                    data-aos-duration="600"
                  >
                    <Star className="w-8 h-8 mx-auto mb-2 text-white/80" />
                    <p className="text-sm font-medium">Kepuasan</p>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-white/60">Klien Puas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
              data-aos="fade-down"
              data-aos-duration="600"
            >
              <Quote className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">TESTIMONI</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              Apa Kata Klien Kami
            </h2>
            <p 
              className="text-slate-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="200"
            >
              Pengalaman nyata dari pelanggan yang telah menggunakan layanan kami
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div key={testimonial.id} className="w-full shrink-0 px-4">
                    <div 
                      className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-500"
                      data-aos="fade-up"
                      data-aos-delay={idx * 50}
                      data-aos-duration="600"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-slate-400">{testimonial.project}</p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-slate-300 leading-relaxed">"{testimonial.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentTestimonial
                      ? 'w-10 h-2 bg-indigo-500'
                      : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { number: "10+", label: "Tahun Pengalaman" },
              { number: "500+", label: "Proyek Selesai" },
              { number: "50+", label: "Unit Pompa" },
              { number: "24/7", label: "Jam Layanan" }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
                data-aos-duration="600"
              >
                <div className="text-3xl sm:text-4xl font-bold">{stat.number}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
              data-aos="fade-down"
              data-aos-duration="600"
            >
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">FAQ</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              Pertanyaan yang Sering Diajukan
            </h2>
            <p 
              className="text-slate-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="200"
            >
              Informasi untuk membantu Anda memahami layanan kami
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                data-aos-duration="600"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-700/50 transition duration-300"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300" />
                  )}
                </button>
                {openFaq === idx && (
                  <div 
                    className="px-5 pb-5"
                    data-aos="fade-down"
                    data-aos-duration="400"
                  >
                    <p className="text-slate-300 border-t border-slate-700/50 pt-4 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section id="service-area" className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
              data-aos="fade-down"
              data-aos-duration="600"
            >
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400">WILAYAH LAYANAN</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              Melayani Tangerang Raya & Sekitarnya
            </h2>
            <p 
              className="text-slate-400 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="200"
            >
              Kami melayani berbagai perumahan dan kawasan di wilayah Tangerang dengan respon cepat
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                region: "Tangerang Raya",
                areas: ["BSD City", "Alam Sutera", "Gading Serpong", "Bintaro Jaya", "Pondok Aren", "Ciputat", "Pamulang", "Serpong"]
              },
              {
                region: "Tangerang Selatan",
                areas: ["BSD", "Bintaro", "Pondok Aren", "Ciputat Timur", "Pamulang Barat", "Serpong Utara", "Setu", "Jurang Mangu"]
              }
            ].map((region, regionIdx) => (
              <div 
                key={regionIdx} 
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={regionIdx * 150}
                data-aos-duration="700"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  {region.region}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {region.areas.map((area, areaIdx) => (
                    <div 
                      key={areaIdx} 
                      className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300 hover:bg-slate-700/50"
                      data-aos="zoom-in"
                      data-aos-delay={areaIdx * 50}
                      data-aos-duration="400"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-linear-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div 
              className="text-white"
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-4">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">KONTAK KAMI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Hubungi tim marketing kami untuk konsultasi gratis dan penawaran terbaik untuk proyek konstruksi Anda.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Ade SE</div>
                    <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                      +62 813-1591-3559
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Zulfikar</div>
                    <a href="https://wa.me/6285780679887" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                      +62 857-8067-9887
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/6281315913559" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Ade
                </a>
                <a 
                  href="https://wa.me/6285780679887" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Zulfikar
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div 
              className="bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500"
              data-aos="fade-left"
              data-aos-duration="800"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Kirim Pesan</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-400"
                    placeholder="Nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-400"
                    placeholder="email@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-400"
                    placeholder="0812-3456-7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Jenis Proyek
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
                  >
                    <option value="">Pilih jenis proyek</option>
                    <option value="readymix">Beton Readymix</option>
                    <option value="pompa">Sewa Pompa Beton</option>
                    <option value="trowel">Finishing Trowel</option>
                    <option value="all">Kombinasi</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Pesan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-400 resize-none"
                    placeholder="Ceritakan kebutuhan proyek Anda..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-105"
                >
                  <span>Kirim Pesan</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}