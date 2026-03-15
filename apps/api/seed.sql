-- ─── OWNER ACCOUNT ──────────────────────────────────────
-- password: "dajcreative2025" (bcrypt hash)
INSERT INTO account (email, password_hash, first_name, last_name, phone, role)
VALUES (
  'daj@dajcreative.ph',
  '$2a$10$placeholder_hash_replace_before_running',
  'Daj',
  'Creative',
  NULL,
  'owner'
) ON CONFLICT (email) DO NOTHING;

-- ─── CATEGORIES ─────────────────────────────────────────
INSERT INTO category (name, slug, description, display_order) VALUES
  ('Crochet', 'crochet', 'Handmade crochet items — totes, keychains, earrings, and more.', 1),
  ('Laser Engraving', 'laser-engraving', 'Custom engravings on wood, acrylic, and other materials.', 2),
  ('Stickers & Prints', 'stickers', 'Die-cut stickers and prints from your design. Waterproof.', 3),
  ('Embroidery', 'embroidery', 'Machine-embroidered patches, accessories, and custom items.', 4)
ON CONFLICT (slug) DO NOTHING;

-- ─── PRODUCTS ───────────────────────────────────────────
INSERT INTO product (category_id, name, slug, description, display_order) VALUES
  ((SELECT category_id FROM category WHERE slug = 'crochet'), 'Custom tote bag', 'crochet-tote-bag', 'Personalized with your name or photo. Made to order.', 1),
  ((SELECT category_id FROM category WHERE slug = 'crochet'), 'Keychain', 'crochet-keychain', 'Small crochet keychains in any color or design.', 2),
  ((SELECT category_id FROM category WHERE slug = 'crochet'), 'Earrings', 'crochet-earrings', 'Handmade crochet earrings. Lightweight and unique.', 3),
  ((SELECT category_id FROM category WHERE slug = 'laser-engraving'), 'Engraved keepsake', 'engraved-keepsake', 'Wood, acrylic, and more. Any text, any design.', 1),
  ((SELECT category_id FROM category WHERE slug = 'laser-engraving'), 'Engraved pen', 'engraved-pen', 'Personalized pens for gifts or corporate use.', 2),
  ((SELECT category_id FROM category WHERE slug = 'stickers'), 'Custom sticker set', 'custom-sticker-set', 'Die-cut from your design. Waterproof. Any size.', 1),
  ((SELECT category_id FROM category WHERE slug = 'embroidery'), 'Custom patch', 'custom-patch', 'Embroidered patches for bags, jackets, or gifts.', 1)
ON CONFLICT (slug) DO NOTHING;

-- ─── SAMPLE PORTFOLIO ITEMS ─────────────────────────────
INSERT INTO portfolio_item (title, slug, type, description, project_date, is_featured) VALUES
  ('Family Session — BGC', 'family-session-bgc', 'photography', 'Weekend family portrait session at Bonifacio High Street.', '2024-11-15', true),
  ('Birthday Event Coverage', 'birthday-event-2024', 'photography', 'Full event coverage for a 7th birthday celebration.', '2024-09-20', true),
  ('Street Photography — Manila', 'street-manila', 'photography', 'Everyday life captured in the streets of Manila.', '2024-06-10', false),
  ('Commute Diaries', 'commute-diaries', 'video', 'Short narrative video of the daily BGC commute on a kick scooter.', '2025-01-05', true),
  ('Crochet Collection 2024', 'crochet-collection-2024', 'crochet', 'Totes, keychains, and earrings made throughout 2024.', '2024-12-01', true)
ON CONFLICT (slug) DO NOTHING;

-- ─── SAMPLE MATERIALS ───────────────────────────────────
INSERT INTO material (name, unit, current_stock, minimum_stock, cost_per_unit, supplier) VALUES
  ('Cotton yarn 4-ply (Cream)', 'roll', 12, 5, 85.00, 'Divisoria'),
  ('Cotton yarn 4-ply (Forest Green)', 'roll', 8, 5, 85.00, 'Divisoria'),
  ('Acrylic sheet 3mm (Clear)', 'sheet', 15, 3, 120.00, 'Lazada'),
  ('Plywood 3mm (A4)', 'sheet', 20, 5, 35.00, 'Hardware store'),
  ('Vinyl sticker paper (Matte)', 'sheet', 30, 10, 15.00, 'Shopee'),
  ('Vinyl sticker paper (Glossy)', 'sheet', 25, 10, 15.00, 'Shopee'),
  ('Embroidery thread (Assorted)', 'spool', 40, 10, 25.00, 'Divisoria'),
  ('Keychain ring (Gold)', 'piece', 50, 20, 5.00, 'Divisoria'),
  ('Tote bag blank (Canvas)', 'piece', 10, 5, 45.00, 'Lazada')
ON CONFLICT DO NOTHING;

-- ─── SITE SETTINGS ──────────────────────────────────────
INSERT INTO site_setting (key, value) VALUES
  ('site_name', 'Daj Creative'),
  ('tagline', 'Photography, video, and personalized items — all made with intention.'),
  ('contact_email', 'daj@dajcreative.ph'),
  ('instagram', '@dajcreative'),
  ('response_time', '24 hours')
ON CONFLICT (key) DO NOTHING;
