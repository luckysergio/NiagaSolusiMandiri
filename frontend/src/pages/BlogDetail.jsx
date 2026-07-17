import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Calendar, Clock, Tag, User, ArrowLeft, Share2, Bookmark, Check, X, Sparkles, FileText
} from 'lucide-react';
import { blogApi } from '../api/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CATEGORY_ICONS = {
  'Pengetahuan Dasar': '📚', 'Panduan': '📖', 'Panduan Praktis': '📖',
  'Tips & Trik': '💡', 'Tren & Industri': '📈', 'Tips & Solusi': '🛠️',
  'Panduan Alat': '🔧', 'Edukasi Beton': '🏗️', 'Info Harga': '💰',
  'Proyek Terkini': '🚧',
};

const CATEGORY_COLORS = {
  'Pengetahuan Dasar': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'Panduan': 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  'Panduan Praktis': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'Tips & Trik': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'Tren & Industri': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'Tips & Solusi': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'Panduan Alat': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  'Edukasi Beton': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  'Info Harga': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  'Proyek Terkini': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
};

const SHARE_PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', icon: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, color: 'hover:bg-green-600/20 text-green-400', bg: 'bg-green-500/10' },
  { id: 'facebook', name: 'Facebook', icon: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color: 'hover:bg-blue-600/20 text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'twitter', name: 'Twitter', icon: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, color: 'hover:bg-gray-600/20 text-gray-300', bg: 'bg-gray-500/10' },
  { id: 'copy', name: 'Salin Link', icon: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg>, color: 'hover:bg-purple-600/20 text-purple-400', bg: 'bg-purple-500/10' },
];

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });
    const handleLoad = () => AOS.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      const saved = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setIsBookmarked(saved.includes(post.id));
    }
  }, [post]);

  const fetchPost = async () => {
    setLoading(true);
    const response = await blogApi.getPostBySlug(slug);
    if (response.success && response.data) {
      setPost(response.data);
      const related = await blogApi.getRelatedPosts(response.data.slug, 3);
      setRelatedPosts(related);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(dateString));

  const handleShareTo = (platform) => {
    const url = window.location.href;
    const title = post.title;
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title}\n\n${url}`).then(() => {
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
    };
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank', 'width=600,height=500');
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    if (!post) return;
    const saved = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    const newBookmarks = isBookmarked ? saved.filter(id => id !== post.id) : [...saved, post.id];
    localStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    setToast(isBookmarked ? 'Dihapus dari bookmark' : 'Disimpan ke bookmark');
    setTimeout(() => setToast(null), 3000);
  };

  const renderMarkdown = (content) => {
    if (!content) return null;
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        h1: ({ children }) => <h1 className="text-3xl sm:text-4xl font-bold text-white mt-8 mb-4 text-left">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 text-left border-b border-slate-700/50 pb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 text-left">{children}</h3>,
        p: ({ children }) => <p className="text-slate-300 leading-relaxed mb-4 text-left">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-outside ml-5 text-slate-300 space-y-2 mb-4 text-left">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside ml-5 text-slate-300 space-y-2 mb-4 text-left">{children}</ol>,
        li: ({ children }) => <li className="text-slate-300">{children}</li>,
        
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 rounded-lg border border-slate-700/50">
            <table className="w-full border-collapse text-left min-w-125">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-indigo-600/20">{children}</thead>,
        th: ({ children }) => <th className="border border-slate-700/50 px-4 py-3 text-white font-semibold text-left whitespace-nowrap">{children}</th>,
        td: ({ children }) => <td className="border border-slate-700/50 px-4 py-3 text-slate-300 text-left">{children}</td>,
        tr: ({ children }) => <tr className="hover:bg-slate-700/20 transition-colors">{children}</tr>,
        
        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline transition-colors">{children}</a>,
        strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-4 my-6 text-slate-400 italic bg-slate-800/30 py-3 pr-3 rounded-r-lg">{children}</blockquote>,
        code: ({ children }) => <code className="bg-slate-700/50 px-2 py-1 rounded text-indigo-300 text-sm font-mono break-all">{children}</code>,
        hr: () => <hr className="border-slate-700/50 my-8" />,
      }}>{content}</ReactMarkdown>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500"></div>
            <p className="text-slate-400 animate-pulse">Memuat artikel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h2>
            <p className="text-slate-400 mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryIcon = CATEGORY_ICONS[post.category] || '📄';
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-slate-500/10 text-slate-300 border-slate-500/20';

  return (
    <Layout>
      <SEO title={`${post.title} | Beton Cor Tangerang`} description={post.excerpt} canonicalUrl={`https://betoncortangerang.com/blog/${post.slug}`} />

      {/* ✅ PERBAIKAN: Hapus overflow-x-hidden dari main, biarkan Layout yang handle agar tidak double */}
      <main className="w-full min-h-screen">
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-800 border border-indigo-500/30 rounded-xl shadow-2xl text-white text-sm font-medium animate-in fade-in slide-in-from-top duration-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> {toast}
          </div>
        )}

        <section className="relative w-full min-h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/95 via-slate-950/85 to-slate-950/95 z-10"></div>
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover scale-105" 
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-indigo-600/10 to-purple-600/10 flex items-center justify-center">
                <FileText className="w-24 h-24 text-slate-600 opacity-30" />
              </div>
            )}
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div data-aos="fade-down" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md mb-6 mx-auto ${categoryColor}`}>
              <span className="text-base">{categoryIcon}</span>
              <span className="text-sm font-bold">{post.category}</span>
            </div>
            <h1 data-aos="zoom-in" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
              {post.title}
            </h1>
            <div data-aos="fade-up" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300 text-sm">
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Calendar className="w-4 h-4 text-indigo-400" /> {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Clock className="w-4 h-4 text-emerald-400" /> {post.readTime} menit baca
              </span>
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <User className="w-4 h-4 text-amber-400" /> {post.author}
              </span>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/60 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
              <div className="mb-8 sm:mb-10 p-5 sm:p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-center">
                <p className="text-indigo-200 text-base sm:text-lg leading-relaxed italic font-medium">
                  "{post.excerpt}"
                </p>
              </div>

              <div className="prose prose-invert prose-indigo max-w-none">
                {post.content ? renderMarkdown(post.content) : (
                  <div className="space-y-4 text-slate-300 leading-relaxed text-left">
                    <p>Konten artikel ini sedang dalam proses penyusunan. Silakan kembali lagi nanti untuk informasi lengkapnya.</p>
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-800">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Tag className="w-4 h-4 text-slate-500" />
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium hover:bg-slate-700 transition cursor-default border border-slate-700/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 relative">
                  <span className="text-sm text-slate-400 font-medium whitespace-nowrap">Bagikan:</span>
                  <div className="relative">
                    <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition group border border-slate-700/50 hover:border-indigo-500/50 active:scale-95" aria-label="Bagikan artikel">
                      <Share2 className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition" />
                    </button>
                    {showShareMenu && (
                      <div className="absolute left-0 bottom-full mb-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-2 z-20 w-48 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/50 px-2">
                          <span className="text-[10px] text-slate-400 font-bold tracking-wider">BAGIKAN KE</span>
                          <button onClick={() => setShowShareMenu(false)} className="p-1 hover:bg-slate-700/50 rounded-lg transition active:scale-95"><X className="w-3.5 h-3.5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-1">
                          {SHARE_PLATFORMS.map((platform) => (
                            <button key={platform.id} onClick={() => handleShareTo(platform.id)} className={`w-full flex items-center gap-3 px-3 py-2 ${platform.color} hover:bg-opacity-20 rounded-xl transition text-sm text-slate-300 hover:text-white group active:scale-95`}>
                              <span className={`${platform.bg} p-1.5 rounded-lg shrink-0`}>{platform.icon}</span>
                              <span className="text-xs font-semibold whitespace-nowrap">{platform.id === 'copy' && copySuccess ? 'Tersalin ✓' : platform.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button onClick={handleBookmark} className={`p-2.5 rounded-xl transition border active:scale-95 ${isBookmarked ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20' : 'bg-slate-800 text-slate-300 border-slate-700/50 hover:bg-slate-700 hover:text-white'}`} aria-label="Bookmark">
                    {isBookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm whitespace-nowrap px-4 py-2.5 rounded-xl hover:bg-indigo-500/10 transition-all active:scale-95">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
                </Link>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-16" data-aos="fade-up">
                <h3 className="text-2xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Artikel Terkait
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Link key={related.id} to={`/blog/${related.slug}`} className="group bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col active:scale-[0.98]">
                      <div className="p-5 flex-1 flex flex-col justify-between text-center">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px] font-bold mb-3 border border-indigo-500/20">
                            {CATEGORY_ICONS[related.category]} {related.category}
                          </span>
                          <h4 className="text-white font-bold group-hover:text-indigo-400 transition line-clamp-2 leading-snug">
                            {related.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(related.date)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}