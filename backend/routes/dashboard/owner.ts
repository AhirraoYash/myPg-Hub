import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { getOwnerMetrics } from '../../controllers/dashboardController';

const router = Router();

/**
 * GET /api/dashboard
 * Query: ?month=YYYY-MM
 */
router.get(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const month   = (req.query.month as string) || undefined;
      const metrics = await getOwnerMetrics(req.user!.property_id, month);
      res.status(200).json({ message: 'Owner metrics fetched', data: metrics });
    } catch (error: any) {
      console.error('Fetch Owner Metrics Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard' });
    }
  }
);

export default router;
