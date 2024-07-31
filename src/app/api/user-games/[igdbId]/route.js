import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import UserGame from '@/lib/models/userGameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import {
  getUserGameDocument,
  createUserGameDocument,
  updateUserGameDocument,
  deleteUserGameData,
} from '@/lib/db/userGames';

/**
 * @desc  Update user game data, can update multiple fields
 * @route PATCH /api/userGames/:igdbId
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

  const userId = new mongoose.Types.ObjectId(session.user.id);
  let igdbId = context.params.igdbId;

  let updateData = await request.json().then((body) => body);

  if (!updateData) {
    return NextResponse.json(
      { message: 'No update data provided' },
      { status: 400 },
    );
  }

  try {
    let updatedUserGame = await updateUserGameDocument(
      userId,
      igdbId,
      updateData,
    );
    return NextResponse.json(updatedUserGame, { status: 200 });
  } catch (error) {
    console.error(`Error updating user game data ${error}`);
    return NextResponse.json(
      { error: 'Error updating user game data' },
      { status: 500 },
    );
  }
}
