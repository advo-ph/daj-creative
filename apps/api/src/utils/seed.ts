import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.resolve(__dirname, '../../seed.sql');

async function seed() {
  if (!fs.existsSync(SEED_FILE)) {
    console.log('[seed] no seed.sql found, skipping');
    process.exit(0);
  }

  const sql = fs.readFileSync(SEED_FILE, 'utf-8');
  console.log('[seed] running seed.sql...');
  await query(sql);
  console.log('[seed] done');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
