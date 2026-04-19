import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { verifyCashPayment } from '../../controllers/financeController';

const router = Router();

/**
 * POST /api/finance/verify-payment
 * Body: { payment_id }
 * Owner-only: confirms a cash payment collected by a manager
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { payment_id } = req.body;
      if (!payment_id) {
        return res.status(400).json({ error: 'Missing payment_id' });
      }
      const result = await verifyCashPayment(payment_id, req.user!.property_id);
      res.status(200).json({ message: 'Payment verified successfully', data: result });
    } catch (error: any) {
      console.error('Verify Payment Error:', error);
      res.status(400).json({ error: error.message || 'Failed to verify payment' });
    }
  }
);

export default router;
