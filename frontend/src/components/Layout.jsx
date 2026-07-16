import Header from './Header';
import Footer from './Footer';
import Preloader from './Preloader';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      <ScrollToTop />
      
      <Preloader />
      <Header />
      
      <main className="grow pt-20 lg:pt-24 relative">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}