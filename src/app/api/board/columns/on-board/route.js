import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import IGDB from '@/lib/igdbWrapper';
import mongoose from 'mongoose';
import { getColumnsOnBoard } from '@/lib/utils/column-utils';
/**
 * @desc    Get all columns showing on board from DB by userId
 * @route   GET /api/board/columns/on-board
 * @access  Private
 */
export async function GET() {
  let session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const columns = await getColumnsOnBoard(userId);

    return NextResponse.json(columns, { status: 200 });
  } catch (error) {
    console.error('Error fetching user columns on the board', error);
    return NextResponse.json(
      { message: 'Error fetching user columns on the board' },
      { status: 500 },
    );
  }
}
