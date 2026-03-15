import { Router } from 'express';
import { orderRequests, bookingRequests, materials } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', async (_req, res) => {
  const [
    ordersNew,
    ordersInProgress,
    ordersTotal,
    bookingsNew,
    bookingsConfirmed,
    bookingsTotal,
    lowStockMaterials,
  ] = await Promise.all([
    orderRequests.count('new'),
    orderRequests.count('in_progress'),
    orderRequests.count(),
    bookingRequests.count('new'),
    bookingRequests.count('confirmed'),
    bookingRequests.count(),
    materials.listLowStock(),
  ]);

  res.json({
    orders: {
      new: ordersNew,
      in_progress: ordersInProgress,
      total: ordersTotal,
    },
    bookings: {
      new: bookingsNew,
      confirmed: bookingsConfirmed,
      total: bookingsTotal,
    },
    materials: {
      low_stock_count: lowStockMaterials.length,
      low_stock_items: lowStockMaterials.map((m) => ({ material_id: m.material_id, name: m.name, current_stock: m.current_stock, minimum_stock: m.minimum_stock })),
    },
  });
});

export default router;
