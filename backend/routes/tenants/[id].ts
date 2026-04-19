import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { getTenantById } from '../../controllers/tenantQueryController';

const router = Router();

/**
 * GET /api/tenants/:id
 */
router.get(
  '/:id',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const tenant = await getTenantById(req.params.id, req.user!.property_id);
      res.status(200).json({ message: 'Tenant fetched successfully', data: tenant });
    } catch (error: any) {
      console.error('Fetch Tenant Error:', error);
      if (error.message === 'Tenant not found in this property') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Failed to fetch tenant' });
    }
  }
);

export default router;
