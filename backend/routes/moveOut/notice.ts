import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { submitNotice } from '../../controllers/moveOutController';

const router = Router();

/**
 * POST /api/moveout/notice
 * Tenant submits a move-out notice (no body required)
 */
router.post(
  '/',
  authenticate,
  authorize(['Tenant']),
  async (req: AuthRequest, res: Response) => {
    try {
      const notice = await submitNotice(req.user!.user_id, req.user!.property_id);
      res.status(201).json({ message: 'Move-out notice submitted', data: notice });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to submit notice' });
    }
  }
);

export default router;
