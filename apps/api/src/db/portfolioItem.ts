import { query } from '../utils/db.js';

export interface PortfolioItemRow {
  portfolio_item_id: number;
  title: string;
  slug: string;
  type: string;
  description: string | null;
  project_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function listActive(type?: string) {
  if (type) {
    const result = await query<PortfolioItemRow>(
      'SELECT * FROM portfolio_item WHERE is_active = true AND type = $1 ORDER BY project_date DESC NULLS LAST',
      [type],
    );
    return result.rows;
  }
  const result = await query<PortfolioItemRow>(
    'SELECT * FROM portfolio_item WHERE is_active = true ORDER BY project_date DESC NULLS LAST',
  );
  return result.rows;
}

export async function listFeatured() {
  const result = await query<PortfolioItemRow>(
    'SELECT * FROM portfolio_item WHERE is_active = true AND is_featured = true ORDER BY project_date DESC NULLS LAST',
  );
  return result.rows;
}

export async function findBySlug(slug: string) {
  const result = await query<PortfolioItemRow>(
    'SELECT * FROM portfolio_item WHERE slug = $1',
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function findById(portfolio_item_id: number) {
  const result = await query<PortfolioItemRow>(
    'SELECT * FROM portfolio_item WHERE portfolio_item_id = $1',
    [portfolio_item_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  title: string;
  slug: string;
  type: string;
  description?: string;
  project_date?: string;
  is_featured?: boolean;
}) {
  const result = await query<PortfolioItemRow>(
    `INSERT INTO portfolio_item (title, slug, type, description, project_date, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.title, data.slug, data.type, data.description ?? null, data.project_date ?? null, data.is_featured ?? false],
  );
  return result.rows[0];
}

export async function update(portfolio_item_id: number, data: Partial<Pick<PortfolioItemRow, 'title' | 'slug' | 'type' | 'description' | 'project_date' | 'is_featured' | 'is_active'>>) {
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

  values.push(portfolio_item_id);
  const result = await query<PortfolioItemRow>(
    `UPDATE portfolio_item SET ${fields.join(', ')} WHERE portfolio_item_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function remove(portfolio_item_id: number) {
  await query('DELETE FROM portfolio_item WHERE portfolio_item_id = $1', [portfolio_item_id]);
}
