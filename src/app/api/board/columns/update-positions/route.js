import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

/**
 * @desc    Update columns positions (after dragging and drop)
 * @route   PATCH /api/board/columns/update-positions
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function PATCH(request) {
  // Protect path
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
    const updatedColumns = await request.json().then((body) => body.columns);

    if (!updatedColumns)
      return NextResponse.json(
        { message: 'No columns were provided' },
        { status: 400 },
      );

    await Promise.all(
      updatedColumns.map((column, index) => {
        //Fixme; shoud use index OR poition field?
        return Column.findByIdAndUpdate(column._id, { position: index });
      }),
    );

    return NextResponse.json(
      { message: 'Updated column positions successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error updating column positions`, error);
    return NextResponse.json(
      { message: 'Error updating column positions' },
      { status: 500 },
    );
  }
}

// TODO: Same helper function is in api/board/column/route.js code to lib?
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
