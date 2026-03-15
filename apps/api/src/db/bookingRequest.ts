import { query } from '../utils/db.js';

export interface BookingRequestRow {
  booking_request_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  event_type: string | null;
  event_date: string | null;
  event_location: string | null;
  event_duration_hrs: number | null;
  description: string | null;
  status: string;
  quoted_amount: string | null;
  quoted_at: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  is_addon_requested: boolean;
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
  const result = await query<BookingRequestRow>(
    `SELECT * FROM booking_request ${where} ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i}`,
    values,
  );
  return result.rows;
}

export async function findById(booking_request_id: number) {
  const result = await query<BookingRequestRow>(
    'SELECT * FROM booking_request WHERE booking_request_id = $1',
    [booking_request_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  event_type?: string;
  event_date?: string;
  event_location?: string;
  event_duration_hrs?: number;
  description?: string;
  is_addon_requested?: boolean;
}) {
  const result = await query<BookingRequestRow>(
    `INSERT INTO booking_request (customer_name, customer_email, customer_phone, event_type, event_date, event_location, event_duration_hrs, description, is_addon_requested)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.customer_name,
      data.customer_email ?? null,
      data.customer_phone,
      data.event_type ?? null,
      data.event_date ?? null,
      data.event_location ?? null,
      data.event_duration_hrs ?? null,
      data.description ?? null,
      data.is_addon_requested ?? false,
    ],
  );
  return result.rows[0];
}

export async function updateStatus(
  booking_request_id: number,
  status: string,
  extra: { quoted_amount?: number; internal_notes?: string; assigned_to?: string } = {},
) {
  const timestamp_field: Record<string, string> = {
    quoted: 'quoted_at',
    confirmed: 'confirmed_at',
    completed: 'completed_at',
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

  values.push(booking_request_id);
  const result = await query<BookingRequestRow>(
    `UPDATE booking_request SET ${sets.join(', ')} WHERE booking_request_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function count(status?: string) {
  if (status) {
    const result = await query<{ count: string }>(
      'SELECT COUNT(*) as count FROM booking_request WHERE status = $1',
      [status],
    );
    return parseInt(result.rows[0].count, 10);
  }
  const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM booking_request');
  return parseInt(result.rows[0].count, 10);
}
