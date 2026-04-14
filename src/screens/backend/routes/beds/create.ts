import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { createBed } from '../../controllers/inventoryController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const createBedSchema = z.object({
  room_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Room ID'),
  bed_identifier: z.string().min(1),
  price: z.number().positive()
});

const createBedHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(createBedSchema, body);
    
    const bed = await createBed(validatedData, user.property_id);

    return NextResponse.json({
      message: 'Bed created successfully',
      data: bed
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Bed Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to create bed' }, { status });
  }
};

export const POST = withAuth(
  withRole(['Owner', 'Manager'], createBedHandler)
);
