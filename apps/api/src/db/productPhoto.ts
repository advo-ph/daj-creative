import { query } from '../utils/db.js';

export interface ProductPhotoRow {
  product_photo_id: number;
  product_id: number;
  url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export async function listByProduct(product_id: number) {
  const result = await query<ProductPhotoRow>(
    'SELECT * FROM product_photo WHERE product_id = $1 ORDER BY display_order',
    [product_id],
  );
  return result.rows;
}

export async function create(data: {
  product_id: number;
  url: string;
  alt_text?: string;
  display_order?: number;
}) {
  const result = await query<ProductPhotoRow>(
    `INSERT INTO product_photo (product_id, url, alt_text, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.product_id, data.url, data.alt_text ?? null, data.display_order ?? 0],
  );
  return result.rows[0];
}

export async function remove(product_photo_id: number) {
  await query('DELETE FROM product_photo WHERE product_photo_id = $1', [product_photo_id]);
}

export async function updateOrder(product_photo_id: number, display_order: number) {
  await query(
    'UPDATE product_photo SET display_order = $1 WHERE product_photo_id = $2',
    [display_order, product_photo_id],
  );
}
