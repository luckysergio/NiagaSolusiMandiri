import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import {
  Building2, ArrowUpRight, MessageCircle, Truck, Shield, Clock, Award,
  MapPin, CheckCircle, Brush, Phone, ChevronDown, ChevronUp, Users,
  Star, Quote, ChevronLeft, ChevronRight, Zap, Wallet, Timer, HandMetal, Send
} from 'lucide-react';
import logoNsm from '../assets/logo-nsm.png';

// Import Images
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

import betonReadymix1 from '../assets/images/betonreadymix/1.jpg';
import betonReadymix2 from '../assets/images/betonreadymix/2.jpg';
import betonReadymix3 from '../assets/images/betonreadymix/3.jpg';
import betonReadymix4 from '../assets/images/betonreadymix/4.jpg';

import pompaBeton1 from '../assets/images/pompabeton/1.jpg';
import pompaBeton2 from '../assets/images/pompabeton/2.jpg';
import pompaBeton3 from '../assets/images/pompabeton/3.jpg';
import pompaBeton4 from '../assets/images/pompabeton/4.jpg';
import pompaBeton5 from '../assets/images/pompabeton/5.jpg';
import pompaBeton6 from '../assets/images/pompabeton/6.jpg';
import pompaBeton7 from '../assets/images/pompabeton/7.jpg';
import pompaBeton8 from '../assets/images/pompabeton/8.jpg';

import trowel1 from '../assets/images/trowel/1.jpg';

const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5, heroImg6, heroImg7, heroImg8, heroImg9, heroImg10];
const betonReadymixImages = [betonReadymix1, betonReadymix2, betonReadymix3, betonReadymix4];
const pompaBetonImages = [pompaBeton1, pompaBeton2, pompaBeton3, pompaBeton4, pompaBeton5, pompaBeton6, pompaBeton7, pompaBeton8];
const trowelImages = [trowel1];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [serviceImageIndex, setServiceImageIndex] = useState({});
  
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
      question: "Bagaimana cara memesan layanan?",
      answer: "Hubungi tim marketing kami via WhatsApp atau telepon. Konsultasikan kebutuhan proyek Anda, tim kami akan memberikan penawaran harga dan jadwal pelaksanaan yang sesuai."
    }
  ];

  const services = [
    {
      id: 1,
      title: "Beton Readymix",
      icon: Building2,
      images: betonReadymixImages,
      description: "Beton cor siap pakai dengan mutu K-125 hingga K-500 untuk pondasi gedung, jalan raya, jembatan, dan infrastruktur lainnya.",
      features: ["Mutu lengkap K-125 s/d K-500", "Waktu pengerasan 60-90 menit", "Slump test 8-12 cm", "Bebas retak & porosity rendah"],
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 2,
      title: "Sewa Pompa Beton",
      icon: Truck,
      images: pompaBetonImages,
      description: "Pompa beton untuk memindahkan beton cair ke lokasi pengecoran yang sulit dijangkau. Cocok untuk proyek bertingkat dan area dengan akses terbatas.",
      features: ["Pompa Mini (12-30m)", "Pompa Standar (18-40m)", "Pompa Longboom (24-50m)", "Pompa Moli (36-200m)"],
      gradient: "from-purple-600 to-pink-600"
    },
    {
      id: 3,
      title: "Jasa Finishing Trowel",
      icon: Brush,
      images: trowelImages,
      description: "Menghaluskan permukaan lantai beton menggunakan mesin khusus, menghasilkan lantai rata, halus, anti slip, dan tahan lama.",
      features: ["Permukaan rata & halus", "Anti retak & awet", "Ketahanan tinggi terhadap benturan", "Anti slip & aman"],
      gradient: "from-emerald-600 to-teal-600"
    }
  ];

  const testimonials = [
    { id: 1, name: "Bapak Ahmad", project: "Pembangunan Ruko 3 Lantai", text: "Pelayanan sangat profesional dan tepat waktu. Beton readymix berkualitas tinggi, hasil cor sangat memuaskan.", rating: 5 },
    { id: 2, name: "Ibu Siti", project: "Renovasi Pabrik", text: "Sewa pompa beton sangat membantu proyek kami. Akses ke area pabrik yang sempit tidak masalah dengan pompa mini mereka.", rating: 5 },
    { id: 3, name: "Bapak Budi", project: "Pembangunan Perumahan", text: "Kombinasi beton readymix dan finishing trowel menghasilkan lantai yang sangat rata dan halus. Harga kompetitif.", rating: 5 },
    { id: 4, name: "Ibu Rina", project: "Gudang Logistik", text: "Layanan finishing trowel sangat memuaskan. Lantai gudang menjadi rata, anti slip, dan tahan lama.", rating: 5 },
  ];

  const nextServiceImage = (serviceId, images) => {
    setServiceImageIndex(prev => ({ ...prev, [serviceId]: ((prev[serviceId] || 0) + 1) % images.length }));
  };

  const prevServiceImage = (serviceId, images) => {
    setServiceImageIndex(prev => ({ ...prev, [serviceId]: ((prev[serviceId] || 0) - 1 + images.length) % images.length }));
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const renderStars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
  ));

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const text = `Halo Niaga Solusi Mandiri, saya ingin berkonsultasi.%0A%0A` +
                 `*Nama:* ${contactForm.name}%0A` +
                 `*No. HP:* ${contactForm.phone}%0A` +
                 `*Layanan:* ${contactForm.service || 'Belum dipilih'}%0A` +
                 `*Pesan:* ${contactForm.message}`;

    const waUrl = `https://wa.me/6281315913559?text=${text}`;
    
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsSubmitting(false);
      setContactForm({ name: '', phone: '', service: '', message: '' });
    }, 800);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const renderServiceCard = (service, idx) => {
    const Icon = service.icon;
    const currentIndex = serviceImageIndex[service.id] || 0;
    const hasMultipleImages = service.images.length > 1;

    return (
      // ✅ PERBAIKAN 1: Menambahkan key={service.id} untuk menghilangkan warning React
      <div key={service.id} data-aos="fade-up" data-aos-delay={idx * 100} className="group bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-2 relative">
        {/* ✅ PERBAIKAN 2: Menggunakan bg-linear-to-r sesuai saran Tailwind IntelliSense */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${service.gradient}`}></div>
        
        <div className="relative h-56 overflow-hidden bg-slate-800">
          {service.images.map((img, imgIdx) => (
            <div key={imgIdx} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${imgIdx === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
              <img src={img} alt={`${service.title} ${imgIdx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
          
          <div className="absolute top-4 left-4 p-2.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg">
            <Icon className="w-6 h-6 text-indigo-400" />
          </div>

          {hasMultipleImages && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevServiceImage(service.id, service.images); }} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-indigo-600 rounded-full transition-all duration-300 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextServiceImage(service.id, service.images); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-indigo-600 rounded-full transition-all duration-300 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {service.images.map((_, imgIdx) => (
                  <button key={imgIdx} onClick={(e) => { e.stopPropagation(); setServiceImageIndex(prev => ({ ...prev, [service.id]: imgIdx })); }} className={`transition-all duration-300 rounded-full ${imgIdx === currentIndex ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{service.title}</h3>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed">{service.description}</p>
          <ul className="space-y-2.5 mb-6">
            {service.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => scrollToSection('contact')} className="w-full py-3 bg-slate-800 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700 hover:border-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
            <span>Konsultasi Sekarang</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden">
      <Layout>
        <SEO title="Solusi Pompa Beton | Sewa Pompa Beton & Supplier Beton Cor Tangerang" description="Niaga Solusi Mandiri - Penyedia jasa sewa pompa beton, beton readymix, dan finishing trowel di Tangerang. Hemat Waktu, Hemat Biaya, Hemat Tenaga." canonicalUrl="https://solusipompabeton.com/" />

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/40 z-10"></div>
                <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right" data-aos-duration="1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 backdrop-blur-sm">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-300 tracking-wide">NIAGA SOLUSI MANDIRI</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  Solusi Beton & <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">Pompa Beton Terpercaya</span>
                </h1>

                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { icon: Timer, text: "Hemat Waktu" },
                    { icon: Wallet, text: "Hemat Biaya" },
                    { icon: HandMetal, text: "Hemat Tenaga" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} data-aos="fade-up" data-aos-delay={300 + (i * 100)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-semibold backdrop-blur-sm hover:bg-emerald-500/20 transition-colors">
                        <Icon className="w-4 h-4" /> {item.text}
                      </div>
                    );
                  })}
                </div>

                <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                  Supplier beton cor Tangerang dengan pengalaman 10+ tahun. Melayani beton readymix, sewa pompa beton, dan finishing trowel untuk proyek konstruksi Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => scrollToSection('services')} className="group px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-1">
                    <span>Lihat Layanan</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-1">
                    <MessageCircle className="w-5 h-5" />
                    <span>Hubungi via WA</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-800">
                  {[
                    { number: "10+", label: "Tahun Pengalaman", icon: Award },
                    { number: "500+", label: "Proyek Selesai", icon: CheckCircle },
                    { number: "50+", label: "Unit Pompa", icon: Truck },
                    { number: "24/7", label: "Jam Layanan", icon: Clock }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="text-center group cursor-default">
                        <Icon className="w-6 h-6 text-indigo-400 mx-auto mb-2 group-hover:scale-125 group-hover:text-purple-400 transition-all duration-300" />
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                        <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:block" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 p-8">
                    <div className="aspect-square bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center p-8 border border-slate-700/50">
                      <div className="text-center">
                        <div className="w-40 h-40 rounded-2xl bg-white shadow-xl flex items-center justify-center mx-auto mb-6 p-4 border border-slate-200 hover:scale-105 transition-transform duration-500">
                          {logoNsm ? <img src={logoNsm} alt="Niaga Solusi Mandiri" className="w-full h-full object-contain" /> : <span className="text-5xl font-bold text-indigo-600">NSM</span>}
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">Niaga Solusi Mandiri</h3>
                        <p className="text-slate-400 text-sm mt-2 font-medium">Readymix & Concrete Pump</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Terpercaya
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                            <Zap className="w-3.5 h-3.5 text-amber-400" /> Profesional
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
        <section id="services" className="py-24 px-4 bg-slate-950 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-800 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Brush className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">LAYANAN KAMI</span>
              </div>
              <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Solusi Konstruksi Terpadu
              </h2>
              <p data-aos="fade-up" data-aos-delay="200" className="text-slate-400 max-w-2xl mx-auto text-lg">
                Kami menghadirkan efisiensi maksimal dengan prinsip <span className="text-emerald-400 font-semibold">Hemat Waktu, Hemat Biaya, Hemat Tenaga</span> untuk setiap proyek Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => renderServiceCard(service, idx))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 px-4 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div data-aos="fade-right">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">
                  Mengapa Memilih <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Niaga Solusi Mandiri?</span>
                </h2>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  Kami tidak hanya menyediakan material, tetapi juga memberikan solusi yang membuat proyek Anda berjalan lebih efisien dari segala aspek.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: Timer, title: "Hemat Waktu", desc: "Jadwal pengiriman presisi dan armada siap pakai memastikan proyek Anda tidak terhambat." },
                    { icon: Wallet, title: "Hemat Biaya", desc: "Harga kompetitif langsung dari supplier, tanpa perantara, dengan kualitas mutu terjamin." },
                    { icon: HandMetal, title: "Hemat Tenaga", desc: "Didukung operator profesional dan mesin modern, mengurangi beban kerja manual di lapangan." }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="flex gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
                <div className="space-y-4 mt-8">
                  <div className="bg-linear-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-900/20">
                    <Users className="w-8 h-8 mx-auto mb-3 text-indigo-200" />
                    <p className="text-3xl font-bold">20+</p>
                    <p className="text-sm text-indigo-200">Tenaga Ahli</p>
                  </div>
                  <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-900/20">
                    <Building2 className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
                    <p className="text-3xl font-bold">500+</p>
                    <p className="text-sm text-emerald-200">Proyek Selesai</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-linear-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-900/20">
                    <Truck className="w-8 h-8 mx-auto mb-3 text-purple-200" />
                    <p className="text-3xl font-bold">50+</p>
                    <p className="text-sm text-purple-200">Unit Armada</p>
                  </div>
                  <div className="bg-linear-to-br from-amber-600 to-amber-800 rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-900/20">
                    <Star className="w-8 h-8 mx-auto mb-3 text-amber-200" />
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm text-amber-200">Kepuasan Klien</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-4 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Quote className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">TESTIMONI</span>
              </div>
              <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Apa Kata Klien Kami
              </h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full shrink-0 px-4">
                      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl relative">
                        <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-800" />
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-indigo-400 font-medium">{testimonial.project}</p>
                          </div>
                        </div>
                        <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                        <p className="text-slate-300 leading-relaxed text-lg italic">"{testimonial.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="p-3 rounded-full bg-slate-800 hover:bg-indigo-600 text-white transition-all duration-300 border border-slate-700 hover:border-indigo-500">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`transition-all duration-300 rounded-full ${index === currentTestimonial ? 'w-8 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-700 hover:bg-slate-600'}`} />
                  ))}
                </div>
                <button onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)} className="p-3 rounded-full bg-slate-800 hover:bg-indigo-600 text-white transition-all duration-300 border border-slate-700 hover:border-indigo-500">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area Section */}
        <section id="service-area" className="py-24 px-4 bg-slate-900 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">WILAYAH LAYANAN</span>
              </div>
              <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Melayani Tangerang Raya & Sekitarnya
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { region: "Tangerang Raya", areas: ["BSD City", "Alam Sutera", "Gading Serpong", "Bintaro Jaya", "Pondok Aren", "Ciputat", "Pamulang", "Serpong"] },
                { region: "Tangerang Selatan", areas: ["BSD", "Bintaro", "Pondok Aren", "Ciputat Timur", "Pamulang Barat", "Serpong Utara", "Setu", "Jurang Mangu"] }
              ].map((region, regionIdx) => (
                <div key={regionIdx} data-aos="fade-up" data-aos-delay={regionIdx * 100} className="bg-slate-950 rounded-2xl p-8 border border-slate-800 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/5">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg"><MapPin className="w-5 h-5 text-indigo-400" /></div>
                    {region.region}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {region.areas.map((area, areaIdx) => (
                      <div key={areaIdx} className="flex items-center gap-2.5 p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-sm text-slate-300 font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-4 bg-slate-950">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MessageCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">FAQ</span>
              </div>
              <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={idx * 100} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
                  <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition duration-300">
                    <span className="font-semibold text-white pr-4 text-lg">{faq.question}</span>
                    {openFaq === idx ? <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6" data-aos="fade-down" data-aos-duration="300">
                      <p className="text-slate-400 border-t border-slate-800 pt-4 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div data-aos="fade-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-300 tracking-wide">KONTAK KAMI</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                  Siap Memulai Proyek Anda?
                </h2>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                  Hubungi tim marketing kami untuk konsultasi gratis dan penawaran terbaik. Kami siap mewujudkan <span className="text-emerald-400 font-semibold">Hemat Waktu, Hemat Biaya, Hemat Tenaga</span> untuk proyek Anda.
                </p>

                <div className="space-y-4 mb-10">
                  <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-medium mb-1">Marketing 1 (Ade SE)</div>
                      <div className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">+62 813-1591-3559</div>
                    </div>
                  </a>
                  <a href="https://wa.me/6285780679887" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-medium mb-1">Marketing 2 (Zulfikar)</div>
                      <div className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">+62 857-8067-9887</div>
                    </div>
                  </a>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href="https://wa.me/6281315913559" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/40 hover:-translate-y-1">
                    <MessageCircle className="w-5 h-5" /> Chat WhatsApp
                  </a>
                </div>
              </div>

              <div data-aos="fade-left" className="bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Kirim Pesan Cepat</h3>
                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500" 
                      placeholder="Nama Anda" 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">No. Telepon / WA</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500" 
                        placeholder="0812-xxxx-xxxx" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Kebutuhan</label>
                      <select 
                        name="service"
                        value={contactForm.service}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white"
                      >
                        <option value="">Pilih layanan</option>
                        <option value="Beton Readymix">Beton Readymix</option>
                        <option value="Sewa Pompa Beton">Sewa Pompa Beton</option>
                        <option value="Finishing Trowel">Finishing Trowel</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Detail Kebutuhan</label>
                    <textarea 
                      rows="4" 
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-slate-500 resize-none" 
                      placeholder="Contoh: Butuh beton K-300 sebanyak 20 m³ untuk cor lantai dasar..." 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim ke WhatsApp</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}