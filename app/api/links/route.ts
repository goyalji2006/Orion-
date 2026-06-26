import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialLink } from '@/models/SocialLink';
import { getCurrentUser } from '@/lib/auth';

const createLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Invalid URL format'),
  icon: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    let links: any[] = [];
    let dbConnected = false;

    try {
      await connectDB();
      dbConnected = true;
    } catch (dbError) {
      console.warn('MongoDB connection failed. Serving default mock links fallback:', dbError);
    }

    if (dbConnected) {
      // Check if user is logged in
      const user = await getCurrentUser();
      
      let query: { isActive?: boolean; userId?: string } = { isActive: true };
      if (user) {
        // If admin, return all links for this user
        query = { userId: user._id.toString() };
      }

      links = await SocialLink.find(query).sort({ order: 1 });
    } else {
      // Database not connected, serve fallback mock links
      links = [
        {
          _id: 'mock-instagram',
          platform: 'Instagram',
          title: 'Instagram Broadcast',
          url: 'https://www.instagram.com/kartikeygoyal_24?igsh=YW4xbDV5MXVodXo2',
          icon: 'FaInstagram',
          order: 0,
          isActive: true,
          clicks: 142,
        },
        {
          _id: 'mock-snapchat',
          platform: 'Snapchat',
          title: 'Snapchat Profile',
          url: 'https://www.snapchat.com/add/kartikeygoyal24?share_id=Za0VziaVSVA&locale=en-IN',
          icon: 'FaSnapchat',
          order: 1,
          isActive: true,
          clicks: 98,
        },
        {
          _id: 'mock-spotify',
          platform: 'Spotify',
          title: 'Spotify Playlists',
          url: 'https://open.spotify.com/user/wios1zi3qxcyhtn80z2pzc2gl?si=NjuGa1W1RHWIU69vreU2cA',
          icon: 'FaSpotify',
          order: 2,
          isActive: true,
          clicks: 254,
        },
        {
          _id: 'mock-telegram',
          platform: 'Telegram',
          title: 'Telegram Channel',
          url: 'https://t.me/KartikeyGoyal2006',
          icon: 'FaTelegram',
          order: 3,
          isActive: true,
          clicks: 187,
        },
        {
          _id: 'mock-letterboxd',
          platform: 'Letterboxd',
          title: 'Letterboxd Film Diary',
          url: 'https://boxd.it/aI0Fn',
          icon: 'SiLetterboxd',
          order: 4,
          isActive: true,
          clicks: 134,
        },
        {
          _id: 'mock-threads',
          platform: 'Threads',
          title: 'Threads Updates',
          url: 'https://www.threads.net/@kartikeygoyal_24',
          icon: 'FaThreads',
          order: 5,
          isActive: true,
          clicks: 65,
        },
        {
          _id: 'mock-moctale',
          platform: 'Moctale',
          title: 'Moctale Cinema Reviews',
          url: 'https://www.moctale.in/u/Kartikey24',
          icon: 'FaFilm',
          order: 6,
          isActive: true,
          clicks: 112,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      links: links || [],
    });
  } catch (error) {
    console.error('Fetch links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the next order value if not provided
    let orderVal = parsed.data.order;
    if (orderVal === undefined) {
      const highestOrder = await SocialLink.findOne({ userId: user._id })
        .sort({ order: -1 })
        .select('order');
      orderVal = highestOrder ? highestOrder.order + 1 : 0;
    }

    const newLink = await SocialLink.create({
      ...parsed.data,
      userId: user._id,
      order: orderVal,
    });

    return NextResponse.json({
      success: true,
      link: newLink,
    });
  } catch (error) {
    console.error('Create link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
