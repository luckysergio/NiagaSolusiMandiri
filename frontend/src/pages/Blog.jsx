import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
  User,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { blogApi } from '../api/blog';

// Mapping kategori dengan ikon dan warna
const CATEGORY_ICONS = {
  'Pengetahuan Dasar': '📚',
  'Panduan': '📖',
  'Panduan Praktis': '📖',
  'Tips & Trik': '💡',
  'Tren & Industri': '📈',
  'Tips & Solusi': '🛠️',
  'Panduan Alat': '🔧',
  'Edukasi Beton': '🏗️',
  'Info Harga': '💰',
  'Proyek Terkini': '🚧',
  'Semua': '📚',
};

const CATEGORY_COLORS = {
  'Pengetahuan Dasar': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Panduan': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'Panduan Praktis': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Tips & Trik': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Tren & Industri': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Tips & Solusi': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Panduan Alat': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Edukasi Beton': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Info Harga': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Proyek Terkini': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
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
  
  // Ref untuk section Semua Artikel
  const articlesSectionRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  // Kumpulkan semua gambar dari blog posts
  useEffect(() => {
    const images = blogApi.getAllImages ? blogApi.getAllImages() : [];
    setAllImages(images);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchFeaturedPosts();
  }, [currentPage, selectedCategory]);

  // Auto slide hero images
  useEffect(() => {
    if (allImages.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % allImages.length);
      }, 4000);
    }
    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
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
    if (response.success) {
      setCategories(response.data);
    }
  };

  const fetchFeaturedPosts = async () => {
    const response = await blogApi.getFeaturedPosts();
    if (response.success) {
      setFeaturedPosts(response.data);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // ============================================
  // FUNGSI PAGINATION DENGAN SCROLL
  // ============================================
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll ke section "Semua Artikel" setelah halaman berubah
    setTimeout(() => {
      if (articlesSectionRef.current) {
        const offset = 80; // Offset untuk header fixed
        const elementPosition = articlesSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  // Skeleton loading
  const renderSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 animate-pulse">
          <div className="h-48 bg-slate-700"></div>
          <div className="p-5">
            <div className="h-4 bg-slate-700 rounded w-24 mb-3"></div>
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
            <div className="flex items-center gap-4">
              <div className="h-3 bg-slate-700 rounded w-20"></div>
              <div className="h-3 bg-slate-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const goToHeroImage = (index) => {
    setCurrentHeroIndex(index);
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % allImages.length);
      }, 4000);
    }
  };

  return (
    <Layout>
      <SEO
        title="Blog | Solusi Pompa Beton & Beton Cor Tangerang"
        description="Artikel dan informasi seputar beton cor, pompa beton, dan konstruksi di Tangerang. Tips, panduan, dan berita terbaru dari Niaga Solusi Mandiri."
        canonicalUrl="https://solusipompabeton.com/blog"
      />

      {/* Hero Section with Image Carousel */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {allImages.length > 0 ? (
            allImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/85 via-slate-900/75 to-slate-900/85 z-10"></div>
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-slate-900/20 z-10"></div>
                <img
                  src={img}
                  alt={`Blog background ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='600'%3E%3Crect width='1920' height='600' fill='%231e293b'/%3E%3Ctext x='960' y='300' text-anchor='middle' fill='%236366f1' font-size='32' font-family='Arial'%3ENiaga Solusi Mandiri%3C/text%3E%3Ctext x='960' y='340' text-anchor='middle' fill='%2394a3b8' font-size='20' font-family='Arial'%3EBlog%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-800">
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90"></div>
            </div>
          )}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div 
            data-aos="fade-down" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">BLOG</span>
          </div>

          <h1 
            data-aos="zoom-in" 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-white drop-shadow-lg">Artikel &</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 drop-shadow-lg">
              Informasi Konstruksi
            </span>
          </h1>

          <p 
            data-aos="fade-up" 
            className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Temukan artikel, tips, dan panduan seputar beton cor, pompa beton, 
            dan konstruksi dari Niaga Solusi Mandiri.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-4 px-4 bg-slate-900 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('');
                handlePageChange(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  handlePageChange(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {CATEGORY_ICONS[category] && `${CATEGORY_ICONS[category]} `}
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 px-4 bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-indigo-400">✦</span>
              <h2 className="text-2xl font-bold text-white">Artikel Pilihan</h2>
              <div className="flex-1 h-px bg-linear-to-r from-indigo-500/30 to-transparent ml-4"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col md:flex-row"
                >
                  <div className="md:w-2/5 h-48 md:h-auto bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10"></div>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23334155'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236366f1' font-size='16' font-family='Arial'%3E%23%23%23%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-6xl opacity-20">📄</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full shadow-lg">
                      Featured
                    </span>
                  </div>
                  <div className="md:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                          {CATEGORY_ICONS[post.category]} {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime} menit baca</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-all duration-300">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.date)}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-sm transition-all duration-300 hover:gap-2"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid - dengan ref */}
      <section 
        ref={articlesSectionRef}
        className="py-12 px-4 bg-slate-900 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-slate-400">📄</span>
            <h2 className="text-2xl font-bold text-white">Semua Artikel</h2>
            <div className="flex-1 h-px bg-linear-to-r from-slate-700/50 to-transparent ml-4"></div>
            <span className="text-sm text-slate-400">{posts.length} artikel</span>
          </div>

          {loading ? (
            renderSkeleton()
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-white mb-2">Belum Ada Artikel</h3>
              <p className="text-slate-400">Belum ada artikel dalam kategori ini. Silakan pilih kategori lain.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <div
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                  className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="h-48 bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23334155'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%236366f1' font-size='16' font-family='Arial'%3E%23%23%23%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-6xl opacity-20">📄</span>
                        </div>
                      )}
                      {post.featured && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full shadow-lg">
                          Featured
                        </span>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent"></div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                        {CATEGORY_ICONS[post.category]} {post.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} menit
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-all duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{formatDate(post.date)}</span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-sm transition-all duration-300 hover:gap-2"
                      >
                        Baca
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t border-slate-700/50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center gap-2">
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
                      className={`w-9 h-9 rounded-xl font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                          : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                      aria-label={`Go to page ${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}