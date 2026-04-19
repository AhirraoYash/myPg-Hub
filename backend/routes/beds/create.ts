import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { createBed } from '../../controllers/inventoryController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const createBedSchema = z.object({
  room_id:        z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Room ID'),
  bed_identifier: z.string().min(1),
  price:          z.number().positive()
});

/**
 * POST /api/beds
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = validate(createBedSchema, req.body);
      const bed  = await createBed(data, req.user!.property_id);
      res.status(201).json({ message: 'Bed created successfully', data: bed });
    } catch (error: any) {
      console.error('Create Bed Error:', error);
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to create bed' });
    }
  }
);

export default router;
