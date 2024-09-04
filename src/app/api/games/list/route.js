import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';
/**
 * @desc    Get game(s) from DB
 * @route   POST /games/list/
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function POST(request) {
  const igdbIds = await request.json().then((body) => body.igdbIds);
  if (!igdbIds || igdbIds.length === 0) {
    return NextResponse.json(
      { message: 'No IGDB IDs provided' },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    // Query the database using the igdbId
    const games = await Game.find({ igdbId: { $in: igdbIds } });
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error('Error fetching games by igdbIds from DB ', error);
    return NextResponse.json(
      { message: 'Error fetching games by IgdbIds' },
      {
        status: 500,
      },
    );
  }
}
