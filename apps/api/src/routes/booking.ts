import { Router } from 'express';
import { z } from 'zod';
import { bookingRequests } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ── PUBLIC ──────────────────────────────────────────────

const submitSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().min(1),
  event_type: z.string().optional(),
  event_date: z.string().optional(),
  event_location: z.string().optional(),
  event_duration_hrs: z.number().int().optional(),
  description: z.string().optional(),
  is_addon_requested: z.boolean().optional(),
});

router.post('/', validate(submitSchema), async (req, res) => {
  const row = await bookingRequests.create(req.body);
  res.status(201).json({ booking_request_id: row.booking_request_id, message: 'Booking request received. We\'ll get back to you within 24 hours.' });
});

// ── ADMIN ───────────────────────────────────────────────

router.get('/', requireAuth, async (req, res) => {
  const { status, limit, offset } = req.query;
  const rows = await bookingRequests.list({
    status: status as string | undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  });
  res.json(rows);
});

router.get('/count', requireAuth, async (req, res) => {
  const status = req.query.status as string | undefined;
  const count = await bookingRequests.count(status);
  res.json({ count });
});

router.get('/:id', requireAuth, async (req, res) => {
  const row = await bookingRequests.findById(Number(req.params.id));
  if (!row) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json(row);
});

const updateStatusSchema = z.object({
  status: z.enum(['new', 'quoted', 'confirmed', 'completed', 'cancelled']),
  quoted_amount: z.number().optional(),
  internal_notes: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
});

router.patch('/:id', requireAuth, validate(updateStatusSchema), async (req, res) => {
  const { status, ...extra } = req.body;
  const row = await bookingRequests.updateStatus(Number(req.params.id), status, extra);
  if (!row) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json(row);
});

export default router;
