import { Router } from 'express';
import { z } from 'zod';
import { materials, stockMovements } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// all material routes require auth (internal only)
router.use(requireAuth);

router.get('/', async (_req, res) => {
  const rows = await materials.listAll();
  res.json(rows);
});

router.get('/low-stock', async (_req, res) => {
  const rows = await materials.listLowStock();
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const row = await materials.findById(Number(req.params.id));
  if (!row) {
    res.status(404).json({ error: 'Material not found' });
    return;
  }
  res.json(row);
});

const createSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  current_stock: z.number().optional(),
  minimum_stock: z.number().optional(),
  cost_per_unit: z.number().optional(),
  supplier: z.string().optional(),
});

router.post('/', validate(createSchema), async (req, res) => {
  const row = await materials.create(req.body);
  res.status(201).json(row);
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  minimum_stock: z.string().optional(),
  cost_per_unit: z.string().optional(),
  supplier: z.string().optional(),
  is_active: z.boolean().optional(),
});

router.patch('/:id', validate(updateSchema), async (req, res) => {
  const row = await materials.update(Number(req.params.id), req.body);
  if (!row) {
    res.status(404).json({ error: 'Material not found' });
    return;
  }
  res.json(row);
});

// ── STOCK MOVEMENTS ─────────────────────────────────────

router.get('/:id/movements', async (req, res) => {
  const rows = await stockMovements.listByMaterial(Number(req.params.id));
  res.json(rows);
});

const movementSchema = z.object({
  material_id: z.number().int(),
  direction: z.enum(['in', 'out']),
  quantity: z.number().positive(),
  reason: z.string().optional(),
  order_request_id: z.number().int().optional(),
});

router.post('/movements', validate(movementSchema), async (req, res) => {
  const { material_id, direction, quantity, reason, order_request_id } = req.body;

  const movement = await stockMovements.create({
    material_id,
    direction,
    quantity,
    reason,
    order_request_id,
    recorded_by: req.auth!.account_id,
  });

  const delta = direction === 'in' ? quantity : -quantity;
  await materials.adjustStock(material_id, delta);

  res.status(201).json(movement);
});

export default router;
