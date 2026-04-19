import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { completeMoveOut } from '../../controllers/moveOutController';

const router = Router();

/**
 * POST /api/moveout/complete
 * Body: { notice_id }
 * Owner-only: finalises move-out, vacates bed, revokes tenant access.
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { notice_id } = req.body;
      if (!notice_id) {
        return res.status(400).json({ error: 'Missing notice_id' });
      }
      const result = await completeMoveOut(notice_id, req.user!.property_id);
      res.status(200).json({ message: 'Move-out completed', data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to complete move-out' });
    }
  }
);

export default router;
