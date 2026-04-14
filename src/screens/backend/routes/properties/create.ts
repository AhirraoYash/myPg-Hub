import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { createProperty } from '../../controllers/propertySetupController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const createPropertySchema = z.object({
  name: z.string().min(3),
  address: z.string().min(10),
  upi_id: z.string().optional(),
  settings: z.record(z.any()).optional()
});

const createPropertyHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(createPropertySchema, body);
    
    // Note: This endpoint allows an authenticated user to create a new property and become its Owner.
    const property = await createProperty(validatedData, user.user_id);

    return NextResponse.json({
      message: 'Property created successfully',
      data: property
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Property Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to create property' }, { status });
  }
};

export const POST = withAuth(createPropertyHandler);
