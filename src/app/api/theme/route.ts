import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { ThemeSettings } from '@/models/ThemeSettings';
import { User } from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

const updateThemeSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  showMoon: z.boolean().optional(),
  showStars: z.boolean().optional(),
  showEnergyWaves: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
});

export async function GET() {
  try {
    const defaultTheme = {
      primaryColor: '#00F5FF',
      accentColor: '#7A5CFF',
      showMoon: true,
      showStars: true,
      showEnergyWaves: true,
      musicEnabled: false,
    };

    try {
      await connectDB();
      const defaultUser = await User.findOne();
      if (!defaultUser) {
        return NextResponse.json({
          success: true,
          theme: defaultTheme,
        });
      }

      let theme = await ThemeSettings.findOne({ userId: defaultUser._id });
      if (!theme) {
        theme = await ThemeSettings.create({
          userId: defaultUser._id,
        });
      }

      return NextResponse.json({
        success: true,
        theme,
      });
    } catch (dbError) {
      console.warn('MongoDB connection failed. Serving default theme fallback:', dbError);
      return NextResponse.json({
        success: true,
        theme: defaultTheme,
      });
    }
  } catch (error) {
    console.error('Fetch theme error:', error);
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
    const parsed = updateThemeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const theme = await ThemeSettings.findOneAndUpdate(
      { userId: user._id },
      { $set: parsed.data },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      theme,
    });
  } catch (error) {
    console.error('Update theme error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
