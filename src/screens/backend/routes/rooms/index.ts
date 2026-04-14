import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { getRoomsWithBeds } from '../../controllers/roomController';

const getRoomsHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || undefined;

    const rooms = await getRoomsWithBeds(user.property_id, statusFilter);

    return NextResponse.json({
      message: 'Rooms fetched successfully',
      data: rooms
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Rooms Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch rooms' }, { status: 500 });
  }
};

export const GET = withAuth(getRoomsHandler);
