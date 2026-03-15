# API Reference

Base URL: `http://localhost:3001/api`

## Authentication

JWT Bearer token. Obtain via `/api/auth/login`.

```
Authorization: Bearer <token>
```

---

## Public Endpoints

### Health

```
GET /api/health
→ { "status": "ok", "db": "connected" }
```

### Auth

```
POST /api/auth/login
Body: { "email": "daj@dajcreative.ph", "password": "..." }
→ { "token": "eyJ...", "account": { "account_id", "email", "first_name", "last_name", "role" } }

POST /api/auth/refresh        [auth required]
→ { "token": "eyJ..." }

GET /api/auth/me               [auth required]
→ { "account_id", "email", "first_name", "last_name", "role", "is_active", ... }
```

### Categories

```
GET /api/categories
→ [ { "category_id", "name", "slug", "description", "display_order", "is_active" }, ... ]

GET /api/categories/:slug
→ { "category_id", "name", "slug", ..., "products": [ { "product_id", "name", "slug", ..., "photos": [...] } ] }
```

### Products

```
GET /api/products/:slug
→ { "product_id", "category_id", "name", "slug", "description", ..., "photos": [ { "url", "alt_text", "display_order" } ] }
```

### Portfolio

```
GET /api/portfolio                  # all active, filterable with ?type=photography
GET /api/portfolio/featured         # featured items only
GET /api/portfolio/:slug            # single item + photos
→ { "portfolio_item_id", "title", "slug", "type", "description", "project_date", "is_featured", "photos": [...] }
```

### Orders (Customer Submission)

```
POST /api/orders
Body: {
  "customer_name": "Maria Santos",
  "customer_phone": "09171234567",
  "customer_email": "maria@email.com",        // optional
  "product_id": 1,                             // optional
  "category_id": 1,                            // optional
  "personalization_text": "Name: Maria",       // optional
  "notes": "Please use forest green yarn"      // optional
}
→ 201 { "order_request_id": 1, "message": "Request received. We'll get back to you within 24 hours." }

POST /api/orders/:id/attachments
Body: { "url": "https://...", "original_filename": "design.png", "file_type": "image/png", "file_size_bytes": 204800 }
→ 201 { "order_attachment_id", ... }
```

### Bookings (Customer Submission)

```
POST /api/bookings
Body: {
  "customer_name": "Juan Cruz",
  "customer_phone": "09181234567",
  "customer_email": "juan@email.com",          // optional
  "event_type": "wedding",                     // optional
  "event_date": "2026-05-15",                  // optional
  "event_location": "BGC, Taguig",             // optional
  "event_duration_hrs": 4,                     // optional
  "description": "Intimate garden wedding",    // optional
  "is_addon_requested": true                   // wants personalized items too
}
→ 201 { "booking_request_id": 1, "message": "Booking request received. We'll get back to you within 24 hours." }
```

---

## Admin Endpoints (auth required)

### Dashboard

```
GET /api/admin/dashboard/stats
→ {
    "orders": { "new": 3, "in_progress": 1, "total": 12 },
    "bookings": { "new": 2, "confirmed": 1, "total": 8 },
    "materials": { "low_stock_count": 2, "low_stock_items": [...] }
  }
```

### Order Management

```
GET /api/orders?status=new&limit=20&offset=0
→ [ { order_request_id, customer_name, status, created_at, ... }, ... ]

GET /api/orders/count?status=new
→ { "count": 3 }

GET /api/orders/:id
→ { ...order, "attachments": [...] }

PATCH /api/orders/:id
Body: { "status": "quoted", "quoted_amount": 350.00, "internal_notes": "..." }
→ { ...updated order }
```

**Status transitions:** new → quoted → approved → in_progress → completed → delivered (or cancelled from any state)

### Booking Management

```
GET /api/bookings?status=new
GET /api/bookings/count
GET /api/bookings/:id

PATCH /api/bookings/:id
Body: { "status": "quoted", "quoted_amount": 5000.00 }
```

**Status transitions:** new → quoted → confirmed → completed (or cancelled)

### Category/Product/Portfolio CRUD

```
POST   /api/categories            Body: { name, slug, description?, display_order? }
PATCH  /api/categories/:id        Body: { name?, slug?, description?, display_order?, is_active? }
DELETE /api/categories/:id

POST   /api/products              Body: { category_id, name, slug, description?, display_order? }
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/photos   Body: { url, alt_text?, display_order? }
DELETE /api/products/photos/:photoId

POST   /api/portfolio             Body: { title, slug, type, description?, project_date?, is_featured? }
PATCH  /api/portfolio/:id
DELETE /api/portfolio/:id
POST   /api/portfolio/:id/photos  Body: { url, alt_text?, display_order? }
DELETE /api/portfolio/photos/:photoId
```

### Materials & Stock

```
GET  /api/admin/materials              # all materials
GET  /api/admin/materials/low-stock    # below minimum_stock threshold
GET  /api/admin/materials/:id
POST /api/admin/materials              Body: { name, unit, current_stock?, minimum_stock?, cost_per_unit?, supplier? }
PATCH /api/admin/materials/:id

GET  /api/admin/materials/:id/movements    # stock history for a material
POST /api/admin/materials/movements        # record stock in/out
Body: { "material_id": 1, "direction": "out", "quantity": 2, "reason": "Used for order #5", "order_request_id": 5 }
→ auto-adjusts material.current_stock
```
