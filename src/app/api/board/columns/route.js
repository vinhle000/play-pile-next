import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
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
    const columns = await Column.find({ userId: userId });
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
  const columnTitle = await request.json().then((body) => body.columnTitle);

  try {
    await connectDB();
    let currentColumnCount = await Column.countDocuments({
      userId: userId,
      isOnBoard: true,
    });

    let column = await Column.create({
      userId: userId,
      title: columnTitle || '',
      isOnBoard: true,
      position: currentColumnCount + 1,
    });

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

  const { columnId, ...updateData } = await request.json().then((body) => body);

  if (!columnId) res.status(400).json({ message: 'No columnId provided' });
  if (!updateData) res.status(400).json({ message: 'No update data provided' });

  try {
    await connectDB();
    let updatedColumn = await updateColumnDocument(columnId, updateData);

    return NextResponse.json(updatedColumn, { status: 201 });
  } catch (error) {
    console.error('Error updating column: ${columnId}`, error');
    return NextResponse.json('Error updating column', {
      status: 500,
    });
  }
}

/**
 * @desc    Delete ALL column
 * @route   Delete /api/board/columns/:columnId
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
    await connectDB();
    const toDeleteAll = await request.json().then((body) => body.toDeleteAll);
    if (toDeleteAll === true) {
      console.log('Deleting all columns of user!');

      let result = await Column.deleteMany({ userId: userId });
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

// ====================================================
// CRUD OPERATIONS - directly to MongoDB
// ====================================================

async function updateColumnDocument(columnId, updateData) {
  try {
    let column = await Column.findOneAndUpdate(
      { _id: columnId },
      { $set: updateData },
      { new: true }, // return updated document
    );

    if (!column) {
      logger.warn(`No column: ${columnId} found for update`);
    }
    return column;
  } catch (error) {
    throw new Error('Error updating userGame document');
  }
}
