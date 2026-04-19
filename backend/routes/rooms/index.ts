import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { getRoomsWithBeds } from '../../controllers/roomController';

const router = Router();

/**
 * GET /api/rooms
 * Query: ?status=Vacant
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const statusFilter = (req.query.status as string) || undefined;
      const rooms = await getRoomsWithBeds(req.user!.property_id, statusFilter);
      res.status(200).json({ message: 'Rooms fetched successfully', data: rooms });
    } catch (error: any) {
      console.error('Fetch Rooms Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch rooms' });
    }
  }
);

export default router;
