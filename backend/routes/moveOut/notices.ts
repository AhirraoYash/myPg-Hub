import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { getMoveOutNotices } from '../../controllers/moveOutQueryController';

const router = Router();

/**
 * GET /api/moveout/notices
 * Query: ?status=Notice_Given&page=1&limit=20
 */
router.get(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const status = (req.query.status as string) || undefined;
      const page   = parseInt((req.query.page  as string) || '1',  10);
      const limit  = parseInt((req.query.limit as string) || '20', 10);

      const result = await getMoveOutNotices(req.user!.property_id, status, page, limit);
      res.status(200).json({ message: 'Move-out notices fetched', ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch notices' });
    }
  }
);

export default router;
