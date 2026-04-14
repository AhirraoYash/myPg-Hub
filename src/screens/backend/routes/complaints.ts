import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../middlewares/authMiddleware';
import { withRole } from '../middlewares/roleMiddleware';
import { createComplaint, getComplaints, updateComplaintStatus } from '../controllers/complaintController';

// POST / -> Create a new complaint (Tenants Only)
const postHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    
    if (!body.title || !body.description || !body.category || !body.urgency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const complaint = await createComplaint(body, user.user_id, user.property_id);
    
    return NextResponse.json({
      message: 'Complaint created successfully',
      data: complaint
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Complaint Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create complaint' }, { status: 400 });
  }
};

export const POST = withAuth(
  withRole(['Tenant'], postHandler)
);

// GET / -> Fetch complaints (All Roles)
const getHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const complaints = await getComplaints(user.property_id, user.role, user.user_id);
    
    return NextResponse.json({
      message: 'Complaints fetched successfully',
      data: complaints
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Complaints Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch complaints' }, { status: 400 });
  }
};

export const GET = withAuth(getHandler);

// PATCH / -> Update complaint status (Owners & Managers Only)
const patchHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    
    // We extract the complaint_id from the JSON body (or context.params.id if mapped dynamically in Next.js)
    const complaint_id = context?.params?.id || body.complaint_id;
    
    if (!complaint_id) {
      return NextResponse.json({ error: 'Missing complaint_id' }, { status: 400 });
    }
    if (!body.status) {
      return NextResponse.json({ error: 'Missing status update' }, { status: 400 });
    }

    const updatedComplaint = await updateComplaintStatus(
      complaint_id,
      body.status,
      body.resolution_cost || 0,
      user.user_id,
      user.property_id
    );

    return NextResponse.json({
      message: 'Complaint updated successfully',
      data: updatedComplaint
    }, { status: 200 });
  } catch (error: any) {
    console.error('Update Complaint Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update complaint' }, { status: 400 });
  }
};

export const PATCH = withAuth(
  withRole(['Owner', 'Manager'], patchHandler)
);
