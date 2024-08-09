import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import {
  getColumnsOnBoard,
  createColumn,
  updateColumn,
  deleteAllColumns,
} from '@/lib/utils/column-utils.js';

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
    const columns = await getColumnsOnBoard(userId);
    return NextResponse.json(columns, { status: 200 });
  } catch (error) {
    console.error('Error fetching user columns from DB ', error);
    return NextResponse.json('Error fetching game from DB', {
      status: 500,
    });
  }
}

/**
 * @desc    Create a column for user
 * @route   POST /api/board/columns/
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  let body;

  try {
    body = await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { message: 'Error parsing JSON' },
      { status: 400 },
    );
  }
  const { columnTitle } = body;
  try {
    const column = await createColumn(userId, columnTitle);

    return NextResponse.json(column, { status: 200 });
  } catch (error) {
    console.error('Error fetching user columns from DB ', error);
    return NextResponse.json('Error fetching game from DB', {
      status: 500,
    });
  }
}

/**
 * @desc    Update column
 * @route   PATCH /api/board/columns/
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function PATCH(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  try {
    body = await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { message: 'Error parsing JSON' },
      { status: 400 },
    );
  }

  const { columnId, ...updateData } = body;

  if (!columnId) res.status(400).json({ message: 'No columnId provided' });
  if (!updateData) res.status(400).json({ message: 'No update data provided' });

  try {
    await connectDB();
    let updatedColumn = await updateColumn(columnId, updateData);

    return NextResponse.json(updatedColumn, { status: 201 });
  } catch (error) {
    console.error('Error updating column: ${columnId}`, error');
    return NextResponse.json('Error updating column', {
      status: 500,
    });
  }
}

/**
 * @desc    Delete ALL columns
 * @route   Delete /api/board/columns
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function DELETE(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const toDeleteAll = await request.json().then((body) => body.toDeleteAll);
    if (toDeleteAll === true) {
      console.log('Deleting all columns of user!');

      let result = await deleteAllColumns(userId);
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      '"toDeleteAll" set to true must be provided in request body',
      { status: 400 },
    );
  } catch (error) {
    console.error(`Error deleting all columns for user: ${userId}`);
    return NextResponse.json('Error deleting all column', {
      status: 500,
    });
  }
}
