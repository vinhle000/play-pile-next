import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

/**
 * @desc    Get all columns from DB by userId
 * @route   GET /api/board/columns/
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function GET(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    await connectDB();
    const columns = await Column.find({
      userId: userId,
      isOnBoard: true,
    }).sort('position');

    return NextResponse.json(columns, { status: 200 });
  } catch (error) {
    console.error('Error fetching user columns from DB ', error);
    return NextResponse.json('Error fetching game from DB', {
      status: 500,
    });
  }
}
