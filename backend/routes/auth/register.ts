import { Router, Request, Response } from 'express';
import { registerOwnerAndProperty } from '../../controllers/authController';

const router = Router();

/**
 * POST /api/auth/register
 * Body: { phone, pin, first_name, last_name, pg_name, address? }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { phone, pin, first_name, last_name, pg_name, address } = req.body;

    if (!phone || !pin || !first_name || !last_name || !pg_name) {
      return res.status(400).json({ error: 'Missing required fields: phone, pin, first_name, last_name, pg_name' });
    }

    const result = await registerOwnerAndProperty({
      phone,
      pin: String(pin),
      first_name,
      last_name,
      pg_name,
      address
    });
    
    return res.status(201).json({ message: 'PG Registered successfully', data: result });
  } catch (error: any) {
    console.error('Registration Error:', error);

    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

export default router;
