import { query } from '../utils/db.js';

export interface MaterialRow {
  material_id: number;
  name: string;
  unit: string;
  current_stock: string;
  minimum_stock: string;
  cost_per_unit: string | null;
  supplier: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function listActive() {
  const result = await query<MaterialRow>(
    'SELECT * FROM material WHERE is_active = true ORDER BY name',
  );
  return result.rows;
}

export async function listAll() {
  const result = await query<MaterialRow>(
    'SELECT * FROM material ORDER BY name',
  );
  return result.rows;
}

export async function listLowStock() {
  const result = await query<MaterialRow>(
    'SELECT * FROM material WHERE is_active = true AND current_stock <= minimum_stock ORDER BY name',
  );
  return result.rows;
}

export async function findById(material_id: number) {
  const result = await query<MaterialRow>(
    'SELECT * FROM material WHERE material_id = $1',
    [material_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  name: string;
  unit: string;
  current_stock?: number;
  minimum_stock?: number;
  cost_per_unit?: number;
  supplier?: string;
}) {
  const result = await query<MaterialRow>(
    `INSERT INTO material (name, unit, current_stock, minimum_stock, cost_per_unit, supplier)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.name, data.unit, data.current_stock ?? 0, data.minimum_stock ?? 0, data.cost_per_unit ?? null, data.supplier ?? null],
  );
  return result.rows[0];
}

export async function update(material_id: number, data: Partial<Pick<MaterialRow, 'name' | 'unit' | 'minimum_stock' | 'cost_per_unit' | 'supplier' | 'is_active'>>) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      fields.push(`${key} = $${i++}`);
      values.push(val);
    }
  }

  if (fields.length === 0) return null;

  values.push(material_id);
  const result = await query<MaterialRow>(
    `UPDATE material SET ${fields.join(', ')} WHERE material_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function adjustStock(material_id: number, delta: number) {
  const result = await query<MaterialRow>(
    `UPDATE material SET current_stock = current_stock + $1 WHERE material_id = $2 RETURNING *`,
    [delta, material_id],
  );
  return result.rows[0] ?? null;
}
