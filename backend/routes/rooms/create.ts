import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { createRoom } from '../../controllers/inventoryController';
import { validate } from '../../utils/validate';
import { AppError } from '../../utils/AppError';
import { z } from 'zod';

const router = Router();

const createRoomSchema = z.object({
  room_number: z.string().min(1),
  floor:       z.string().min(1),
  room_type:   z.enum(['AC', 'Non-AC']).optional(),
  capacity:    z.number().int().min(1).optional(),
  amenities:   z.array(z.string()).optional()
});

/**
 * POST /api/rooms
 */
router.post(
  '/',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = validate(createRoomSchema, req.body);
      const room = await createRoom(data, req.user!.property_id);
      res.status(201).json({ message: 'Room created successfully', data: room });
    } catch (error: any) {
      console.error('Create Room Error:', error);
      const status = error instanceof AppError ? error.statusCode : 500;
      res.status(status).json({ error: error.message || 'Failed to create room' });
    }
  }
);

export default router;
