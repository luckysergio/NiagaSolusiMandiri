import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Truck, Building2, HardHat, Menu, X, 
  Phone, MessageCircle, Home, Info, Mail, FileText 
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
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
    closeTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 150);
  };

  const isServicesActive = () => location.pathname.startsWith('/layanan');

  const serviceCategories = [
    { title: "Beton Readymix", icon: Building2, path: "/layanan/beton-readymix", description: "Kualitas terbaik untuk konstruksi Anda" },
    { title: "Sewa Pompa Beton", icon: Truck, path: "/layanan/pompa-beton", description: "Berbagai kapasitas sesuai kebutuhan" },
    { title: "Jasa Finishing", icon: HardHat, path: "/layanan/jasa-finishing", description: "Hasil profesional dan rapi" }
  ];

  const contactNumbers = { ade: "6281315913559", zulfikar: "6285780679887" };

  const navLinks = [
    { to: "/", label: "Beranda", icon: Home },
    { to: "/tentang", label: "Tentang", icon: Info },
    { to: "/layanan", label: "Layanan", icon: Building2 },
    { to: "/blog", label: "Blog", icon: FileText },
    { to: "/kontak", label: "Kontak", icon: Mail }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800/50' 
        : 'bg-slate-950/50 backdrop-blur-md border-b border-transparent'
    }`}>
      <nav className="container mx-auto px-4 lg:px-8 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-white rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-lg shadow-indigo-500/10 overflow-hidden p-1.5">
              <img src={logoNsm} alt="Niaga Solusi Mandiri" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-sm lg:text-base tracking-wide">Niaga Solusi Mandiri</span>
              <div className="text-xs text-slate-400 font-medium">Readymix & Concrete Pump</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.label === "Layanan") {
                return (
                  <div key={link.to} className="relative" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <button className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isServicesOpen || isServicesActive() ? 'text-white bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}>
                      Layanan
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isServicesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 rounded-xl shadow-2xl shadow-black/40 border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <div className="p-2">
                          {serviceCategories.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                              <Link key={idx} to={service.path} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/80 transition-all duration-200 group" onClick={() => setIsServicesOpen(false)}>
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all duration-300">
                                  <Icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{service.title}</h4>
                                  <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-slate-800 p-3 bg-slate-950/50">
                          <Link to="/layanan" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1 transition-colors" onClick={() => setIsServicesOpen(false)}>
                            Lihat Semua Layanan <ChevronDown className="w-4 h-4 -rotate-90" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive ? 'text-white bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`
                }>
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Contact Buttons Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`https://wa.me/${contactNumbers.ade}?text=Halo%20Ade%20SE%2C%20saya%20tertarik%20dengan%20layanan%20Niaga%20Solusi%20Mandiri.`}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
              target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a href={`tel:+${contactNumbers.ade}`}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 rounded-lg text-sm font-semibold transition-all duration-300">
              <Phone className="w-4 h-4" />
              <span>Telepon</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-200 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-slate-800 space-y-1 shadow-2xl">
            {navLinks.map((link) => {
              if (link.label === "Layanan") {
                return (
                  <div key={link.to}>
                    <button onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={`w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-800 transition text-slate-300 font-medium ${isMobileServicesOpen || isServicesActive() ? 'bg-slate-800/50 text-white' : ''}`}>
                      <span>Layanan</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isMobileServicesOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-2 space-y-2">
                        {serviceCategories.map((service, idx) => {
                          const Icon = service.icon;
                          return (
                            <Link key={idx} to={service.path} className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-slate-800 transition" onClick={() => { setIsMenuOpen(false); setIsMobileServicesOpen(false); }}>
                              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                <Icon className="w-4 h-4 text-indigo-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{service.title}</div>
                                <div className="text-xs text-slate-400">{service.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                        <Link to="/layanan" className="block py-2.5 px-4 text-sm text-indigo-400 font-medium hover:text-indigo-300" onClick={() => { setIsMenuOpen(false); setIsMobileServicesOpen(false); }}>
                          Lihat Semua Layanan →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={link.to} to={link.to} className={`block py-3 px-4 rounded-xl hover:bg-slate-800 transition text-slate-300 font-medium ${location.pathname === link.to ? 'bg-slate-800/50 text-white' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Contact Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
              <a href={`https://wa.me/${contactNumbers.ade}?text=Halo%20Ade%20SE%2C%20saya%20tertarik%20dengan%20layanan%20Niaga%20Solusi%20Mandiri.`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition shadow-lg shadow-emerald-500/10"
                target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`tel:+${contactNumbers.ade}`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-semibold transition"
                onClick={() => setIsMenuOpen(false)}>
                <Phone className="w-4 h-4" /> Telepon
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}