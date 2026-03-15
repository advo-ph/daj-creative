import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';

import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import portfolioRoutes from './routes/portfolio.js';
import orderRoutes from './routes/order.js';
import bookingRoutes from './routes/booking.js';
import materialRoutes from './routes/material.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// ── PUBLIC ROUTES ───────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);

// ── INTERNAL ROUTES (auth required per-router) ──────────
app.use('/api/admin/materials', materialRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// ── ERROR HANDLER ───────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[api] error:', err.message);
  res.status(500).json({ error: env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

app.listen(env.PORT, () => {
  console.log(`[api] running on http://localhost:${env.PORT}`);
});

export default app;
