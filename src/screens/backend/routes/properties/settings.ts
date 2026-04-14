import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../../middlewares/authMiddleware';
import { getPropertySettings } from '../../controllers/propertyController';

const getSettingsHandler = async (req: NextRequest, context: any, user: any) => {
  try {
    const settings = await getPropertySettings(user.property_id);

    return NextResponse.json({
      message: 'Property settings fetched successfully',
      data: settings
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Property Settings Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch property settings' }, { status: 500 });
  }
};

export const GET = withAuth(getSettingsHandler);
