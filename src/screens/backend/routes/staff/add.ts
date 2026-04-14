import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { withRole } from '../../middlewares/roleMiddleware';
import { addManager } from '../../controllers/staffController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const addManagerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  password: z.string().min(6).optional()
});

const addManagerHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(addManagerSchema, body);
    
    const newManager = await addManager(validatedData, user.property_id);

    return NextResponse.json({
      message: 'Manager added successfully',
      data: {
        user_id: newManager._id,
        email: newManager.email,
        first_name: newManager.first_name,
        last_name: newManager.last_name
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Add Manager Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to add manager' }, { status });
  }
};

export const POST = withAuth(
  withRole(['Owner'], addManagerHandler)
);
