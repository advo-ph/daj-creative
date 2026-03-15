import { query } from '../utils/db.js';

export interface OrderAttachmentRow {
  order_attachment_id: number;
  order_request_id: number;
  url: string;
  original_filename: string | null;
  file_type: string | null;
  file_size_bytes: number | null;
  created_at: string;
}

export async function listByOrder(order_request_id: number) {
  const result = await query<OrderAttachmentRow>(
    'SELECT * FROM order_attachment WHERE order_request_id = $1 ORDER BY created_at',
    [order_request_id],
  );
  return result.rows;
}

export async function create(data: {
  order_request_id: number;
  url: string;
  original_filename?: string;
  file_type?: string;
  file_size_bytes?: number;
}) {
  const result = await query<OrderAttachmentRow>(
    `INSERT INTO order_attachment (order_request_id, url, original_filename, file_type, file_size_bytes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.order_request_id, data.url, data.original_filename ?? null, data.file_type ?? null, data.file_size_bytes ?? null],
  );
  return result.rows[0];
}

export async function remove(order_attachment_id: number) {
  await query('DELETE FROM order_attachment WHERE order_attachment_id = $1', [order_attachment_id]);
}
