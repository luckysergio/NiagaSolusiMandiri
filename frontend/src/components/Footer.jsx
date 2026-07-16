import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(path), 100);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const socialLinks = [
    { name: "Instagram", url: "https://www.instagram.com/nsmreadymixdanconcretepump", color: "hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> },
    { name: "TikTok", url: "https://www.tiktok.com/@rentalpompadanjualbeton", color: "hover:text-white hover:bg-slate-700/50 hover:border-slate-600", icon: <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /> },
    { name: "Facebook", url: "https://web.facebook.com/niagasolusimandiri", color: "hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30", icon: <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" /> },
    { name: "YouTube", url: "https://youtube.com/@nsmreadymixconcretepump", color: "hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30", icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
    { name: "Google Maps", url: "https://www.google.com/maps/place/Rental+Pompa+Beton+dan+Jual+Beton+Readymix+%26+Minimix/@-6.3163019,106.6760241,17z", color: "hover:text-green-400 hover:bg-green-500/10 hover:border-green-500/30", icon: <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /> }
  ];

  const quickLinks = [
    { name: "Beranda", path: "/" },
    { name: "Tentang Kami", path: "/tentang" },
    { name: "Layanan", path: "/layanan" },
    { name: "Blog", path: "/blog" },
    { name: "Kontak", path: "/kontak" }
  ];

  const serviceLinks = [
    { name: "Beton Cor Readymix", path: "/layanan/beton-readymix" },
    { name: "Sewa Pompa Beton", path: "/layanan/pompa-beton" },
    { name: "Jasa Finishing", path: "/layanan/jasa-finishing" }
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      {/* Back to Top Button */}
      <button onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:scale-110 hover:shadow-xl transition-all duration-300 group"
        aria-label="Back to top">
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-indigo-500 rounded-full" />
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">NIAGA SOLUSI MANDIRI</h2>
                <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Solusi Pompa Beton & Beton Cor</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Penyedia jasa sewa pompa beton dan supplier beton cor profesional & terpercaya di Tangerang dan sekitarnya. Berpengalaman lebih dari 10 tahun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => handleLinkClick(link.path)}
                    className="text-slate-400 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
              Layanan Kami
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <button onClick={() => handleLinkClick(link.path)}
                    className="text-slate-400 hover:text-indigo-400 transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+6281315913559" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span className="text-indigo-400">📞</span> Ade SE: +62 813 1591 3559
                </a>
              </li>
              <li>
                <a href="tel:+6285780679887" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span className="text-indigo-400">📞</span> Zulfikar: +62 857 8067 9887
                </a>
              </li>
              <li>
                <a href="mailto:adminwebsitensm@gmail.com" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                  <span className="text-indigo-400">✉️</span> adminwebsitensm@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                className={`p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 transition-all duration-300 hover:scale-110 ${social.color}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">{social.icon}</svg>
              </a>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-400">© {currentYear} Niaga Solusi Mandiri. All rights reserved.</p>
            <p className="text-xs text-slate-500 mt-1">Solusi Pompa Beton & Beton Cor Tangerang</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;