-- ─── ENUMS ──────────────────────────────────────────────────

CREATE TYPE order_status AS ENUM (
  'new',
  'quoted',
  'approved',
  'in_progress',
  'completed',
  'delivered',
  'cancelled'
);

CREATE TYPE booking_status AS ENUM (
  'new',
  'quoted',
  'confirmed',
  'completed',
  'cancelled'
);

CREATE TYPE portfolio_type AS ENUM (
  'photography',
  'video',
  'crochet',
  'engraving',
  'sticker',
  'embroidery'
);

CREATE TYPE stock_direction AS ENUM ('in', 'out');

CREATE TYPE platform_role AS ENUM ('owner', 'staff');


-- ─── TIMESTAMP TRIGGER ──────────────────────────────────────

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── ACCOUNT ────────────────────────────────────────────────

CREATE TABLE account (
  account_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT NOT NULL UNIQUE,
  password_hash    TEXT NOT NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  phone            TEXT,
  avatar_url       TEXT,
  role             platform_role NOT NULL DEFAULT 'staff',
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_account_email ON account (email);
CREATE TRIGGER trg_account_updated BEFORE UPDATE ON account
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── CATEGORY ───────────────────────────────────────────────

CREATE TABLE category (
  category_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  display_order    INT NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_category_updated BEFORE UPDATE ON category
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── PRODUCT ────────────────────────────────────────────────

CREATE TABLE product (
  product_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id      BIGINT NOT NULL REFERENCES category (category_id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  display_order    INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_category ON product (category_id);
CREATE INDEX idx_product_slug ON product (slug);
CREATE TRIGGER trg_product_updated BEFORE UPDATE ON product
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── PRODUCT_PHOTO ──────────────────────────────────────────

CREATE TABLE product_photo (
  product_photo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id       BIGINT NOT NULL REFERENCES product (product_id) ON DELETE CASCADE,
  url              TEXT NOT NULL,
  alt_text         TEXT,
  display_order    INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_photo_product ON product_photo (product_id);


-- ─── PORTFOLIO_ITEM ─────────────────────────────────────────

CREATE TABLE portfolio_item (
  portfolio_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  type              portfolio_type NOT NULL,
  description       TEXT,
  project_date      DATE,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_item_type ON portfolio_item (type);
CREATE TRIGGER trg_portfolio_item_updated BEFORE UPDATE ON portfolio_item
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── PORTFOLIO_PHOTO ────────────────────────────────────────

CREATE TABLE portfolio_photo (
  portfolio_photo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  portfolio_item_id  BIGINT NOT NULL REFERENCES portfolio_item (portfolio_item_id) ON DELETE CASCADE,
  url                TEXT NOT NULL,
  alt_text           TEXT,
  display_order      INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_photo_item ON portfolio_photo (portfolio_item_id);


-- ─── BOOKING_REQUEST ────────────────────────────────────────

CREATE TABLE booking_request (
  booking_request_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name      TEXT NOT NULL,
  customer_email     TEXT,
  customer_phone     TEXT NOT NULL,
  event_type         TEXT,
  event_date         DATE,
  event_location     TEXT,
  event_duration_hrs INT,
  description        TEXT,
  status             booking_status NOT NULL DEFAULT 'new',
  quoted_amount      NUMERIC(10, 2),
  quoted_at          TIMESTAMPTZ,
  confirmed_at       TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  is_addon_requested BOOLEAN NOT NULL DEFAULT false,
  assigned_to        UUID REFERENCES account (account_id) ON DELETE SET NULL,
  internal_notes     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_booking_request_status ON booking_request (status);
CREATE INDEX idx_booking_request_event_date ON booking_request (event_date);
CREATE INDEX idx_booking_request_created ON booking_request (created_at DESC);
CREATE TRIGGER trg_booking_request_updated BEFORE UPDATE ON booking_request
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── ORDER_REQUEST ──────────────────────────────────────────

CREATE TABLE order_request (
  order_request_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id         BIGINT REFERENCES product (product_id) ON DELETE SET NULL,
  category_id        BIGINT REFERENCES category (category_id) ON DELETE SET NULL,
  booking_request_id BIGINT REFERENCES booking_request (booking_request_id) ON DELETE SET NULL,
  customer_name      TEXT NOT NULL,
  customer_email     TEXT,
  customer_phone     TEXT NOT NULL,
  personalization_text TEXT,
  notes              TEXT,
  status             order_status NOT NULL DEFAULT 'new',
  quoted_amount      NUMERIC(10, 2),
  quoted_at          TIMESTAMPTZ,
  approved_at        TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  delivered_at       TIMESTAMPTZ,
  assigned_to        UUID REFERENCES account (account_id) ON DELETE SET NULL,
  internal_notes     TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_request_status ON order_request (status);
CREATE INDEX idx_order_request_created ON order_request (created_at DESC);
CREATE INDEX idx_order_request_booking ON order_request (booking_request_id);
CREATE TRIGGER trg_order_request_updated BEFORE UPDATE ON order_request
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── ORDER_ATTACHMENT ───────────────────────────────────────

CREATE TABLE order_attachment (
  order_attachment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_request_id    BIGINT NOT NULL REFERENCES order_request (order_request_id) ON DELETE CASCADE,
  url                 TEXT NOT NULL,
  original_filename   TEXT,
  file_type           TEXT,
  file_size_bytes     BIGINT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_attachment_order ON order_attachment (order_request_id);


-- ─── MATERIAL ───────────────────────────────────────────────

CREATE TABLE material (
  material_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT NOT NULL,
  unit             TEXT NOT NULL,
  current_stock    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  minimum_stock    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  cost_per_unit    NUMERIC(10, 2),
  supplier         TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_material_updated BEFORE UPDATE ON material
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ─── STOCK_MOVEMENT ─────────────────────────────────────────

CREATE TABLE stock_movement (
  stock_movement_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  material_id       BIGINT NOT NULL REFERENCES material (material_id) ON DELETE CASCADE,
  direction         stock_direction NOT NULL,
  quantity          NUMERIC(10, 2) NOT NULL,
  reason            TEXT,
  order_request_id  BIGINT REFERENCES order_request (order_request_id) ON DELETE SET NULL,
  recorded_by       UUID REFERENCES account (account_id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stock_movement_material ON stock_movement (material_id);
CREATE INDEX idx_stock_movement_created ON stock_movement (created_at DESC);


-- ─── SITE_SETTING ───────────────────────────────────────────

CREATE TABLE site_setting (
  key              TEXT PRIMARY KEY,
  value            TEXT NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ─── SCHEMA MIGRATIONS TRACKER ──────────────────────────────

CREATE TABLE IF NOT EXISTS schema_migration (
  filename         TEXT PRIMARY KEY,
  applied_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
