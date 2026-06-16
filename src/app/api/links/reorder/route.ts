import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialLink } from '@/models/SocialLink';
import { getCurrentUser } from '@/lib/auth';

const reorderSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

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
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const bulkOps = parsed.data.links.map((item) => ({
      updateOne: {
        filter: { _id: item.id, userId: user._id },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await SocialLink.bulkWrite(bulkOps);
    }

    return NextResponse.json({
      success: true,
      message: 'Links reordered successfully',
    });
  } catch (error) {
    console.error('Reorder links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
