import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

/**
 * @desc    Delete column by columnId
 * @route   Delete /api/board/columns/:columnId
 * @access  Private
 *
 * @param {Object} context - The context object containing URL parameters
 * @param {Object} context.params - The URL parameters
 * @param {string} context.params.columnId - The IGDB ID of the game to Delete
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function DELETE(request, context) {
  const columnId = context.params.columnId;

  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  // const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    await connectDB();

    if (columnId) {
      let result = await Column.deleteOne({ _id: columnId });
      if (result.deletedCount === 0) {
        console.log(`Column: ${columnId} not found`);
      }
      return NextResponse.json(result, { status: 200 });
    } else {
      NextResponse.json({ message: 'No columnId provided' }, 400);
    }
  } catch (error) {
    console.error(`Error deleting all columns for user: ${userId}`);
    return NextResponse.json('Error deleting all column', {
      status: 500,
    });
  }
}
