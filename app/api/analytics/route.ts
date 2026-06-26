import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Analytics } from '@/models/Analytics';
import { SocialLink } from '@/models/SocialLink';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // 1. Core counters
    const pageViewsCount = await Analytics.countDocuments({ userId: user._id, type: 'page_view' });
    const linkClicksCount = await Analytics.countDocuments({ userId: user._id, type: 'link_click' });

    // 2. Click count per link
    const links = await SocialLink.find({ userId: user._id });

    // 3. Daily views for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          type: 'page_view',
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4. Monthly views for last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyViews = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          type: 'page_view',
          timestamp: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Clicks by platform (sum click counts on SocialLink)
    const platformClicks = await SocialLink.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$platform',
          clicks: { $sum: '$clicks' },
        },
      },
      { $sort: { clicks: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        pageViews: pageViewsCount,
        linkClicks: linkClicksCount,
        links: links.map(l => ({ id: l._id, title: l.title, platform: l.platform, clicks: l.clicks })),
        dailyViews,
        monthlyViews,
        platformClicks,
      },
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Limit page view logs to max 1 per 15s per IP to avoid spamming database
  const limitCheck = rateLimit(`pageview-${ip}`, 2, 30000);
  if (!limitCheck.success) {
    return NextResponse.json(
      { success: false, message: 'Rate limit active' },
      { status: 429 }
    );
  }

  try {
    try {
      await connectDB();
      const defaultUser = await User.findOne();
      if (defaultUser) {
        const userAgent = request.headers.get('user-agent') || '';
        const referrer = request.headers.get('referer') || '';

        await Analytics.create({
          userId: defaultUser._id,
          type: 'page_view',
          userAgent,
          referrer,
        });
      }
    } catch (dbError) {
      console.warn('MongoDB connection failed. Skipping page view logging:', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Page view processed',
    });
  } catch (error) {
    console.error('Log page view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
