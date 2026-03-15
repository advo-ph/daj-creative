import { query } from '../utils/db.js';

export interface SiteSettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export async function get(key: string) {
  const result = await query<SiteSettingRow>(
    'SELECT * FROM site_setting WHERE key = $1',
    [key],
  );
  return result.rows[0]?.value ?? null;
}

export async function set(key: string, value: string) {
  await query(
    `INSERT INTO site_setting (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, value],
  );
}

export async function listAll() {
  const result = await query<SiteSettingRow>(
    'SELECT * FROM site_setting ORDER BY key',
  );
  return result.rows;
}
