import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar,
  Clock,
  Tag,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  X,
} from 'lucide-react';
import { blogApi } from '../api/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Data kategori dengan ikon yang sesuai
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

// Data share platforms dengan icon dan warna
const SHARE_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'hover:bg-green-600/20 text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'hover:bg-blue-600/20 text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'hover:bg-gray-600/20 text-gray-300',
    bg: 'bg-gray-500/10',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'hover:bg-blue-700/20 text-blue-500',
    bg: 'bg-blue-600/10',
  },
  {
    id: 'email',
    name: 'Email',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
      </svg>
    ),
    color: 'hover:bg-yellow-600/20 text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    id: 'copy',
    name: 'Salin Link',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
    ),
    color: 'hover:bg-purple-600/20 text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  // Cek status bookmark dari localStorage
  useEffect(() => {
    if (post) {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setIsBookmarked(savedBookmarks.includes(post.id));
    }
  }, [post]);

  const fetchPost = async () => {
    setLoading(true);
    const response = await blogApi.getPostBySlug(slug);
    if (response.success && response.data) {
      setPost(response.data);
      // Fetch related posts
      const allPosts = await blogApi.getPosts(1, 3, response.data.category);
      setRelatedPosts(allPosts.data.data.filter(p => p.id !== response.data.id));
    }
    setLoading(false);
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
  // FUNGSI SHARE
  // ============================================
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleShareTo = (platform) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title}\n\n${url}`).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = `${title}\n\n${url}`;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      });
      setShowShareMenu(false);
      return;
    }

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${url}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Baca artikel ini: ${url}`)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=500');
    }
    setShowShareMenu(false);
  };

  // ============================================
  // FUNGSI BOOKMARK
  // ============================================
  const handleBookmark = () => {
    if (!post) return;
    
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = savedBookmarks.filter(id => id !== post.id);
    } else {
      newBookmarks = [...savedBookmarks, post.id];
    }
    
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    
    const message = isBookmarked ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark';
    showToast(message);
  };

  // ============================================
  // FUNGSI TOAST NOTIFICATION
  // ============================================
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Render markdown content dengan styling khusus
  const renderMarkdown = (content) => {
    if (!content) return null;
    
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mt-8 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-bold text-white text-center mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg sm:text-xl font-bold text-white text-center mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 text-center leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-slate-300 text-center space-y-2 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-slate-300 text-center space-y-2 mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300">{children}</li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-slate-700/50 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-indigo-600/20">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-slate-700/50 px-4 py-3 text-white font-semibold text-center">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-700/50 px-4 py-2 text-slate-300 text-center">
              {children}
            </td>
          ),
          tr: ({ children, className }) => (
            <tr className={`${className || ''} hover:bg-slate-700/20 transition-colors`}>
              {children}
            </tr>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-bold">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 text-slate-400 italic text-center">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-slate-700/50 px-2 py-1 rounded text-indigo-300 text-sm">
              {children}
            </code>
          ),
          hr: () => (
            <hr className="border-slate-700/50 my-6" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-indigo-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400">Memuat artikel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h2>
            <p className="text-slate-400 mb-4">Maaf, artikel yang Anda cari tidak tersedia.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryIcon = CATEGORY_ICONS[post.category] || '📄';
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <Layout>
      <SEO
        title={`${post.title} | Blog Solusi Pompa Beton`}
        description={post.excerpt}
        canonicalUrl={`https://solusipompabeton.com/blog/${post.slug}`}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-800 border border-indigo-500/30 rounded-xl shadow-2xl text-white text-sm animate-in fade-in slide-in-from-top duration-300">
          {toast}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 z-10"></div>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%231e293b'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='%236366f1' font-size='24' font-family='Arial'%3ENiaga Solusi Mandiri%3C/text%3E%3C/svg%3E";
              }}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-8xl opacity-20">📄</span>
            </div>
          )}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div 
            data-aos="fade-down" 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-6 mx-auto ${categoryColor}`}
          >
            <span className="text-base">{categoryIcon}</span>
            <span className="text-sm font-semibold">{post.category}</span>
          </div>

          <h1 data-aos="zoom-in" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg text-center">
            {post.title}
          </h1>

          <div data-aos="fade-up" className="flex flex-wrap items-center justify-center gap-4 text-slate-300 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} menit baca
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-700/50">
            {/* Excerpt */}
            <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
              <p className="text-indigo-300 text-sm sm:text-base leading-relaxed italic">
                "{post.excerpt}"
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-indigo max-w-none">
              {post.content ? (
                renderMarkdown(post.content)
              ) : (
                <div className="space-y-4 text-slate-300 leading-relaxed text-center">
                  <p>
                    {post.title} adalah topik penting dalam dunia konstruksi. Artikel ini akan membahas secara mendalam tentang berbagai aspek yang perlu Anda ketahui.
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-6 mb-4 text-center">Apa Itu {post.title}?</h2>
                  <p>
                    Dalam industri konstruksi, {post.title.toLowerCase()} memegang peranan vital untuk memastikan kualitas dan keamanan proyek. 
                    Dengan pemahaman yang tepat, Anda dapat mengoptimalkan hasil konstruksi dan menghindari berbagai masalah di kemudian hari.
                  </p>
                  <h3 className="text-xl font-bold text-white mt-6 mb-3 text-center">Keunggulan dan Manfaat</h3>
                  <p>
                    Menggunakan layanan profesional dalam {post.category.toLowerCase()} memberikan banyak keuntungan, termasuk efisiensi waktu, 
                    kualitas hasil yang terjamin, dan biaya yang lebih terkontrol.
                  </p>
                  <ul className="list-disc list-inside text-slate-300 text-center space-y-2">
                    <li>Kualitas terjamin sesuai standar SNI</li>
                    <li>Pengerjaan cepat dan efisien</li>
                    <li>Dukungan tim profesional berpengalaman</li>
                    <li>Harga kompetitif dan transparan</li>
                  </ul>
                  <h3 className="text-xl font-bold text-white mt-6 mb-3 text-center">Kesimpulan</h3>
                  <p>
                    Memahami {post.title.toLowerCase()} adalah langkah penting untuk kesuksesan proyek konstruksi Anda. 
                    Dengan mitra yang tepat, Anda dapat mencapai hasil optimal sesuai ekspektasi.
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-700/30 text-slate-300 rounded-full text-sm hover:bg-slate-700/50 transition cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share & Navigation - Improved with better alignment */}
            <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 relative">
                <span className="text-sm text-slate-400 whitespace-nowrap">Bagikan:</span>
                
                {/* Tombol Share */}
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition group"
                    aria-label="Bagikan artikel"
                  >
                    <Share2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition" />
                  </button>

                  {/* Menu Share Popup - Fixed alignment */}
                  {showShareMenu && (
                    <div className="absolute left-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-3 z-20 w-55 animate-in fade-in slide-in-from-top duration-200">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/50">
                        <span className="text-[10px] text-slate-400 font-medium tracking-wider">BAGIKAN KE</span>
                        <button
                          onClick={() => setShowShareMenu(false)}
                          className="p-1 hover:bg-slate-700/50 rounded-lg transition"
                        >
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {SHARE_PLATFORMS.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => handleShareTo(platform.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 ${platform.color} hover:bg-opacity-20 rounded-lg transition text-sm text-slate-300 hover:text-white group`}
                          >
                            <span className={`${platform.bg} p-1.5 rounded-lg shrink-0`}>
                              {platform.icon}
                            </span>
                            <span className="text-xs font-medium whitespace-nowrap">
                              {platform.id === 'copy' && copySuccess ? 'Tersalin ✓' : platform.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Bookmark */}
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition ${
                    isBookmarked 
                      ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                      : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                  }`}
                  aria-label={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
                >
                  {isBookmarked ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Blog
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white text-center mb-6">Artikel Terkait</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-4 text-center">
                      <h4 className="text-white font-semibold group-hover:text-indigo-400 transition line-clamp-2">
                        {related.title}
                      </h4>
                      <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(related.date)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}