import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { createRoom } from '../../controllers/inventoryController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const createRoomSchema = z.object({
  room_number: z.string().min(1),
  floor: z.number().int(),
  capacity: z.number().int().min(1),
  amenities: z.array(z.string()).optional()
});

const createRoomHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(createRoomSchema, body);
    
    const room = await createRoom(validatedData, user.property_id);

    return NextResponse.json({
      message: 'Room created successfully',
      data: room
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Room Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to create room' }, { status });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager'], createRoomHandler)
);
