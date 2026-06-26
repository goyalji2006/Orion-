import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

export async function GET() {
  try {
    let profile = {
      name: 'ORIAN',
      bio: 'Exploring Technology, Creativity & Space.',
      profileImage: '',
      email: 'admin@orian.space',
    };

    try {
      await connectDB();
      const user = await User.findOne().select('name bio profileImage email');
      if (user) {
        profile = {
          name: user.name,
          bio: user.bio,
          profileImage: user.profileImage,
          email: user.email,
        };
      }
    } catch (dbError) {
      console.warn('MongoDB connection failed. Using default mock profile fallback:', dbError);
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: parsed.data },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      profile: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
