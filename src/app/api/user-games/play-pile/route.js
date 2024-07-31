import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import UserGame from '@/lib/models/userGameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

/**
 * @desc  Add to game to user's "pile" of games they want to track
 * @route GET /api/user-games/play-pile
 * @access Private
 */
export async function GET() {
  let session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    await connectDB();

    let userGames = await UserGame.find({
      userId: userId,
      isInPlayPile: true,
    });

    return NextResponse.json(userGames, { status: 200 });
  } catch (error) {
    console.error('Error getting Play Pile userGames');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
