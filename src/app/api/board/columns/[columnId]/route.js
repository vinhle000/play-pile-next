import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { deleteColumn } from '@/lib/utils/column-utils';
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

  try {
    if (columnId) {
      const result = await deleteColumn(columnId);
      if (result.deletedCount === 0) {
        console.log(`Column: ${columnId} not found`);
      }
      return NextResponse.json(result, { status: 200 });
    } else {
      NextResponse.json({ message: 'No columnId provided' }, 400);
    }
  } catch (error) {
    console.error(`Error deleting column `, columnId);
    return NextResponse.json('Error deleting column ', {
      status: 500,
    });
  }
}
