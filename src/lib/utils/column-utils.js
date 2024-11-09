import mongoose from 'mongoose';
import UserGame from '@/lib/models/userGameModel';
import Column from '@/lib/models/columnModel';
import { connectDB } from '@/lib/db';

/*
"Only plain objects can be passed to Client Components from Server Components"
 occurs when you try to pass complex objects like Mongoose
 documents directly to client components. ""
*/

function convertToPlainObject(doc) {
  return JSON.parse(JSON.stringify(doc));
}
// * @route   GET /api/board/columns/
export async function getColumns(userId) {
  try {
    await connectDB();
    const columns = await Column.find({ userId: userId }).lean();
    return columns.map(convertToPlainObject);
  } catch (error) {
    console.error('Error getting columns from DB ', error);
    throw new Error('Error getting columns from DB');
  }
}

/**
 * @desc    Get all columns showing on board from DB by userId
 * @route   GET /api/board/columns/on-board
 */
export async function getColumnsOnBoard(userId) {
  try {
    await connectDB();
    const columns = await Column.find({
      userId: userId,
      isOnBoard: true,
    })
      .lean() // Convert documents to plain JS objects -> but still constaines methods such as ObjectId and Date
      .sort('position');
    // Convert due to warning, Server components should only pass down JS objects down to client components
    return columns.map(convertToPlainObject);
  } catch (error) {
    console.error('Error fetching user columns on board  from DB ', error);
    throw new Error('Failed to fetch columns on board from DB');
  }
}

// @desc    Create a column for user
//@route   POST /api/board/columns/
export async function createColumn(userId, columnTitle) {
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
    return convertToPlainObject(column);
  } catch (error) {
    console.error('Error when create column in DB ', error);
    throw new Error('Failed to create column in DB');
  }
}

/**
 * @desc    Update column
 * @route   PATCH /api/board/columns/
 */
export async function updateColumn(columnId, updateData) {
  try {
    await connectDB();
    const column = await Column.findOneAndUpdate(
      { _id: columnId },
      { $set: updateData },
      { new: true }, // return updated document
    ).lean();

    if (!column) {
      console.warn(`No column: ${columnId} found for update`);
      throw new Error(`No column found in DB with id: ${columnId}`);
    }
    return convertToPlainObject(column);
  } catch (error) {
    console.error('Error updating column ', error);
    throw new Error('Failed to update column');
  }
}

//* @desc    Delete a column
//* @route   Delete /api/board/columns/:columnId
export async function deleteColumn(columnId) {
  try {
    await connectDB();
    const result = await Column.deleteOne({ _id: columnId });
    if (result.deletedCount === 0) {
      console.warn(`No column found with id: ${columnId} to delete`);
    }
    return result;
  } catch (error) {
    console.error('Error deleting column ', error);
    throw new Error('Failed to delete column');
  }
}

//* @desc    Delete ALL columns
//* @route   Delete /api/board/columns
export async function deleteAllColumns(userId) {
  try {
    await connectDB();
    const result = await Column.deleteMany({ userId: userId });
    return result;
  } catch (error) {
    console.error('Error deleting all columns in DB', error);
    throw new Error('Failed to delete all columns');
  }
}

/*
 * @desc    Update columns positions (after dragging and drop)
 * @route   PATCH /api/board/columns/update-positions
 * @access  Private
 */
export async function updateColumnPositions(updatedColumns) {
  try {
    connectDB();
    await Promise.all(
      updatedColumns.map((column, index) => {
        return Column.findByIdAndUpdate(column._id, {
          position: index, // The updated columns are in the correct order already
        });
      }),
    );
  } catch (error) {
    console.error('Error updating column positions in DB', error);
    throw new Error('Error updating column positions in DB');
  }
}
