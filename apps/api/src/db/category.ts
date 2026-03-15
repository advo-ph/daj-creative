import { query } from '../utils/db.js';

export interface CategoryRow {
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function listActive() {
  const result = await query<CategoryRow>(
    'SELECT * FROM category WHERE is_active = true ORDER BY display_order, name',
  );
  return result.rows;
}

export async function listAll() {
  const result = await query<CategoryRow>(
    'SELECT * FROM category ORDER BY display_order, name',
  );
  return result.rows;
}

export async function findBySlug(slug: string) {
  const result = await query<CategoryRow>(
    'SELECT * FROM category WHERE slug = $1',
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function findById(category_id: number) {
  const result = await query<CategoryRow>(
    'SELECT * FROM category WHERE category_id = $1',
    [category_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
}) {
  const result = await query<CategoryRow>(
    `INSERT INTO category (name, slug, description, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.slug, data.description ?? null, data.display_order ?? 0],
  );
  return result.rows[0];
}

export async function update(category_id: number, data: Partial<Pick<CategoryRow, 'name' | 'slug' | 'description' | 'display_order' | 'is_active'>>) {
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

  values.push(category_id);
  const result = await query<CategoryRow>(
    `UPDATE category SET ${fields.join(', ')} WHERE category_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function remove(category_id: number) {
  await query('DELETE FROM category WHERE category_id = $1', [category_id]);
}
