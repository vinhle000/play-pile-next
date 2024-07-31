import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import UserGame from '@/lib/models/userGameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import {
  getUserGameDocument,
  createUserGameDocument,
  updateUserGameDocument,
  deleteUserGameData,
} from '@/services/userGameService';

/**
 * @desc  Update userGame card position in assigned column
 * @route PATCH /api/user-games/board/positions
 * @access Private
 */
export async function PATCH(request, context) {
  await connectDB();
  let session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  let userId = new mongoose.Type.ObjectId(session.user.id);
  let igdbId = context.params.igdbId;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
  const { source, destination } = body;

  if (!source || !destination) {
    return NextResponse.json(
      { message: 'No column source and destination data provided' },
      { status: 400 },
    );
  }

  try {
    const sourceColumnPromises = source.userGames.map((item, index) =>
      UserGame.findOneAndUpdate(
        { _id: item._id },
        { $set: { columnId: source.columnId, columnPosition: index } },
        { new: true },
      ),
    );

    const destinationColumnPromises = destination.userGames.map((item, index) =>
      UserGame.findOneAndUpdate(
        { _id: item._id },
        { $set: { columnId: destination.columnId, columnPosition: index } },
        { new: true },
      ),
    );
    await Promise.all([...sourceColumnPromises, ...destinationColumnPromises]);

    return NextResponse.json(
      { message: 'Successfully updated userGame card positions in column' },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error updating userGame position ${error}`);
    return NextResponse.json(
      { error: 'Error updating userGames positions' },
      { status: 500 },
    );
  }
}
