import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '../../controllers/authController';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    // Optional: You can also set the token as an HTTP-only cookie here
    // for enhanced security, depending on your frontend setup.
    const response = NextResponse.json({
      message: 'Login successful',
      data: result
    }, { status: 200 });

    // Example of setting HTTP-only cookie:
    // response.cookies.set('token', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 });

    return response;

  } catch (error: any) {
    console.error('Login Error:', error);
    
    // Use 401 Unauthorized for invalid credentials
    if (error.message === 'Invalid email or password') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Use 403 Forbidden for users without active property roles
    if (error.message.includes('not assigned to any active property')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
};
