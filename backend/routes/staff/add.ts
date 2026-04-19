import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { addManager, removeManager, getManagers } from '../../controllers/staffController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const addManagerSchema = z.object({
  phone:      z.string().min(10),
  first_name: z.string().min(2),
  last_name:  z.string().min(2),
  email:      z.string().email().optional(),
  pin:        z.string().min(4).max(6).optional()
});

/**
 * GET /api/staff — List all managers
 */
router.get(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const managers = await getManagers(req.user!.property_id);
      res.status(200).json({ message: 'Staff fetched successfully', data: managers });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch staff' });
    }
  }
);

/**
 * POST /api/staff — Add a Manager
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const data       = validate(addManagerSchema, req.body);
      const newManager = await addManager(data, req.user!.property_id);
      res.status(201).json({
        message: 'Manager added successfully',
        data: {
          user_id:    newManager._id,
          phone:      newManager.phone,
          first_name: newManager.first_name,
          last_name:  newManager.last_name
        }
      });
    } catch (error: any) {
      console.error('Add Manager Error:', error);
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to add manager' });
    }
  }
);

/**
 * DELETE /api/staff/:id — Deactivate a Manager
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await removeManager(req.params.id, req.user!.property_id);
      res.status(200).json({ message: 'Manager removed successfully', data: result });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to remove manager' });
    }
  }
);

export default router;
