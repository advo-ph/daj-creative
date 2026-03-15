import { Router } from 'express';
import { z } from 'zod';
import { products, productPhotos } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────

router.get('/:slug', async (req, res) => {
  const product = await products.findBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const photos = await productPhotos.listByProduct(product.product_id);
  res.json({ ...product, photos });
});

// ── ADMIN ───────────────────────────────────────────────

const createSchema = z.object({
  category_id: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
});

router.post('/', requireAuth, validate(createSchema), async (req, res) => {
  const row = await products.create(req.body);
  res.status(201).json(row);
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  category_id: z.number().int().optional(),
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res) => {
  const row = await products.update(Number(req.params.id), req.body);
  if (!row) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(row);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await products.remove(Number(req.params.id));
  res.status(204).end();
});

// ── PHOTOS ──────────────────────────────────────────────

router.get('/:id/photos', async (req, res) => {
  const photos = await productPhotos.listByProduct(Number(req.params.id));
  res.json(photos);
});

router.post('/:id/photos', requireAuth, async (req, res) => {
  const photo = await productPhotos.create({
    product_id: Number(req.params.id),
    url: req.body.url,
    alt_text: req.body.alt_text,
    display_order: req.body.display_order,
  });
  res.status(201).json(photo);
});

router.delete('/photos/:photoId', requireAuth, async (req, res) => {
  await productPhotos.remove(Number(req.params.photoId));
  res.status(204).end();
});

export default router;
