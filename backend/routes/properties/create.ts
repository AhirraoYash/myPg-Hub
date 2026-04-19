import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { createProperty } from '../../controllers/propertySetupController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const createPropertySchema = z.object({
  name:     z.string().min(3),
  address:  z.string().min(5).optional(),
  upi_id:   z.string().optional(),
  settings: z.object({
    default_rent_due_date: z.number().int().min(1).max(28).optional(),
    late_fee_amount:       z.number().min(0).optional(),
    notice_period_days:    z.number().int().min(1).optional(),
    deposit_amount:        z.number().min(0).optional()
  }).optional()
});

/**
 * POST /api/properties
 * Creates a new property and makes the caller its Owner.
 */
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const data     = validate(createPropertySchema, req.body);
      const property = await createProperty(data, req.user!.user_id);
      res.status(201).json({ message: 'Property created successfully', data: property });
    } catch (error: any) {
      console.error('Create Property Error:', error);
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to create property' });
    }
  }
);

export default router;
