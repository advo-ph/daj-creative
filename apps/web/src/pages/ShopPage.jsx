import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getCategoryBySlug } from '../api';

const PLACEHOLDER_COLORS = [
  '#c8c4bc', '#b4b0a8', '#9a9890', '#ccc8c0',
  '#d4d0c8', '#c0bdb4', '#a8a49c', '#b8b4ac',
  '#d0ccc4', '#bab6ae',
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategorySlug = searchParams.get('category');
  const gridRef = useRef(null);

  // Load categories on mount
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load products when category changes
  useEffect(() => {
    setLoading(true);
    if (activeCategorySlug) {
      getCategoryBySlug(activeCategorySlug)
        .then((data) => {
          setActiveCategory(data);
          setProducts(data.products || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (categories.length > 0) {
      // Load all products from all categories
      Promise.all(categories.map((c) => getCategoryBySlug(c.slug)))
        .then((results) => {
          setActiveCategory(null);
          const all = results.flatMap((r) =>
            (r.products || []).map((p) => ({ ...p, category_name: r.name }))
          );
          setProducts(all);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeCategorySlug, categories]);

  // Re-observe reveal elements after products load
  useEffect(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      gridRef.current.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading, products]);

  function handleFilter(slug) {
    if (slug === activeCategorySlug) {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  }

  return (
    <main className="shop-page" ref={gridRef}>
      {/* Header */}
      <div className="shop-page-header reveal">
        <div className="shop-page-eyebrow">Personalized Items</div>
        <h1 className="shop-page-title">
          Made by <em>hand</em>, made for <em>you</em>
        </h1>
        <p className="shop-page-subtitle">
          Each piece is crafted to order. Choose a product, upload or describe your design,
          and we'll get back to you with a quote within 24 hours.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="shop-page-filters reveal reveal-delay-1">
        <button
          className={`shop-filter-tab ${!activeCategorySlug ? 'active' : ''}`}
          onClick={() => setSearchParams({})}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.category_id}
            className={`shop-filter-tab ${activeCategorySlug === c.slug ? 'active' : ''}`}
            onClick={() => handleFilter(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="shop-page-grid">
        {loading ? (
          <div className="shop-page-loading">
            <div className="shop-loading-dot" />
            <div className="shop-loading-dot" />
            <div className="shop-loading-dot" />
          </div>
        ) : products.length === 0 ? (
          <div className="shop-page-empty reveal">
            <p>No items yet. Check back soon.</p>
          </div>
        ) : (
          products.map((p, i) => (
            <Link
              to={`/shop/${p.slug}`}
              key={p.product_id}
              className={`shop-page-card reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ''}`}
            >
              <div className="shop-page-card-img">
                {p.photos && p.photos.length > 0 ? (
                  <img src={p.photos[0].url} alt={p.photos[0].alt_text || p.name} />
                ) : (
                  <div
                    className="shop-page-card-placeholder"
                    style={{ background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] }}
                  >
                    <span className="placeholder-label">{p.category_name || activeCategory?.name || 'Item'}</span>
                  </div>
                )}
              </div>
              <div className="shop-page-card-body">
                <div className="shop-page-card-tag">
                  {p.category_name || activeCategory?.name || ''}
                </div>
                <div className="shop-page-card-name">{p.name}</div>
                {p.description && (
                  <div className="shop-page-card-desc">{p.description}</div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
