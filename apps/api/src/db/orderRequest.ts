import { query } from '../utils/db.js';

export interface OrderRequestRow {
  order_request_id: number;
  product_id: number | null;
  category_id: number | null;
  booking_request_id: number | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  personalization_text: string | null;
  notes: string | null;
  status: string;
  quoted_amount: string | null;
  quoted_at: string | null;
  approved_at: string | null;
  completed_at: string | null;
  delivered_at: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function list(filters: { status?: string; limit?: number; offset?: number } = {}) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (filters.status) {
    conditions.push(`status = $${i++}`);
    values.push(filters.status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;

  values.push(limit, offset);
  const result = await query<OrderRequestRow>(
    `SELECT * FROM order_request ${where} ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i}`,
    values,
  );
  return result.rows;
}

export async function findById(order_request_id: number) {
  const result = await query<OrderRequestRow>(
    'SELECT * FROM order_request WHERE order_request_id = $1',
    [order_request_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  product_id?: number;
  category_id?: number;
  booking_request_id?: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  personalization_text?: string;
  notes?: string;
}) {
  const result = await query<OrderRequestRow>(
    `INSERT INTO order_request (product_id, category_id, booking_request_id, customer_name, customer_email, customer_phone, personalization_text, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.product_id ?? null,
      data.category_id ?? null,
      data.booking_request_id ?? null,
      data.customer_name,
      data.customer_email ?? null,
      data.customer_phone,
      data.personalization_text ?? null,
      data.notes ?? null,
    ],
  );
  return result.rows[0];
}

export async function updateStatus(
  order_request_id: number,
  status: string,
  extra: { quoted_amount?: number; internal_notes?: string; assigned_to?: string } = {},
) {
  const timestamp_field: Record<string, string> = {
    quoted: 'quoted_at',
    approved: 'approved_at',
    completed: 'completed_at',
    delivered: 'delivered_at',
  };

  const sets = ['status = $1'];
  const values: unknown[] = [status];
  let i = 2;

  const ts_col = timestamp_field[status];
  if (ts_col) {
    sets.push(`${ts_col} = now()`);
  }

  if (extra.quoted_amount !== undefined) {
    sets.push(`quoted_amount = $${i++}`);
    values.push(extra.quoted_amount);
  }
  if (extra.internal_notes !== undefined) {
    sets.push(`internal_notes = $${i++}`);
    values.push(extra.internal_notes);
  }
  if (extra.assigned_to !== undefined) {
    sets.push(`assigned_to = $${i++}`);
    values.push(extra.assigned_to);
  }

  values.push(order_request_id);
  const result = await query<OrderRequestRow>(
    `UPDATE order_request SET ${sets.join(', ')} WHERE order_request_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function count(status?: string) {
  if (status) {
    const result = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM order_request WHERE status = $1',
      [status],
    );
    return parseInt(result.rows[0].count, 10);
  }
  const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM order_request');
  return parseInt(result.rows[0].count, 10);
}
