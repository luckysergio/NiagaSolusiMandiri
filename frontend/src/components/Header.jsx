import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Truck, 
  Building2, 
  HardHat, 
  Menu, 
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Home,
  Info,
  Mail,
  FileText, // Tambahkan FileText untuk icon Blog
} from 'lucide-react';
import logoNsm from '../assets/logo-nsm.png';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup mobile menu saat navigasi
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  // Cek apakah path aktif untuk layanan
  const isServicesActive = () => {
    return location.pathname.startsWith('/layanan');
  };

  const serviceCategories = [
    {
      title: "Beton Readymix",
      icon: Building2,
      path: "/layanan/beton-readymix",
      description: "Kualitas terbaik untuk konstruksi Anda",
    },
    {
      title: "Sewa Pompa Beton",
      icon: Truck,
      path: "/layanan/pompa-beton",
      description: "Berbagai kapasitas sesuai kebutuhan",
    },
    {
      title: "Jasa Finishing",
      icon: HardHat,
      path: "/layanan/jasa-finishing",
      description: "Hasil profesional dan rapi",
    }
  ];

  const contactNumbers = {
    ade: "6281315913559",
    zulfikar: "6285780679887"
  };

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/tentang", label: "Tentang", icon: Info },
    { to: "/layanan", label: "Layanan", icon: Building2 },
    { to: "/blog", label: "Blog", icon: FileText },
    { to: "/kontak", label: "Kontak", icon: Mail }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-slate-700/50' 
        : 'bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50'
    }`}>
      <nav className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-lg shadow-indigo-500/20 overflow-hidden p-1">
              <img 
                src={logoNsm} 
                alt="Niaga Solusi Mandiri" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-sm lg:text-base">Niaga Solusi Mandiri</span>
              <div className="text-xs text-slate-400 font-normal">Readymix &amp; Concrete Pump</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.label === "Layanan") {
                return (
                  <div 
                    key={link.to}
                    className="relative" 
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isServicesOpen || isServicesActive()
                          ? 'text-white bg-slate-700/50'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                      }`}
                    >
                      Layanan
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isServicesOpen && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-2">
                          {serviceCategories.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                              <Link
                                key={idx}
                                to={service.path}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
                                onClick={() => setIsServicesOpen(false)}
                              >
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white group-hover:text-indigo-400">
                                    {service.title}
                                  </h4>
                                  <p className="text-xs text-slate-400">{service.description}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-slate-700/50 p-3 bg-slate-800/50">
                          <Link 
                            to="/layanan" 
                            className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            Lihat Semua Layanan →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={({ isActive }) => 
                    `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-white bg-slate-700/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Contact Buttons Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${contactNumbers.ade}?text=Halo%20Ade%20SE%2C%20saya%20tertarik%20dengan%20layanan%20Solusi%20Pompa%20Beton.%20Mohon%20informasinya.`}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-lg shadow-emerald-600/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:+${contactNumbers.ade}`}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-700 hover:text-white transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              <span>Telepon</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-1 bg-slate-900 rounded-xl p-4 border border-slate-700/50 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              if (link.label === "Layanan") {
                return (
                  <div key={link.to}>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-700/50 transition text-slate-300 font-medium ${
                        isMobileServicesOpen || isServicesActive() ? 'bg-slate-700/30' : ''
                      }`}
                    >
                      <span>Layanan</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileServicesOpen && (
                      <div className="pl-4 space-y-2 mt-2">
                        {serviceCategories.map((service, idx) => {
                          const Icon = service.icon;
                          return (
                            <Link
                              key={idx}
                              to={service.path}
                              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-700/50 transition"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobileServicesOpen(false);
                              }}
                            >
                              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                <Icon className="w-4 h-4 text-indigo-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{service.title}</div>
                                <div className="text-xs text-slate-400">{service.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                        <Link
                          to="/layanan"
                          className="block py-2 px-4 text-sm text-indigo-400 font-medium hover:text-indigo-300"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileServicesOpen(false);
                          }}
                        >
                          Lihat Semua Layanan →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={`block py-3 px-4 rounded-lg hover:bg-slate-700/50 transition text-slate-300 font-medium ${
                    location.pathname === link.to ? 'bg-slate-700/30 text-white' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Contact Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-2">
              <a
                href={`https://wa.me/${contactNumbers.ade}?text=Halo%20Ade%20SE%2C%20saya%20tertarik%20dengan%20layanan%20Solusi%20Pompa%20Beton.%20Mohon%20informasinya.`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-600/25"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={`tel:+${contactNumbers.ade}`}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-700 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                Telepon
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}