import SEO from '../components/SEO';
import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Search,
  FileText
} from 'lucide-react';
import { blogApi } from '../api/blog';

const CATEGORY_ICONS = {
  'Pengetahuan Dasar': '📚', 'Panduan': '📖', 'Panduan Praktis': '📖',
  'Tips & Trik': '💡', 'Tren & Industri': '📈', 'Tips & Solusi': '🛠️',
  'Panduan Alat': '🔧', 'Edukasi Beton': '🏗️', 'Info Harga': '',
  'Proyek Terkini': '', 'Semua': '📚',
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const heroIntervalRef = useRef(null);
  const articlesSectionRef = useRef(null);

  // ✅ OPTIMASI AOS: Inisialisasi sekali dan refresh setelah window load
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });
    const handleLoad = () => AOS.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    const images = blogApi.getAllImages ? blogApi.getAllImages() : [];
    setAllImages(images);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchFeaturedPosts();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (allImages.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % allImages.length);
      }, 5000);
    }
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, [allImages.length]);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await blogApi.getPosts(currentPage, 6, selectedCategory);
    if (response.success) {
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const response = await blogApi.getCategories();
    if (response.success) setCategories(response.data);
  };

  const fetchFeaturedPosts = async () => {
    const response = await blogApi.getFeaturedPosts();
    if (response.success) setFeaturedPosts(response.data);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    }).format(new Date(dateString));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => {
      if (articlesSectionRef.current) {
        const offset = 100;
        const elementPosition = articlesSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const renderSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 animate-pulse">
          <div className="h-48 bg-slate-700/50"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-700/50 rounded w-24"></div>
            <div className="h-6 bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700/50 rounded w-full"></div>
            <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
            <div className="flex items-center gap-4 pt-2">
              <div className="h-3 bg-slate-700/50 rounded w-20"></div>
              <div className="h-3 bg-slate-700/50 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <SEO
        title="Blog | Beton Cor Tangerang - Tips & Informasi Konstruksi"
        description="Artikel dan informasi seputar beton cor, pompa beton, dan konstruksi di Tangerang. Tips, panduan, dan berita terbaru dari Niaga Solusi Mandiri."
        canonicalUrl="https://betoncortangerang.com/blog"
      />
      
      <main className="w-full min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {allImages.length > 0 ? (
              allImages.map((img, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 bg-linear-to-br from-slate-950/90 via-slate-950/80 to-slate-950/90 z-10"></div>
                  <img 
                    src={img} 
                    alt={`Blog background ${index + 1}`} 
                    className="w-full h-full object-cover scale-105" 
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-slate-950 to-slate-900"></div>
            )}
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20" data-aos="fade-up" data-aos-duration="1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 rounded-full mb-6 mx-auto">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-indigo-300 tracking-wide uppercase">BLOG & ARTIKEL</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              <span className="block">Artikel & Informasi</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Dunia Konstruksi
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-2">
              Temukan artikel, tips, dan panduan seputar beton cor, pompa beton, 
              dan konstruksi dari Niaga Solusi Mandiri.
            </p>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && !selectedCategory && (
          <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10" data-aos="fade-right">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Artikel Pilihan</h2>
                <div className="flex-1 h-px bg-linear-to-r from-indigo-500/30 to-transparent ml-4"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {featuredPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    data-aos="fade-up"
                    data-aos-delay={idx * 100}
                    className="group bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col lg:flex-row"
                  >
                    <div className="lg:w-2/5 h-48 lg:h-auto relative overflow-hidden bg-slate-800">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-700/50 text-slate-400">
                          <FileText className="w-12 h-12 mb-2 opacity-50" />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">
                        Pilihan
                      </span>
                    </div>
                    <div className="lg:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 flex-wrap">
                          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-medium">
                            {CATEGORY_ICONS[post.category]} {post.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} mnt</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-4 h-4" /> {formatDate(post.date)}
                        </div>
                        <Link to={`/blog/${post.slug}`} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 text-sm transition-all duration-300 group/link">
                          Baca Selengkapnya <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section ref={articlesSectionRef} className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10" data-aos="fade-right">
              <div className="p-2 bg-slate-800 rounded-xl">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Semua Artikel</h2>
              <div className="flex-1 h-px bg-linear-to-r from-slate-700/50 to-transparent ml-4"></div>
              <span className="text-sm text-slate-400 font-medium bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">{posts.length} artikel</span>
            </div>

            {loading ? renderSkeleton() : posts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800" data-aos="fade-up">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Belum Ada Artikel</h3>
                <p className="text-slate-400 max-w-md mx-auto">Belum ada artikel dalam kategori ini. Silakan pilih kategori lain.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <div
                    key={post.id}
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                    className="group bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
                  >
                    <Link to={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden bg-slate-800">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-700/50 text-slate-400">
                          <FileText className="w-12 h-12 mb-2 opacity-50" />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                      {post.featured && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg uppercase">
                          Pilihan
                        </span>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 flex-wrap">
                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-medium">
                          {CATEGORY_ICONS[post.category]} {post.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} mnt</span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="block mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-4 h-4" /> {formatDate(post.date)}
                        </div>
                        <Link to={`/blog/${post.slug}`} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 text-sm transition-all duration-300 group/link">
                          Baca <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-12 pt-8 border-t border-slate-800" data-aos="fade-up">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 bg-slate-800/60 hover:bg-indigo-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800/60 disabled:hover:text-slate-400 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-indigo-500 active:scale-95"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                            : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-slate-800/60 hover:bg-indigo-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800/60 disabled:hover:text-slate-400 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-indigo-500 active:scale-95"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}