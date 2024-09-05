import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import UserGame from '@/lib/models/userGameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { updateUserGame } from '@/lib/utils/user-game-utils';

/**
 * @desc  Update user game data, can update multiple fields
 * @route PATCH /api/userGames/:igdbId
 * @access Private
 */
export async function PATCH(request, { params }) {
  await connectDB();
  let session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user.id);
  const igdbId = params.igdbId;
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

  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      { message: 'No userGame update data provided' },
      { status: 400 },
    );
  }

  try {
    let updatedUserGame = await updateUserGame(userId, igdbId, body);
    return NextResponse.json(updatedUserGame, { status: 200 });
  } catch (error) {
    console.error(`Error updating user game data ${error}`);
    return NextResponse.json(
      { error: 'Error updating user game data' },
      { status: 500 },
    );
  }
}
