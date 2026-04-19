import { Router, Request, Response } from 'express';
import { loginUser } from '../../controllers/authController';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { phone, pin }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt with body:', req.body);
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ error: 'Phone number and PIN are required' });
    }

    const result = await loginUser(phone, String(pin));
    return res.status(200).json({ message: 'Login successful', data: result });
  } catch (error: any) {
    console.error('Login Error:', error);

    if (error.message === 'Invalid phone number or PIN') {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes('not assigned to any active property')) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;
