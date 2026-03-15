import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

async function ensureMigrationTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migration (
      filename   TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await query<{ filename: string }>(
    'SELECT filename FROM schema_migration ORDER BY filename',
  );
  return new Set(result.rows.map((r) => r.filename));
}

async function migrate() {
  await ensureMigrationTable();
  const applied = await getAppliedMigrations();

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    console.log(`[migrate] applying ${file}...`);

    await query(sql);
    await query('INSERT INTO schema_migration (filename) VALUES ($1)', [file]);
    count++;
  }

  if (count === 0) {
    console.log('[migrate] already up to date');
  } else {
    console.log(`[migrate] applied ${count} migration(s)`);
  }

  process.exit(0);
}

migrate().catch((err) => {
  console.error('[migrate] failed:', err);
  process.exit(1);
});
