import { query } from '../utils/db.js';

export interface ProductRow {
  product_id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function listByCategory(category_id: number, active_only = true) {
  const where = active_only ? 'AND is_active = true' : '';
  const result = await query<ProductRow>(
    `SELECT * FROM product WHERE category_id = $1 ${where} ORDER BY display_order, name`,
    [category_id],
  );
  return result.rows;
}

export async function findBySlug(slug: string) {
  const result = await query<ProductRow>(
    'SELECT * FROM product WHERE slug = $1',
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function findById(product_id: number) {
  const result = await query<ProductRow>(
    'SELECT * FROM product WHERE product_id = $1',
    [product_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
}) {
  const result = await query<ProductRow>(
    `INSERT INTO product (category_id, name, slug, description, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.category_id, data.name, data.slug, data.description ?? null, data.display_order ?? 0],
  );
  return result.rows[0];
}

export async function update(product_id: number, data: Partial<Pick<ProductRow, 'name' | 'slug' | 'description' | 'display_order' | 'is_active' | 'category_id'>>) {
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

  values.push(product_id);
  const result = await query<ProductRow>(
    `UPDATE product SET ${fields.join(', ')} WHERE product_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function remove(product_id: number) {
  await query('DELETE FROM product WHERE product_id = $1', [product_id]);
}
