# Database Schema

## Naming Conventions

| Convention | Pattern | Example |
|-----------|---------|---------|
| Table names | Singular, snake_case | `order_request`, `stock_movement` |
| Primary keys | `{table}_id` | `order_request_id`, `material_id` |
| Foreign keys | Match PK name | `category_id`, `account_id` |
| Booleans | `is_` prefix | `is_active`, `is_featured` |
| Timestamps | Always included | `created_at`, `updated_at` |
| ID types | UUID for `account`, BIGINT IDENTITY for everything else | |

## Entity Relationship Diagram

```
account (UUID PK, owner/staff)
  │
  ├─ assigned_to ──► order_request
  ├─ assigned_to ──► booking_request
  └─ recorded_by ──► stock_movement

category (BIGINT PK)
  └── product (BIGINT PK)
        └── product_photo (BIGINT PK)

portfolio_item (BIGINT PK)
  └── portfolio_photo (BIGINT PK)

booking_request (BIGINT PK)
  └──◄── order_request (BIGINT PK, optional FK)
           └── order_attachment (BIGINT PK)

material (BIGINT PK)
  └── stock_movement (BIGINT PK)

site_setting (TEXT PK, key-value)
```

## Tables

### account
Staff/admin accounts (Daj + future team).

| Column | Type | Notes |
|--------|------|-------|
| `account_id` | UUID | PK, auto-generated |
| `email` | TEXT | UNIQUE |
| `password_hash` | TEXT | bcrypt |
| `first_name` | TEXT | |
| `last_name` | TEXT | |
| `phone` | TEXT | nullable |
| `avatar_url` | TEXT | nullable |
| `role` | `platform_role` | owner / staff |
| `is_active` | BOOLEAN | default true |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | auto-trigger |

### category
Product categories (Crochet, Laser Engraving, Stickers, Embroidery).

| Column | Type | Notes |
|--------|------|-------|
| `category_id` | BIGINT | PK, identity |
| `name` | TEXT | "Crochet" |
| `slug` | TEXT | UNIQUE, "crochet" |
| `description` | TEXT | nullable |
| `display_order` | INT | for sorting |
| `is_active` | BOOLEAN | |

### product
Individual products within categories.

| Column | Type | Notes |
|--------|------|-------|
| `product_id` | BIGINT | PK |
| `category_id` | BIGINT | FK → category, CASCADE |
| `name` | TEXT | "Tote bag" |
| `slug` | TEXT | UNIQUE, "crochet-tote-bag" |
| `description` | TEXT | nullable |
| `is_active` | BOOLEAN | |
| `display_order` | INT | |

### product_photo
1-5 white background product shots per product.

| Column | Type | Notes |
|--------|------|-------|
| `product_photo_id` | BIGINT | PK |
| `product_id` | BIGINT | FK → product, CASCADE |
| `url` | TEXT | |
| `alt_text` | TEXT | nullable |
| `display_order` | INT | |

### portfolio_item
Past work gallery (photography, video, crafts).

| Column | Type | Notes |
|--------|------|-------|
| `portfolio_item_id` | BIGINT | PK |
| `title` | TEXT | |
| `slug` | TEXT | UNIQUE |
| `type` | `portfolio_type` | enum |
| `description` | TEXT | nullable |
| `project_date` | DATE | nullable |
| `is_featured` | BOOLEAN | shown on homepage |
| `is_active` | BOOLEAN | |

### order_request
Customer order/quote requests for personalized items.

| Column | Type | Notes |
|--------|------|-------|
| `order_request_id` | BIGINT | PK |
| `product_id` | BIGINT | FK → product, SET NULL |
| `category_id` | BIGINT | FK → category, SET NULL |
| `booking_request_id` | BIGINT | FK → booking_request, SET NULL (upsell link) |
| `customer_name` | TEXT | |
| `customer_email` | TEXT | nullable |
| `customer_phone` | TEXT | |
| `personalization_text` | TEXT | name, message, etc. |
| `notes` | TEXT | "anything else" |
| `status` | `order_status` | enum |
| `quoted_amount` | NUMERIC(10,2) | filled by Daj |
| `quoted_at` | TIMESTAMPTZ | auto-set on status change |
| `approved_at` | TIMESTAMPTZ | |
| `completed_at` | TIMESTAMPTZ | |
| `delivered_at` | TIMESTAMPTZ | |
| `assigned_to` | UUID | FK → account, SET NULL |
| `internal_notes` | TEXT | staff-only |

### booking_request
Photography/video booking inquiries.

| Column | Type | Notes |
|--------|------|-------|
| `booking_request_id` | BIGINT | PK |
| `customer_name` | TEXT | |
| `customer_email` | TEXT | nullable |
| `customer_phone` | TEXT | |
| `event_type` | TEXT | wedding, birthday, etc. |
| `event_date` | DATE | nullable |
| `event_location` | TEXT | nullable |
| `event_duration_hrs` | INT | nullable |
| `description` | TEXT | nullable |
| `status` | `booking_status` | enum |
| `quoted_amount` | NUMERIC(10,2) | |
| `is_addon_requested` | BOOLEAN | wants personalized items too |
| `assigned_to` | UUID | FK → account |
| `internal_notes` | TEXT | |

### material
Raw materials inventory.

| Column | Type | Notes |
|--------|------|-------|
| `material_id` | BIGINT | PK |
| `name` | TEXT | "Red yarn 4-ply" |
| `unit` | TEXT | roll, sheet, piece, meter |
| `current_stock` | NUMERIC(10,2) | denormalized, adjusted by movements |
| `minimum_stock` | NUMERIC(10,2) | alert threshold |
| `cost_per_unit` | NUMERIC(10,2) | nullable |
| `supplier` | TEXT | nullable |
| `is_active` | BOOLEAN | |

### stock_movement
Audit trail for inventory changes.

| Column | Type | Notes |
|--------|------|-------|
| `stock_movement_id` | BIGINT | PK |
| `material_id` | BIGINT | FK → material, CASCADE |
| `direction` | `stock_direction` | in / out |
| `quantity` | NUMERIC(10,2) | |
| `reason` | TEXT | "purchased", "used for order #42" |
| `order_request_id` | BIGINT | FK → order_request, SET NULL |
| `recorded_by` | UUID | FK → account, SET NULL |

## Enums

```sql
CREATE TYPE order_status   AS ENUM ('new','quoted','approved','in_progress','completed','delivered','cancelled');
CREATE TYPE booking_status AS ENUM ('new','quoted','confirmed','completed','cancelled');
CREATE TYPE portfolio_type AS ENUM ('photography','video','crochet','engraving','sticker','embroidery');
CREATE TYPE stock_direction AS ENUM ('in','out');
CREATE TYPE platform_role  AS ENUM ('owner','staff');
```

## Foreign Key Strategy

| Pattern | Tables |
|---------|--------|
| **CASCADE** (delete parent → delete children) | category→product, product→product_photo, portfolio_item→portfolio_photo, order_request→order_attachment, material→stock_movement |
| **SET NULL** (delete parent → null FK) | order_request.product_id, order_request.booking_request_id, order_request.assigned_to, booking_request.assigned_to, stock_movement.order_request_id |

## Indexes

All FK columns are indexed. Additional indexes on:
- `account.email`
- `product.slug`, `category.slug`, `portfolio_item.slug`
- `order_request.status`, `order_request.created_at DESC`
- `booking_request.status`, `booking_request.event_date`, `booking_request.created_at DESC`
- `stock_movement.created_at DESC`
- `portfolio_item.type`
