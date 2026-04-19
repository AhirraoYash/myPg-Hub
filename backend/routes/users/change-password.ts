import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { changePIN } from '../../controllers/userController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const changePINSchema = z.object({
  old_pin: z.string().min(4).max(6),
  new_pin: z.string().min(4).max(6)
});

/**
 * POST /api/users/change-pin
 */
router.post(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = validate(changePINSchema, req.body);
      await changePIN(req.user!.user_id, data);
      res.status(200).json({ message: 'PIN changed successfully' });
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to change PIN' });
    }
  }
);

export default router;
