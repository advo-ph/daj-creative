# Daj Creative - Project Instructions

## Overview

Daj Creative is a portfolio, photography booking, and personalized items shop for a solo creative based in BGC, Manila. The site combines an autobiography/portfolio, a photography booking intake, and a B2C personalized items shop (crochet, laser engraving, stickers, embroidery) — all with a "premium editorial minimalism" aesthetic.

There is no cart or checkout. All orders and bookings are intake forms — Daj follows up manually and sends GCash QR for payment.

## Architecture

**Monorepo** with npm workspaces:

- `apps/web` — React 19 SPA (Vite, Tailwind CSS v4, vanilla CSS design system)
- `apps/api` — Express 5 backend (TypeScript, `pg`, `bcryptjs`, `jsonwebtoken`, `zod`)

### Data Flow

```
React SPA (apps/web)
  └── fetch / api client
        └── Express API (apps/api)
              ├── requireAuth middleware (JWT)
              └── DAL modules (apps/api/src/db/*.ts)
                    └── PostgreSQL (via pg pool)
```

### Key Conventions

| Convention | Rule |
|-----------|------|
| Table names | Singular, snake_case (`order_request`, `stock_movement`) |
| Primary keys | `{table}_id` — UUID for `account`, BIGINT GENERATED ALWAYS AS IDENTITY for everything else |
| Foreign keys | Match PK name exactly (`account_id`, `category_id`) |
| Booleans | `is_` prefix (`is_active`, `is_featured`, `is_addon_requested`) |
| Timestamps | `created_at`, `updated_at` (TIMESTAMPTZ, DEFAULT now()) |
| Soft deletes | `is_active` boolean (no `deleted_at` pattern) |
| DB access | Always through `apps/api/src/db/` DAL modules — no raw SQL in routes |
| Auth | Custom JWT — `requireAuth` middleware in routes |
| Validation | Zod schemas in route files via `validate()` middleware |
| Enums | PostgreSQL custom types (`order_status`, `booking_status`, `portfolio_type`, `stock_direction`, `platform_role`) |

## Commands

```bash
npm install --legacy-peer-deps    # Install all dependencies (needed for tailwind/vite peer dep)
npm run dev:web                   # Start frontend on :5173
npm run dev:api                   # Start API on :3001 (tsx watch)
npm run build:web                 # Build frontend
npm run build:api                 # TypeScript compile API
npm -w @dajcreative/api run migrate   # Run database migrations
npm -w @dajcreative/api run seed      # Seed initial data
```

## Environment Variables

### `apps/api/.env`

```env
DATABASE_URL=postgresql://localhost:5432/dajcreative
JWT_SECRET=change-this-to-a-random-string
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
UPLOAD_DIR=./uploads
```

## API Routes

### Public (no auth — customer-facing)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | List active categories |
| GET | `/api/categories/:slug` | Category + products + photos |
| GET | `/api/products/:slug` | Product detail + photos |
| GET | `/api/portfolio` | Portfolio items (filterable by `?type=`) |
| GET | `/api/portfolio/featured` | Featured portfolio items only |
| GET | `/api/portfolio/:slug` | Portfolio item detail + photos |
| POST | `/api/orders` | Submit order request (customer form) |
| POST | `/api/orders/:id/attachments` | Upload design files |
| POST | `/api/bookings` | Submit booking request (customer form) |

### Internal (JWT auth — Daj's dashboard)

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Current account |
| GET | `/api/admin/dashboard/stats` | Dashboard overview counts |
| GET/PATCH | `/api/orders/:id` | View/update order status + quote |
| GET/PATCH | `/api/bookings/:id` | View/update booking status + quote |
| CRUD | `/api/categories` | Manage categories (POST/PATCH/DELETE need auth) |
| CRUD | `/api/products` | Manage products + photos |
| CRUD | `/api/portfolio` | Manage portfolio + photos |
| CRUD | `/api/admin/materials` | Inventory management |
| GET | `/api/admin/materials/low-stock` | Low stock alerts |
| POST | `/api/admin/materials/movements` | Record stock in/out |

## Backend Patterns

### DAL Module (Data Access Layer)

```typescript
// apps/api/src/db/example.ts
import { query } from '../utils/db.js';

export interface ExampleRow {
  example_id: number;
  name: string;
  created_at: string;
}

export async function findById(example_id: number) {
  const result = await query<ExampleRow>(
    'SELECT * FROM example WHERE example_id = $1',
    [example_id],
  );
  return result.rows[0] ?? null;
}
```

### Route Handler

```typescript
// apps/api/src/routes/example.ts
import { Router } from 'express';
import { z } from 'zod';
import { examples } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:id', async (req, res) => {
  const row = await examples.findById(Number(req.params.id));
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.post('/', requireAuth, validate(schema), async (req, res) => {
  const row = await examples.create(req.body);
  res.status(201).json(row);
});
```

## Design System

**"Premium Editorial Minimalism"** — Gen-Z energy, magazine feel.

### Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-cream` | `#f5f2ec` | Page background |
| `--color-cream-mid` | `#ede9e0` | Section backgrounds (shop) |
| `--color-cream-dark` | `#ddd9d0` | Borders, hairlines |
| `--color-ink` | `#1a1a18` | Primary text, dark sections |
| `--color-ink-light` | `#6b6860` | Secondary text |
| `--color-ink-xlight` | `#9a9890` | Labels, hints |
| `--color-green` | `#5a8a2a` | Accent (Daj's pick) |
| `--color-green-dark` | `#3e6018` | Hover states |
| `--color-green-light` | `#8fc45a` | Dark section accent |

### Typography

| Font | Weight | Usage |
|------|--------|-------|
| Cormorant Garamond | 300 | All display headings, quotes, stats, footer brand |
| Cormorant Garamond | 300 italic | Emphasis (`<em>`) — always in green |
| DM Sans | 300-500 | Body text, nav, labels, buttons |

### UI Conventions

- Labels: 10-11px, uppercase, letter-spacing 0.08-0.14em
- Buttons: uppercase, 11px, 0.08em tracking, 2px border-radius
- Primary: ink background, cream text. Ghost: hairline cream-dark border.
- Borders: 0.5px solid cream-dark
- Section padding: 100-120px vertical, `clamp(24px, 5vw, 80px)` horizontal gutters
- Animations: `cubic-bezier(0.16, 1, 0.3, 1)` ease-out, scroll reveal with fade-up
- Custom cursor: dot that expands green on interactive elements
- Grain overlay: SVG noise at 2.5% opacity
- Mobile nav: circle clip-path animation centered on hamburger icon

### CSS Architecture

All styles live in `apps/web/src/index.css` — one file, using CSS custom properties from `@theme {}` block. Components use CSS class names from this file, not inline Tailwind utilities (to maintain 1:1 fidelity with the design).

## Database Schema

### Entity Relationships

```
account (staff)
  ├── category → product → product_photo
  ├── portfolio_item → portfolio_photo
  ├── order_request → order_attachment
  │     └── links to booking_request (upsell)
  ├── booking_request
  └── material → stock_movement
```

### Enums

| Type | Values |
|------|--------|
| `order_status` | new, quoted, approved, in_progress, completed, delivered, cancelled |
| `booking_status` | new, quoted, confirmed, completed, cancelled |
| `portfolio_type` | photography, video, crochet, engraving, sticker, embroidery |
| `stock_direction` | in, out |
| `platform_role` | owner, staff |

### Migration Files

| Migration | Purpose |
|-----------|---------|
| `001_initial_schema.sql` | All tables, enums, indexes, triggers |

## Business Logic

- **No cart/checkout** — orders and bookings are intake forms. Daj follows up manually with pricing and GCash QR.
- **Order flow**: new → quoted (Daj sends price) → approved (customer confirms) → in_progress → completed → delivered
- **Booking flow**: new → quoted → confirmed (date locked) → completed
- **Upsell**: booking_request can link to order_requests for personalized item add-ons
- **Stock tracking**: `material.current_stock` is denormalized; `stock_movement` is the audit trail. Stock adjusts automatically on movement creation via `materials.adjustStock()`.
- **No customer accounts** — customers submit name + phone. No login required.

## Important Notes

- No ORM — direct parameterized SQL via `pg`
- No Supabase, no Firebase — fully custom backend
- All DB access through DAL modules — never raw SQL in route handlers
- The `seed.sql` password hash is a placeholder — generate a real bcrypt hash before first use
- Frontend CSS uses class names, not Tailwind utilities, for design-critical styles (preserves exact spacing/typography from the original design)
- The mobile nav overlay clip-path origin is calculated from the gutter + hamburger center: `calc(100% - clamp(24px, 5vw, 80px) - 17px)`
