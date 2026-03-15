import { query } from '../utils/db.js';

export interface AccountRow {
  account_id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function findByEmail(email: string) {
  const result = await query<AccountRow>(
    'SELECT * FROM account WHERE email = $1',
    [email],
  );
  return result.rows[0] ?? null;
}

export async function findById(account_id: string) {
  const result = await query<AccountRow>(
    'SELECT * FROM account WHERE account_id = $1',
    [account_id],
  );
  return result.rows[0] ?? null;
}

export async function create(data: {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
}) {
  const result = await query<AccountRow>(
    `INSERT INTO account (email, password_hash, first_name, last_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.email, data.password_hash, data.first_name, data.last_name, data.phone ?? null, data.role ?? 'staff'],
  );
  return result.rows[0];
}

export async function update(account_id: string, data: Partial<Pick<AccountRow, 'first_name' | 'last_name' | 'phone' | 'avatar_url' | 'is_active'>>) {
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

  values.push(account_id);
  const result = await query<AccountRow>(
    `UPDATE account SET ${fields.join(', ')} WHERE account_id = $${i} RETURNING *`,
    values,
  );
  return result.rows[0] ?? null;
}
