import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { generateSettlement } from '../../controllers/moveOutController';

const router = Router();

/**
 * POST /api/moveout/settle
 * Body: { notice_id, deductions: [{reason, amount}] }
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { notice_id, deductions = [] } = req.body;

      if (!notice_id) {
        return res.status(400).json({ error: 'Missing notice_id' });
      }

      const settlement = await generateSettlement(notice_id, req.user!.property_id, deductions);
      res.status(200).json({ message: 'Settlement generated', data: settlement });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to generate settlement' });
    }
  }
);

export default router;
