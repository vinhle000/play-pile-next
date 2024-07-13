import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { dbConnect } from '@/lib/db';

// @desc    Get game from MongoDB by igdbId
// @route   GET /games/:igdbId
// @access  Public
export async function GET(request, { params }) {
  await dbConnect();
  const igdbId = params.igdbId;

  if (!igdbId) {
    return NextResponse.json(
      { message: 'No game ID provided' },
      { status: 400 },
    );
  }

  try {
    const game = await Game.findById(igdbId);
    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    console.log('Error fetching game by ID from MongoDB ', error);
    return NextResponse.json('Error fetching game from DB', {
      status: 500,
    });
  }
}
