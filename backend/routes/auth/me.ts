import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { getCurrentUser } from '../../controllers/authController';

const router = Router();

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile.
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getCurrentUser(req.user!.user_id);
    res.status(200).json({ message: 'Profile fetched successfully', data: profile });
  } catch (error: any) {
    console.error('Fetch Current User Error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;
