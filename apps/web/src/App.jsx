import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import BookPage from './pages/BookPage';
import AboutPage from './pages/AboutPage';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useCursor } from './hooks/useCursor';

export default function App() {
  const { pathname } = useLocation();
  useScrollReveal(pathname);
  const cursorRef = useCursor(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} aria-hidden="true" />

      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  );
}
