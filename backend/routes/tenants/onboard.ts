import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { onboardTenant } from '../../controllers/tenantController';

const router = Router();

/**
 * POST /api/tenants/onboard
 * Body: { phone, first_name, last_name, bed_id, email?, pin? }
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { phone, first_name, last_name, bed_id } = req.body;

      if (!phone || !first_name || !last_name || !bed_id) {
        return res
          .status(400)
          .json({ error: 'Missing required fields: phone, first_name, last_name, bed_id' });
      }

      const result = await onboardTenant(req.body, req.user!.property_id);
      return res
        .status(201)
        .json({ message: 'Tenant onboarded successfully', data: result });
    } catch (error: any) {
      console.error('Tenant Onboarding Error:', error);
      if (error.name === 'VersionError') {
        return res
          .status(409)
          .json({ error: 'This bed was just booked. Please select another bed.' });
      }
      res.status(400).json({ error: error.message || 'Failed to onboard tenant' });
    }
  }
);

export default router;
