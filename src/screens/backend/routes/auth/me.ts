import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { getCurrentUser } from '../../controllers/authController';

const getMeHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    // user_id is injected by the withAuth middleware from the decoded JWT
    const { user_id } = user;

    const userProfile = await getCurrentUser(user_id);

    return NextResponse.json({
      message: 'Profile fetched successfully',
      data: userProfile
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fetch Current User Error:', error);
    
    if (error.message === 'User not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
};

// Wrap the handler with our authentication middleware
export const GET = withAuth(getMeHandler);
