import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/nsmreadymixdanconcretepump",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: "hover:text-pink-400 hover:bg-pink-500/10",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@rentalpompadanjualbeton",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      color: "hover:text-white hover:bg-slate-700/50",
    },
    {
      name: "Facebook",
      url: "https://web.facebook.com/niagasolusimandiri",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      color: "hover:text-blue-400 hover:bg-blue-500/10",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@nsmreadymixconcretepump?si=45HAM8Vx3v8ZiKVm",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      color: "hover:text-red-400 hover:bg-red-500/10",
    },
    {
      name: "Google Maps",
      url: "https://www.google.com/maps/place/Rental+Pompa+Beton+dan+Jual+Beton+Readymix+%26+Minimix/@-6.3163019,106.6760241,17z/data=!4m6!3m5!1s0x2e69e54759895b53:0x77543ba4b3b053f8!8m2!3d-6.3163097!4d106.6760263!16s%2Fg%2F11vzy_bytc?hl=id&entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
      color: "hover:text-green-400 hover:bg-green-500/10",
    },
  ];

  const quickLinks = [
    { name: "Beranda", path: "/" },
    { name: "Tentang Kami", path: "/tentang" },
    { name: "Layanan", path: "/layanan" },
    { name: "Blog", path: "/blog" }, // Tambahkan Blog
    { name: "Kontak", path: "/kontak" }
  ];

  const serviceLinks = [
    { name: "Beton Cor Readymix", path: "/layanan/beton-readymix" },
    { name: "Sewa Pompa Beton", path: "/layanan/pompa-beton" },
    { name: "Jasa Finishing", path: "/layanan/jasa-finishing" }
  ];

  return (
    <footer className="relative bg-slate-900 border-t border-slate-700/50 overflow-hidden">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-3 bg-indigo-600 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group hover:shadow-xl shadow-indigo-600/25"
        aria-label="Back to top"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>

      <div className="relative container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col items-center lg:items-start space-y-6 max-w-lg w-full">
            <div className="relative group text-center lg:text-left">
              <div className="flex items-center gap-4 mb-3 justify-center lg:justify-start">
                <div className="w-1 h-12 bg-indigo-500 rounded-full group-hover:h-14 transition-all duration-300" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    NIAGA SOLUSI MANDIRI
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 tracking-wide">
                    Solusi Pompa Beton & Beton Cor
                  </p>
                </div>
              </div>
              <div className="ml-0 lg:ml-6 p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                <p className="text-sm text-slate-300 leading-relaxed text-center lg:text-left">
                  Penyedia jasa sewa pompa beton dan supplier beton cor profesional & terpercaya di Tangerang dan sekitarnya. Berpengalaman lebih dari 10 tahun.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12 w-full">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white mb-4 relative inline-block lg:inline-block">
                Tautan Cepat
                <span className="absolute -bottom-2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-12 h-0.5 bg-indigo-500 rounded-full" />
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer justify-center lg:justify-start mx-auto lg:mx-0"
                    >
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white mb-4 relative inline-block lg:inline-block">
                Layanan Kami
                <span className="absolute -bottom-2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-12 h-0.5 bg-indigo-500 rounded-full" />
              </h3>
              <ul className="space-y-2">
                {serviceLinks.map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className="text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer justify-center lg:justify-start mx-auto lg:mx-0"
                    >
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white mb-4 relative inline-block lg:inline-block">
                Kontak
                <span className="absolute -bottom-2 left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 w-12 h-0.5 bg-indigo-500 rounded-full" />
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="text-slate-400">
                  <a href="tel:+6281315913559" className="hover:text-white transition">📞 Ade SE: +62 813 1591 3559</a>
                </li>
                <li className="text-slate-400">
                  <a href="tel:+6285780679887" className="hover:text-white transition">📞 Zulfikar: +62 857 8067 9887</a>
                </li>
                <li className="text-slate-400">
                  <a href="mailto:adminwebsitensm@gmail.com" className="hover:text-white transition">✉️ adminwebsitensm@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-6 relative">
            Terhubung Dengan Kami
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-indigo-500 rounded-full" />
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className={`relative p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg hover:border-slate-600`}>
                  <span className="relative z-10 block">
                    {social.icon}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-sm text-slate-400">
            © {currentYear} Niaga Solusi Mandiri. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Solusi Pompa Beton & Beton Cor Tangerang
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;