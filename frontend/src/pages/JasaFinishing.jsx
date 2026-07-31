import SEO from "../components/SEO";
import Layout from "../components/Layout";
import { useEffect, useState, useCallback, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
  MapPin,
  Timer,
  Wallet,
  HandMetal,
} from "lucide-react";

import trowel1 from "../assets/images/trowel/1.webp";

const heroImages = [trowel1];

export default function JasaFinishing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: "ease-out-cubic",
    });
    const handleLoad = () => AOS.refresh();
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const tigaHemat = [
    {
      icon: Timer,
      title: "Hemat Waktu",
      desc: "Pengerjaan cepat dengan tim profesional dan mesin modern, mengurangi downtime proyek secara signifikan.",
      color: "from-blue-600 to-cyan-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-300",
    },
    {
      icon: Wallet,
      title: "Hemat Biaya",
      desc: "Harga transparan per m² tanpa biaya tersembunyi. Material efisien meminimalkan pemborosan anggaran.",
      color: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-300",
    },
    {
      icon: HandMetal,
      title: "Hemat Tenaga",
      desc: "Menggunakan mesin trowel modern menggantikan tenaga manual, menghasilkan permukaan lebih rata dan konsisten.",
      color: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-300",
    },
  ];

  const hargaFinishing = [
    {
      dosis: "3 Kg/m²",
      naturalLokal: "Rp 30.000/m²",
      warnaLokal: "Rp 40.000/m²",
      naturalSika: "Rp 40.000/m²",
      warnaSika: "Rp 50.000/m²",
    },
    {
      dosis: "5 Kg/m²",
      naturalLokal: "Rp 40.000/m²",
      warnaLokal: "Rp 50.000/m²",
      naturalSika: "Rp 50.000/m²",
      warnaSika: "Rp 60.000/m²",
    },
  ];

  const jasaTrowel = { jasa: "Jasa Trowel Saja", harga: "Rp 12.000/m²" };

  const keunggulan = [
    {
      icon: Sparkles,
      title: "Hasil Premium",
      desc: "Permukaan rata, halus, dan tahan lama",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      icon: Shield,
      title: "Bahan Berkualitas",
      desc: "Menggunakan merek terpercaya Sika/Fosroc",
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      icon: Award,
      title: "Tenaga Profesional",
      desc: "Tim berpengalaman dan terlatih khusus",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      icon: Zap,
      title: "Pengerjaan Cepat",
      desc: "Proses rapi dan selesai tepat waktu",
      gradient: "from-amber-600 to-orange-600",
    },
    {
      icon: Clock,
      title: "Garansi Kepuasan",
      desc: "Hasil kerja terjamin dan terjaga kualitasnya",
      gradient: "from-rose-600 to-red-600",
    },
    {
      icon: Ruler,
      title: "Harga Kompetitif",
      desc: "Penawaran bersaing dan transparan",
      gradient: "from-indigo-600 to-purple-600",
    },
  ];

  const aplikasiFinishing = [
    "Gudang dan pabrik",
    "Parkiran gedung bertingkat",
    "Lantai showroom",
    "Area loading dock",
    "Lantai rumah sakit",
    "Lantai supermarket",
  ];

  const prosesPengerjaan = [
    {
      step: "01",
      title: "Konsultasi",
      desc: "Diskusi kebutuhan dan spesifikasi",
    },
    {
      step: "02",
      title: "Survey Lokasi",
      desc: "Tim kami survey area yang akan dikerjakan",
    },
    {
      step: "03",
      title: "Pengerjaan",
      desc: "Proses finishing dengan tenaga profesional",
    },
    {
      step: "04",
      title: "Quality Control",
      desc: "Pengecekan hasil akhir secara ketat",
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
        title="Jasa Finishing Lantai Beton & Floor Hardener Tangerang"
        description="Jasa finishing lantai beton, floor hardener, dan trowel profesional di Tangerang. Hemat Waktu, Hemat Biaya, Hemat Tenaga. Harga mulai Rp 12.000/m². Bahan Sika/Fosroc."
        canonicalUrl="https://betoncortangerang.com/layanan/jasa-finishing"
      />

      <main className="overflow-x-hidden">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/90 to-slate-950/70 z-10"></div>
            <img
              src={heroImages[0]}
              alt="Jasa finishing trowel lantai beton Niaga Solusi Mandiri"
              className="w-full h-full object-cover scale-105"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1920"
              height="1080"
            />
          </div>

          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
              <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/20"
              >
                <HardHat
                  className="w-4 h-4 text-indigo-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">
                  Jasa Finishing
                </span>
              </div>

              <h1
                data-aos="zoom-in"
                data-aos-duration="1000"
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-2xl max-w-5xl"
              >
                <span className="block">Jasa Finishing &</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                  Floor Hardener Profesional
                </span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-2"
              >
                Layanan finishing lantai beton dengan hasil rata, halus, dan
                tahan lama. Menggunakan bahan berkualitas untuk hasil maksimal
                di setiap proyek.
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex flex-wrap justify-center gap-2 sm:gap-3"
              >
                {tigaHemat.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 ${item.bg} border ${item.border} rounded-lg sm:rounded-xl ${item.text} text-xs sm:text-sm font-bold backdrop-blur-md hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg`}
                    >
                      <Icon
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">{item.title}</span>
                      <span className="sm:hidden">
                        {item.title.split(" ")[1]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4"
              >
                <button
                  onClick={() => scrollToSection("contact")}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <MessageCircle
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                  <span>Pesan Sekarang</span>
                </button>
                <button
                  onClick={() => scrollToSection("harga")}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-slate-600/50 hover:border-indigo-500/50 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg w-full sm:w-auto"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  <span>Lihat Harga</span>
                </button>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10 w-full max-w-xl"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Shield
                    className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    10+ Tahun
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Award
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-medium">SNI</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                  <Clock
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm font-medium">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Hemat */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <Zap className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-emerald-300 tracking-wide">
                  MENGAPA FINISHING KAMI?
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Solusi{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                  3 Hemat
                </span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Memilih jasa finishing kami adalah keputusan strategis untuk
                efisiensi proyek Anda dari segala aspek.
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
                    className={`relative group bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border ${item.border} hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${item.bg} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon
                          className={`w-6 h-6 sm:w-8 sm:h-8 ${item.text}`}
                          aria-hidden="true"
                        />
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

        {/* Harga */}
        <section id="harga" className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-5xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Info className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                  DAFTAR HARGA
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Harga Floor Hardener
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Harga per meter persegi (m²) termasuk material dan jasa
              </p>
            </div>
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="overflow-x-auto rounded-2xl border border-slate-700/50 shadow-2xl"
            >
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base rounded-tl-2xl">
                      Dosis
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base">
                      Natural Lokal
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base">
                      Warna Lokal
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base">
                      Sika Natural
                    </th>
                    <th className="py-4 px-4 sm:px-6 text-center font-bold text-sm sm:text-base rounded-tr-2xl">
                      Sika Warna
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hargaFinishing.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-700/50 transition-colors ${idx % 2 === 0 ? "bg-slate-800/50" : "bg-slate-700/30"} hover:bg-indigo-500/10`}
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-white text-sm sm:text-base">
                        {item.dosis}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">
                        {item.naturalLokal}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">
                        {item.warnaLokal}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">
                        {item.naturalSika}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-slate-300 text-sm sm:text-base font-medium">
                        {item.warnaSika}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div data-aos="fade-up" data-aos-delay="150" className="mt-6">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Brush
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-bold text-lg sm:text-xl">
                      {jasaTrowel.jasa}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold">
                    {jasaTrowel.harga}
                  </div>
                </div>
              </div>
            </div>
            <div
              data-aos="fade-up"
              className="mt-6 p-4 sm:p-6 bg-slate-800/50 rounded-xl text-center border border-slate-700/50"
            >
              <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
                <Info
                  className="w-4 h-4 text-indigo-400 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Harga dapat berubah sewaktu-waktu. Hubungi kami untuk{" "}
                  <strong className="text-white">
                    harga khusus volume besar
                  </strong>{" "}
                  dan ketersediaan di lokasi Anda.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Keunggulan */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Award className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                  KEUNGGULAN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Keunggulan Finishing Kami
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Berbagai keunggulan yang membuat layanan finishing kami menjadi
                pilihan utama
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {keunggulan.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                    className="group bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5 text-center"
                  >
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-linear-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon
                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Aplikasi & Proses */}
        <section className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div data-aos="fade-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                  <PaintBucket
                    className="w-4 h-4 text-indigo-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                    APLIKASI
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight">
                  Aplikasi Finishing Lantai
                </h2>
                <p className="text-slate-300 mb-8 text-sm sm:text-base leading-relaxed">
                  Layanan finishing lantai kami cocok untuk berbagai jenis
                  bangunan dan area, dengan hasil yang optimal dan tahan lama.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {aplikasiFinishing.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle
                          className="w-4 h-4 text-emerald-400"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-sm sm:text-base font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div data-aos="fade-left" className="space-y-6">
                <div className="bg-slate-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-700/50 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-indigo-500/20">
                    <Sparkles
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    Hasil Finishing Premium
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                    Kami menggunakan bahan berkualitas Sika/Fosroc dan teknologi
                    modern untuk menghasilkan lantai yang rata, halus, dan tahan
                    lama.
                  </p>
                  <div className="flex justify-center gap-6 sm:gap-8 text-sm">
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex-1">
                      <div className="font-extrabold text-2xl sm:text-3xl text-white mb-1">
                        100+
                      </div>
                      <div className="text-slate-400 text-xs sm:text-sm">
                        Proyek Selesai
                      </div>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex-1">
                      <div className="font-extrabold text-2xl sm:text-3xl text-white mb-1">
                        100%
                      </div>
                      <div className="text-slate-400 text-xs sm:text-sm">
                        Kepuasan Klien
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {prosesPengerjaan.map((item, idx) => (
                    <div
                      key={idx}
                      data-aos="zoom-in"
                      data-aos-delay={idx * 100}
                      className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all text-center"
                    >
                      <div className="w-10 h-10 mx-auto bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2 shadow-md">
                        {item.step}
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wilayah Layanan */}
        <section className="py-16 sm:py-24 px-4 bg-slate-950 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <MapPin
                  className="w-4 h-4 text-indigo-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                  WILAYAH LAYANAN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Melayani Tangerang Raya & Sekitarnya
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Respon cepat dan pengerjaan tepat waktu ke berbagai kawasan
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
                      <MapPin
                        className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {region.region}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {region.areas.map((area, areaIdx) => (
                      <div
                        key={areaIdx}
                        className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300"
                      >
                        <CheckCircle
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0"
                          aria-hidden="true"
                        />
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
                Hubungi kami untuk konfirmasi ketersediaan layanan.
              </p>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-600/25"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Hubungi Kami Sekarang</span>
              </button>
            </div>
          </div>
        </section>

        {/* Spesifikasi */}
        <section className="py-16 sm:py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Ruler className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span className="text-sm font-semibold text-indigo-300 tracking-wide">
                  SPESIFIKASI
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Spesifikasi Teknis
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                Standar kualitas yang kami terapkan untuk setiap proyek
                finishing
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Ketebalan Minimal", value: "5 cm" },
                { label: "Kekerasan", value: "60-70 MPa" },
                { label: "Toleransi Kerataan", value: "± 2mm" },
                { label: "Garansi Pengerjaan", value: "6 bulan" },
              ].map((spec, idx) => (
                <div
                  key={idx}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl text-center border border-slate-700/50 hover:border-indigo-500/30 transition-all"
                >
                  <div className="text-xs text-slate-400 mb-1 sm:mb-2">
                    {spec.label}
                  </div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="py-16 sm:py-24 px-4 bg-linear-to-br from-indigo-950 via-slate-950 to-purple-950 relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          ></div>
          <div
            className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          ></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div data-aos="fade-up">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
                Butuh Jasa Finishing Lantai?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                Hubungi tim marketing kami untuk konsultasi kebutuhan, estimasi
                volume, dan penawaran harga terbaik untuk proyek Anda.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
                <a
                  href="https://wa.me/6281315913559"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/25"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />{" "}
                  WhatsApp Ade SE
                </a>
                <a
                  href="https://wa.me/6285780679887"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-600/25"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />{" "}
                  WhatsApp Zulfikar
                </a>
                <a
                  href="/kontak"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all hover:scale-105 border border-slate-700"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" /> Halaman
                  Kontak
                </a>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                <Clock
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400"
                  aria-hidden="true"
                />
                Konsultasi gratis • Respon cepat • Harga bersaing
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
