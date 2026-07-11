import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Header />
      <main className="grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}