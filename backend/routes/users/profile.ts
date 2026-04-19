import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { updateProfile } from '../../controllers/userController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name:  z.string().min(2).optional(),
  email:      z.string().email().optional()
});

/**
 * PATCH /api/users/profile
 */
router.patch(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const data    = validate(updateProfileSchema, req.body);
      const updated = await updateProfile(req.user!.user_id, data);
      res.status(200).json({ message: 'Profile updated', data: updated });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to update profile' });
    }
  }
);

export default router;
