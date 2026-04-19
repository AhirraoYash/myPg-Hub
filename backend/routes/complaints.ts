import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaintController';

const router = Router();

/**
 * POST /api/complaints — Tenant creates a complaint
 */
router.post(
  '/',
  authenticate,
  authorize(['Tenant']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, urgency } = req.body;
      if (!title || !description || !category || !urgency) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const complaint = await createComplaint(req.body, req.user!.user_id, req.user!.property_id);
      res.status(201).json({ message: 'Complaint created', data: complaint });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create complaint' });
    }
  }
);

/**
 * GET /api/complaints — All roles (tenants see only their own)
 */
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const complaints = await getComplaints(req.user!.property_id, req.user!.role, req.user!.user_id);
      res.status(200).json({ message: 'Complaints fetched', data: complaints });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch complaints' });
    }
  }
);

/**
 * PATCH /api/complaints/:id — Owner/Manager updates complaint status
 */
router.patch(
  '/:id',
  authenticate,
  authorize(['Owner', 'Manager']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, resolution_cost } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Missing status' });
      }
      const updated = await updateComplaintStatus(
        req.params.id,
        status,
        resolution_cost || 0,
        req.user!.user_id,
        req.user!.property_id
      );
      res.status(200).json({ message: 'Complaint updated', data: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update complaint' });
    }
  }
);

export default router;
