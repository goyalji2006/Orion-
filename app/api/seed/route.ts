import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { SocialLink } from '@/models/SocialLink';
import { ThemeSettings } from '@/models/ThemeSettings';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    await connectDB();

    // Check if user already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'System has already been seeded' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@orian.space';
    const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'changeme123';
    const adminPasswordHashed = hashPassword(adminPasswordRaw);

    // 1. Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPasswordHashed,
      name: 'ORIAN',
      bio: 'Exploring Technology, Creativity & Space.',
      profileImage: '',
    });

    // 2. Create default theme settings
    const theme = await ThemeSettings.create({
      userId: admin._id,
      primaryColor: '#00F5FF',
      accentColor: '#7A5CFF',
      showMoon: true,
      showStars: true,
      showEnergyWaves: true,
      musicEnabled: false,
    });

    // 3. Create default social links
    const defaultLinks = [
      {
        userId: admin._id,
        platform: 'Instagram',
        title: 'Instagram Broadcast',
        url: 'https://www.instagram.com/kartikeygoyal_24?igsh=YW4xbDV5MXVodXo2',
        icon: 'instagram',
        order: 0,
      },
      {
        userId: admin._id,
        platform: 'Snapchat',
        title: 'Snapchat Profile',
        url: 'https://www.snapchat.com/add/kartikeygoyal24?share_id=Za0VziaVSVA&locale=en-IN',
        icon: 'snapchat',
        order: 1,
      },
      {
        userId: admin._id,
        platform: 'Spotify',
        title: 'Spotify Playlists',
        url: 'https://open.spotify.com/user/wios1zi3qxcyhtn80z2pzc2gl?si=NjuGa1W1RHWIU69vreU2cA',
        icon: 'spotify',
        order: 2,
      },
      {
        userId: admin._id,
        platform: 'Telegram',
        title: 'Telegram Channel',
        url: 'https://t.me/KartikeyGoyal2006',
        icon: 'telegram',
        order: 3,
      },
      {
        userId: admin._id,
        platform: 'Letterboxd',
        title: 'Letterboxd Film Diary',
        url: 'https://boxd.it/aI0Fn',
        icon: 'letterboxd',
        order: 4,
      },
      {
        userId: admin._id,
        platform: 'Threads',
        title: 'Threads Updates',
        url: 'https://www.threads.net/@kartikeygoyal_24',
        icon: 'threads',
        order: 5,
      },
      {
        userId: admin._id,
        platform: 'Moctale',
        title: 'Moctale Cinema Reviews',
        url: 'https://www.moctale.in/u/Kartikey24',
        icon: 'moctale',
        order: 6,
      },
    ];

    await SocialLink.insertMany(defaultLinks);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        email: adminEmail,
        password: adminPasswordRaw,
      },
      theme,
      linksCount: defaultLinks.length,
    });
  } catch (error) {
    console.error('Seed database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
