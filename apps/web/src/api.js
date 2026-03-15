const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API ${res.status}`);
  }
  return res.json();
}

export function getCategories() {
  return apiFetch('/categories');
}

export function getCategoryBySlug(slug) {
  return apiFetch(`/categories/${slug}`);
}

export function getProductBySlug(slug) {
  return apiFetch(`/products/${slug}`);
}

export function submitOrder(data) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitBooking(data) {
  return apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
