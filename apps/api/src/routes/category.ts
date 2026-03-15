import { Router } from 'express';
import { z } from 'zod';
import { categories, products, productPhotos } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────

router.get('/', async (_req, res) => {
  const rows = await categories.listActive();
  res.json(rows);
});

router.get('/:slug', async (req, res) => {
  const category = await categories.findBySlug(req.params.slug);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const items = await products.listByCategory(category.category_id);

  const itemsWithPhotos = await Promise.all(
    items.map(async (p) => ({
      ...p,
      photos: await productPhotos.listByProduct(p.product_id),
    })),
  );

  res.json({ ...category, products: itemsWithPhotos });
});

// ── ADMIN ───────────────────────────────────────────────

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
});

router.post('/', requireAuth, validate(createSchema), async (req, res) => {
  const row = await categories.create(req.body);
  res.status(201).json(row);
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res) => {
  const row = await categories.update(Number(req.params.id), req.body);
  if (!row) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(row);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await categories.remove(Number(req.params.id));
  res.status(204).end();
});

export default router;
