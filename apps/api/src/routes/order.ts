import { Router } from 'express';
import { z } from 'zod';
import { orderRequests, orderAttachments } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────

const submitSchema = z.object({
  product_id: z.number().int().optional(),
  category_id: z.number().int().optional(),
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(1),
  personalization_text: z.string().optional(),
  notes: z.string().optional(),
});

router.post('/', validate(submitSchema), async (req, res) => {
  const row = await orderRequests.create(req.body);
  res.status(201).json({ order_request_id: row.order_request_id, message: 'Request received. We\'ll get back to you within 24 hours.' });
});

// ── ADMIN ───────────────────────────────────────────────

router.get('/', requireAuth, async (req, res) => {
  const { status, limit, offset } = req.query;
  const rows = await orderRequests.list({
    status: status as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });
  res.json(rows);
});

router.get('/count', requireAuth, async (req, res) => {
  const status = req.query.status as string | undefined;
  const count = await orderRequests.count(status);
  res.json({ count });
});

router.get('/:id', requireAuth, async (req, res) => {
  const row = await orderRequests.findById(Number(req.params.id));
  if (!row) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const attachments = await orderAttachments.listByOrder(row.order_request_id);
  res.json({ ...row, attachments });
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'quoted', 'approved', 'in_progress', 'completed', 'delivered', 'cancelled']),
  quoted_amount: z.number().optional(),
  internal_notes: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
});

router.patch('/:id', requireAuth, validate(updateStatusSchema), async (req, res) => {
  const { status, ...extra } = req.body;
  const row = await orderRequests.updateStatus(Number(req.params.id), status, extra);
  if (!row) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(row);
});

// ── ATTACHMENTS ─────────────────────────────────────────

router.get('/:id/attachments', requireAuth, async (req, res) => {
  const rows = await orderAttachments.listByOrder(Number(req.params.id));
  res.json(rows);
});

router.post('/:id/attachments', async (req, res) => {
  const attachment = await orderAttachments.create({
    order_request_id: Number(req.params.id),
    url: req.body.url,
    original_filename: req.body.original_filename,
    file_type: req.body.file_type,
    file_size_bytes: req.body.file_size_bytes,
  });
  res.status(201).json(attachment);
});

router.delete('/attachments/:attachmentId', requireAuth, async (req, res) => {
  await orderAttachments.remove(Number(req.params.attachmentId));
  res.status(204).end();
});

export default router;
