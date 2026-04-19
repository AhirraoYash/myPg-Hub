import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { generateInvoice } from '../../controllers/financeController';
import { getInvoices } from '../../controllers/financeQueryController';

const router = Router();

/**
 * POST /api/finance/invoices
 * Body: { tenant_id, billing_month, due_date, idempotency_key, line_items }
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { tenant_id, billing_month, due_date, idempotency_key, line_items } = req.body;
      if (!tenant_id || !billing_month || !due_date || !idempotency_key || !line_items) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const invoice = await generateInvoice(req.body, req.user!.property_id);
      res.status(201).json({ message: 'Invoice generated successfully', data: invoice });
    } catch (error: any) {
      console.error('Generate Invoice Error:', error);
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Invoice with this idempotency key already exists' });
      }
      res.status(400).json({ error: error.message || 'Failed to generate invoice' });
    }
  }
);

/**
 * GET /api/finance/invoices
 * Query: ?status=Unpaid&page=1&limit=20
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const status = (req.query.status as string) || undefined;
      const page   = parseInt((req.query.page  as string) || '1',  10);
      const limit  = parseInt((req.query.limit as string) || '20', 10);

      const result = await getInvoices(req.user!.property_id, req.user!.role, req.user!.user_id, status, page, limit);
      res.status(200).json({ message: 'Invoices fetched successfully', ...result });
    } catch (error: any) {
      console.error('Fetch Invoices Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch invoices' });
    }
  }
);

export default router;
