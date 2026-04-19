import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { getTenants } from '../../controllers/tenantQueryController';

const router = Router();

/**
 * GET /api/tenants
 * Query: ?page=1&limit=20
 */
router.get(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const page  = parseInt((req.query.page  as string) || '1',  10);
      const limit = parseInt((req.query.limit as string) || '20', 10);

      const result = await getTenants(req.user!.property_id, page, limit);
      res.status(200).json({ message: 'Tenants fetched successfully', ...result });
    } catch (error: any) {
      console.error('Fetch Tenants Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch tenants' });
    }
  }
);

export default router;
