import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { updateProfile } from '../../controllers/userController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const updateProfileSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  phone: z.string().min(10).optional()
});

const updateProfileHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(updateProfileSchema, body);
    
    const updatedUser = await updateProfile(user.user_id, validatedData);

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: updatedUser
    }, { status: 200 });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status });
  }
};

export const PATCH = withAuth(updateProfileHandler);
