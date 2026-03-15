# Business Logic

## Context

Daj Creative is a solo creative business (transitioning to small team) based in BGC, Manila. Daj has been doing this since 2009. The business covers photography, video, and handmade personalized items.

**Key constraint:** There is no automated checkout. All payments are manual via GCash QR. Daj personally contacts every client.

## Order Flow

Customer submits a personalized item request via the shop form. No account needed.

```
CUSTOMER                              DAJ (Dashboard)
   │                                       │
   ├── Submits order form ──────────────► NEW
   │   (name, phone, product,              │
   │    personalization text,              │
   │    uploaded design)                   │
   │                                       ├── Reviews request
   │                                       ├── Sends quote
   │◄── Receives quote ─────────────── QUOTED
   │                                       │
   ├── Approves (via message) ──────────► APPROVED
   │                                       │
   │                                       ├── Starts making item
   │                                   IN_PROGRESS
   │                                       │
   │                                       ├── Item done, sends GCash QR
   │◄── Pays via GCash ──────────────── COMPLETED
   │                                       │
   │                                       ├── Ships or arranges pickup
   │◄── Receives item ──────────────── DELIVERED
   │
   └── (or CANCELLED at any point)
```

### Status Timestamps

Each status transition auto-sets its timestamp:
- `quoted` → `quoted_at = now()`
- `approved` → `approved_at = now()`
- `completed` → `completed_at = now()`
- `delivered` → `delivered_at = now()`

## Booking Flow

Customer submits a photography/video booking inquiry.

```
CUSTOMER                              DAJ (Dashboard)
   │                                       │
   ├── Submits booking form ────────────► NEW
   │   (name, phone, event type,           │
   │    date, location, duration)          │
   │                                       ├── Reviews, checks availability
   │                                       ├── Sends quote
   │◄── Receives quote ─────────────── QUOTED
   │                                       │
   ├── Confirms (via message) ──────────► CONFIRMED
   │                                       │    (date locked in)
   │                                       │
   │   [EVENT DAY]                         ├── Shoots event
   │                                       │
   │                                       ├── Delivers photos/video
   │◄── Receives deliverables ─────── COMPLETED
   │
   └── (or CANCELLED at any point)
```

### No Calendar Integration

Daj has a day job. His availability shifts. A Calendly-style calendar would create booking conflicts. Instead:
- Customer submits preferred date
- Daj checks manually and confirms or proposes alternative
- The `event_date` field is the **confirmed** date, not just a request

## Photography + Personalized Items Upsell

When a customer books photography, they can also request personalized items as add-ons (giveaways, custom stickers for the event, engraved keepsakes, etc.).

**Flow:**
1. Customer checks "I'd also like personalized items" on the booking form → `is_addon_requested = true`
2. Daj sees this flag in the dashboard
3. Daj creates an `order_request` linked to the `booking_request` via `booking_request_id`
4. The order follows the normal order flow, bundled into the booking quote

This way the customer gets one combined quote for both services.

## Stock Tracking

### Denormalized Current Stock

`material.current_stock` holds the current quantity. It's a denormalized cache for fast dashboard reads.

### Stock Movement Audit Trail

Every stock change creates a `stock_movement` record:

```
POST /api/admin/materials/movements
{
  "material_id": 1,
  "direction": "out",
  "quantity": 2,
  "reason": "Used for order #5",
  "order_request_id": 5
}
```

The route handler:
1. Creates the `stock_movement` record
2. Calls `materials.adjustStock(material_id, delta)` to update `current_stock`
   - `direction: 'in'` → `+quantity`
   - `direction: 'out'` → `-quantity`

### Low Stock Alerts

Materials with `current_stock <= minimum_stock` appear in:
- `GET /api/admin/materials/low-stock`
- `GET /api/admin/dashboard/stats` → `materials.low_stock_items`

## Pricing

- No prices are shown on the public site
- `quoted_amount` is filled by Daj when he moves an order/booking to `quoted` status
- Pricing is per-consultation — varies by complexity, materials, event duration
- Photography: typically ~₱5,000 for a 4-hour event (but flexible)

## Customer Data

- No customer accounts — customers provide name + phone per submission
- No login required for ordering or booking
- Repeat customers are identified manually by Daj (by phone number)
- If customer accounts become necessary, add a `customer` table later

## Site Settings

Key-value store in `site_setting` table for configurable values:
- `site_name` — "Daj Creative"
- `tagline` — used in footer and meta tags
- `contact_email` — primary contact
- `instagram` — social link
- `response_time` — promise shown on forms ("24 hours")
