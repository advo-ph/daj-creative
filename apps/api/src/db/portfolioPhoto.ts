import { query } from '../utils/db.js';

export interface PortfolioPhotoRow {
  portfolio_photo_id: number;
  portfolio_item_id: number;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export async function listByItem(portfolio_item_id: number) {
  const result = await query<PortfolioPhotoRow>(
    'SELECT * FROM portfolio_photo WHERE portfolio_item_id = $1 ORDER BY display_order',
    [portfolio_item_id],
  );
  return result.rows;
}

export async function create(data: {
  portfolio_item_id: number;
  url: string;
  alt_text?: string;
  display_order?: number;
}) {
  const result = await query<PortfolioPhotoRow>(
    `INSERT INTO portfolio_photo (portfolio_item_id, url, alt_text, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.portfolio_item_id, data.url, data.alt_text ?? null, data.display_order ?? 0],
  );
  return result.rows[0];
}

export async function remove(portfolio_photo_id: number) {
  await query('DELETE FROM portfolio_photo WHERE portfolio_photo_id = $1', [portfolio_photo_id]);
}
