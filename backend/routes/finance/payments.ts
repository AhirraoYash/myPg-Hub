import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { recordPayment } from '../../controllers/financeController';
import { getPayments } from '../../controllers/financeQueryController';

const router = Router();

/**
 * POST /api/finance/payments
 * Body: { invoice_id, tenant_id, amount, payment_method, transaction_id?, notes? }
 */
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { invoice_id, tenant_id, amount, payment_method } = req.body;
      if (!invoice_id || !tenant_id || !amount || !payment_method) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const payment = await recordPayment(req.body, req.user!.user_id, req.user!.property_id);
      res.status(201).json({ message: 'Payment recorded successfully', data: payment });
    } catch (error: any) {
      console.error('Record Payment Error:', error);
      res.status(400).json({ error: error.message || 'Failed to record payment' });
    }
  }
);

/**
 * GET /api/finance/payments
 * Query: ?tenant_id=...&page=1&limit=20
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const tenant_id = (req.query.tenant_id as string) || undefined;
      const page      = parseInt((req.query.page  as string) || '1',  10);
      const limit     = parseInt((req.query.limit as string) || '20', 10);

      const result = await getPayments(req.user!.property_id, req.user!.role, req.user!.user_id, tenant_id, page, limit);
      res.status(200).json({ message: 'Payments fetched successfully', ...result });
    } catch (error: any) {
      console.error('Fetch Payments Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch payments' });
    }
  }
);

export default router;
