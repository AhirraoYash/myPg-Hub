import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { changePassword } from '../../controllers/userController';
import { validate } from '../../utils/validate';
import { z } from 'zod';
import { AppError } from '../../utils/AppError';

const changePasswordSchema = z.object({
  old_password: z.string().min(6),
  new_password: z.string().min(6)
});

const changePasswordHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const body = await req.json();
    const validatedData = validate(changePasswordSchema, body);
    
    await changePassword(user.user_id, validatedData);

    return NextResponse.json({
      message: 'Password changed successfully'
    }, { status: 200 });
  } catch (error: any) {
    console.error('Change Password Error:', error);
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status });
  }
};

export const POST = withAuth(changePasswordHandler);
