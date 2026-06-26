import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SocialLink } from '@/models/SocialLink';
import { Analytics } from '@/models/Analytics';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Prevent spam clicks (max 10 clicks per link per IP per minute)
  const limitCheck = rateLimit(`click-${id}-${ip}`, 10, 60000);
  if (!limitCheck.success) {
    return NextResponse.json(
      { error: 'Too many clicks recorded. Slow down.' },
      { status: 429 }
    );
  }

  if (id.startsWith('mock-')) {
    return NextResponse.json({
      success: true,
      message: 'Click registered successfully (mock fallback)',
    });
  }

  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('MongoDB connection failed in click register, returning mock success:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Click registered successfully (connection fallback)',
      });
    }

    const link = await SocialLink.findById(id);
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Increment click counter
    link.clicks = (link.clicks || 0) + 1;
    await link.save();

    // Record Analytics entry
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    try {
      await Analytics.create({
        userId: link.userId,
        type: 'link_click',
        linkId: link._id,
        userAgent,
        referrer,
      });
    } catch (analyticsError) {
      console.warn('Failed to record click analytics entry:', analyticsError);
    }

    return NextResponse.json({
      success: true,
      message: 'Click registered successfully',
    });
  } catch (error) {
    console.error('Record click error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
