import { query } from '../utils/db.js';

export interface StockMovementRow {
  stock_movement_id: number;
  material_id: number;
  direction: string;
  quantity: string;
  reason: string | null;
  order_request_id: number | null;
  recorded_by: string | null;
  created_at: string;
}

export async function listByMaterial(material_id: number, limit = 50) {
  const result = await query<StockMovementRow>(
    'SELECT * FROM stock_movement WHERE material_id = $1 ORDER BY created_at DESC LIMIT $2',
    [material_id, limit],
  );
  return result.rows;
}

export async function create(data: {
  material_id: number;
  direction: 'in' | 'out';
  quantity: number;
  reason?: string;
  order_request_id?: number;
  recorded_by?: string;
}) {
  const result = await query<StockMovementRow>(
    `INSERT INTO stock_movement (material_id, direction, quantity, reason, order_request_id, recorded_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.material_id,
      data.direction,
      data.quantity,
      data.reason ?? null,
      data.order_request_id ?? null,
      data.recorded_by ?? null,
    ],
  );
  return result.rows[0];
}
