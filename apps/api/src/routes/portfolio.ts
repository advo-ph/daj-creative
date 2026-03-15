import { Router } from 'express';
import { z } from 'zod';
import { portfolioItems, portfolioPhotos } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────

router.get('/', async (req, res) => {
  const type = req.query.type as string | undefined;
  const rows = await portfolioItems.listActive(type);

  const withPhotos = await Promise.all(
    rows.map(async (item) => ({
      ...item,
      photos: await portfolioPhotos.listByItem(item.portfolio_item_id),
    })),
  );

  res.json(withPhotos);
});

router.get('/featured', async (_req, res) => {
  const rows = await portfolioItems.listFeatured();

  const withPhotos = await Promise.all(
    rows.map(async (item) => ({
      ...item,
      photos: await portfolioPhotos.listByItem(item.portfolio_item_id),
    })),
  );

  res.json(withPhotos);
});

router.get('/:slug', async (req, res) => {
  const item = await portfolioItems.findBySlug(req.params.slug);
  if (!item) {
    res.status(404).json({ error: 'Portfolio item not found' });
    return;
  }

  const photos = await portfolioPhotos.listByItem(item.portfolio_item_id);
  res.json({ ...item, photos });
});

// ── ADMIN ───────────────────────────────────────────────

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(['photography', 'video', 'crochet', 'engraving', 'sticker', 'embroidery']),
  description: z.string().optional(),
  project_date: z.string().optional(),
  is_featured: z.boolean().optional(),
});

router.post('/', requireAuth, validate(createSchema), async (req, res) => {
  const row = await portfolioItems.create(req.body);
  res.status(201).json(row);
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  type: z.enum(['photography', 'video', 'crochet', 'engraving', 'sticker', 'embroidery']).optional(),
  description: z.string().optional(),
  project_date: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res) => {
  const row = await portfolioItems.update(Number(req.params.id), req.body);
  if (!row) {
    res.status(404).json({ error: 'Portfolio item not found' });
    return;
  }
  res.json(row);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await portfolioItems.remove(Number(req.params.id));
  res.status(204).end();
});

// ── PHOTOS ──────────────────────────────────────────────

router.post('/:id/photos', requireAuth, async (req, res) => {
  const photo = await portfolioPhotos.create({
    portfolio_item_id: Number(req.params.id),
    url: req.body.url,
    alt_text: req.body.alt_text,
    display_order: req.body.display_order,
  });
  res.status(201).json(photo);
});

router.delete('/photos/:photoId', requireAuth, async (req, res) => {
  await portfolioPhotos.remove(Number(req.params.photoId));
  res.status(204).end();
});

export default router;
