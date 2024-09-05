import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import mongoose from 'mongoose';
import { updateColumnPositions } from '@/lib/utils/column-utils';
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

  try {
    await connectDB();
    const updatedColumns = await request.json().then((body) => body.columns);

    if (!updatedColumns)
      return NextResponse.json(
        { message: 'No columns were provided' },
        { status: 400 },
      );

    // await Promise.all(
    //   updatedColumns.map((column) => {
    //     //Fixme; should use index OR poition field?
    //     return Column.findByIdAndUpdate(column._id, {
    //       position: column.position,
    //     });
    //   }),
    // );
    await updateColumnPositions(updatedColumns);

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
