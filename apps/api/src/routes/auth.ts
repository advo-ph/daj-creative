import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { accounts } from '../db/index.js';
import { validate } from '../utils/validate.js';
import { env } from '../utils/env.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const account = await accounts.findByEmail(email);
  if (!account || !account.is_active) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, account.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { account_id: account.account_id, email: account.email, role: account.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'] },
  );

  res.json({
    token,
    account: {
      account_id: account.account_id,
      email: account.email,
      first_name: account.first_name,
      last_name: account.last_name,
      role: account.role,
    },
  });
});

router.post('/refresh', requireAuth, async (req, res) => {
  const { account_id, email, role } = req.auth!;

  const token = jwt.sign(
    { account_id, email, role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'] },
  );

  res.json({ token });
});

router.get('/me', requireAuth, async (req, res) => {
  const account = await accounts.findById(req.auth!.account_id);
  if (!account) {
    res.status(404).json({ error: 'Account not found' });
    return;
  }

  const { password_hash, ...safe } = account;
  res.json(safe);
});

export default router;
