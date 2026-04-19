import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middlewares/authMiddleware';
import { authorize } from '../../middlewares/roleMiddleware';
import { getPropertySettings, updatePropertySettings } from '../../controllers/propertyController';

const router = Router();

/**
 * GET /api/properties/settings
 * Returns full property document (settings, name, address, etc.)
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const settings = await getPropertySettings(req.user!.property_id);
      res.status(200).json({ message: 'Property settings fetched', data: settings });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch property settings' });
    }
  }
);

/**
 * PATCH /api/properties/settings
 * Update property name, address, upi_id, and settings sub-object.
 * Owner only.
 */
router.patch(
  '/',
  authenticate,
  authorize(['Owner']),
  async (req: AuthRequest, res: Response) => {
    try {
      const updated = await updatePropertySettings(req.user!.property_id, req.body);
      res.status(200).json({ message: 'Property settings updated', data: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update property settings' });
    }
  }
);

export default router;
