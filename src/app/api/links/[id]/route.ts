import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialLink } from '@/models/SocialLink';
import { getCurrentUser } from '@/lib/auth';

const updateLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  url: z.string().url('Invalid URL format').optional(),
  icon: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const link = await SocialLink.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: parsed.data },
      { new: true }
    );

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const result = await SocialLink.findOneAndDelete({ _id: id, userId: user._id });

    if (!result) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully',
    });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
