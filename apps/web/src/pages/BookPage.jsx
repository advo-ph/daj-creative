import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { submitBooking } from '../api';

const EVENT_TYPES = ['Portrait', 'Birthday', 'Wedding', 'Corporate', 'Product', 'Other'];
const DURATIONS = [2, 4, 6, 8];

export default function BookPage() {
  const [formState, setFormState] = useState('idle');
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    event_type: '',
    event_date: '',
    event_location: '',
    event_duration_hrs: '',
    description: '',
    is_addon_requested: false,
  });
  const pageRef = useRef(null);

  useEffect(() => {
    if (pageRef.current) {
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
      pageRef.current.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormState('sending');
    try {
      await submitBooking({
        ...form,
        event_duration_hrs: form.event_duration_hrs ? Number(form.event_duration_hrs) : undefined,
        event_date: form.event_date || undefined,
        customer_email: form.customer_email || undefined,
      });
      setFormState('sent');
    } catch {
      setFormState('error');
    }
  }

  return (
    <main className="book-page" ref={pageRef}>
      {/* Header */}
      <div className="book-page-header reveal">
        <div className="shop-page-eyebrow">Photography & Video</div>
        <h1 className="shop-page-title">
          Book a <em>session</em>
        </h1>
        <p className="shop-page-subtitle">
          Tell us about your event or shoot and we'll send you a quote within 24 hours.
          No commitment required.
        </p>
      </div>

      <div className="book-page-layout">
        {/* Left — sample photo placeholder */}
        <div className="book-page-photo reveal">
          <div className="book-photo-placeholder">
            <span className="placeholder-label">Sample shoot</span>
          </div>
        </div>

        {/* Right — form */}
        <div className="book-page-form-wrap reveal reveal-delay-1">
          {formState === 'sent' ? (
            <div className="order-success">
              <div className="order-success-icon">✓</div>
              <h3 className="order-success-heading">Request received</h3>
              <p className="order-success-body">
                We'll review your booking and send you a quote within 24 hours.
                Check your phone for a message from Daj.
              </p>
              <Link to="/" className="btn-ghost">Back to home</Link>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <div className="order-form-label">Session details</div>

              <div className="order-form-row">
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

              <div className="order-form-row">
                <div className="order-form-field">
                  <label htmlFor="event_type">Event type</label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={form.event_type}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t.toLowerCase()}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="order-form-field">
                  <label htmlFor="event_duration_hrs">Duration</label>
                  <select
                    id="event_duration_hrs"
                    name="event_duration_hrs"
                    value={form.event_duration_hrs}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>{d} hours</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="order-form-row">
                <div className="order-form-field">
                  <label htmlFor="event_date">Preferred date</label>
                  <input
                    id="event_date"
                    name="event_date"
                    type="date"
                    value={form.event_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="order-form-field">
                  <label htmlFor="event_location">Location</label>
                  <input
                    id="event_location"
                    name="event_location"
                    type="text"
                    placeholder="BGC, Makati, etc."
                    value={form.event_location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="order-form-field">
                <label htmlFor="description">Tell me about your event</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="What's the occasion? Any special requests or themes?"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="product-info-divider" />

              <label className="book-addon-check">
                <input
                  type="checkbox"
                  name="is_addon_requested"
                  checked={form.is_addon_requested}
                  onChange={handleChange}
                />
                <span className="book-addon-box" />
                <span className="book-addon-text">
                  I'd also like <em>personalized items</em> for this event
                </span>
              </label>

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
                No payment required now. We'll send you a quote and details via phone.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
