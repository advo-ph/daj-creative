import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug, submitOrder } from '../api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const layoutRef = useRef(null);
  const [formState, setFormState] = useState('idle'); // idle | sending | sent | error
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    personalization_text: '',
    notes: '',
  });

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setActivePhoto(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  // Re-observe reveal elements after product loads
  useEffect(() => {
    if (!loading && product && layoutRef.current) {
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
      layoutRef.current.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading, product]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormState('sending');
    try {
      await submitOrder({
        product_id: product.product_id,
        category_id: product.category_id,
        ...form,
      });
      setFormState('sent');
    } catch {
      setFormState('error');
    }
  }

  if (loading) {
    return (
      <main className="product-detail">
        <div className="product-detail-loading">
          <div className="shop-loading-dot" />
          <div className="shop-loading-dot" />
          <div className="shop-loading-dot" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail">
        <div className="product-detail-empty">
          <p>Product not found.</p>
          <Link to="/shop" className="btn-ghost">Back to shop</Link>
        </div>
      </main>
    );
  }

  const photos = product.photos || [];

  return (
    <main className="product-detail" ref={layoutRef}>
      <div className="product-detail-breadcrumb reveal">
        <Link to="/shop">Shop</Link>
        <span className="breadcrumb-sep">/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Photo gallery */}
        <div className="product-gallery reveal">
          <div className="product-gallery-main">
            {photos.length > 0 ? (
              <img
                src={photos[activePhoto].url}
                alt={photos[activePhoto].alt_text || product.name}
              />
            ) : (
              <div className="product-gallery-placeholder">
                <span className="placeholder-label">{product.name}</span>
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="product-gallery-thumbs">
              {photos.map((photo, i) => (
                <button
                  key={photo.product_photo_id}
                  className={`product-thumb ${i === activePhoto ? 'active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo.url} alt={photo.alt_text || `${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + order form */}
        <div className="product-info reveal reveal-delay-1">
          <div className="product-info-tag">{product.category_name || 'Personalized'}</div>
          <h1 className="product-info-name">{product.name}</h1>
          {product.description && (
            <p className="product-info-desc">{product.description}</p>
          )}

          <div className="product-info-divider" />

          {formState === 'sent' ? (
            <div className="order-success">
              <div className="order-success-icon">✓</div>
              <h3 className="order-success-heading">Request received</h3>
              <p className="order-success-body">
                We'll review your order and send you a quote within 24 hours.
                Check your phone for a message from Daj.
              </p>
              <Link to="/shop" className="btn-ghost">Continue browsing</Link>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <div className="order-form-label">Request this item</div>

              <div className="order-form-field">
                <label htmlFor="customer_name">Name</label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.customer_name}
                  onChange={handleChange}
                />
              </div>

              <div className="order-form-field">
                <label htmlFor="customer_phone">Phone</label>
                <input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  required
                  placeholder="09XX XXX XXXX"
                  value={form.customer_phone}
                  onChange={handleChange}
                />
              </div>

              <div className="order-form-field">
                <label htmlFor="customer_email">Email (optional)</label>
                <input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.customer_email}
                  onChange={handleChange}
                />
              </div>

              <div className="order-form-field">
                <label htmlFor="personalization_text">Personalization</label>
                <textarea
                  id="personalization_text"
                  name="personalization_text"
                  rows="3"
                  placeholder="Name, text, or design details you'd like on the item"
                  value={form.personalization_text}
                  onChange={handleChange}
                />
              </div>

              <div className="order-form-field">
                <label htmlFor="notes">Additional notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  placeholder="Size, color, deadline, or anything else"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              {formState === 'error' && (
                <div className="order-form-error">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="btn-primary order-form-submit"
                disabled={formState === 'sending'}
              >
                {formState === 'sending' ? 'Sending...' : 'Submit request'}
              </button>

              <p className="order-form-note">
                No payment required now. We'll send you a quote and payment details via phone.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
