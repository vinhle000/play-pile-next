import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';
import { getGameSearchResults } from '@/lib/utils/game-utils';
// @desc    Search games from IGDB and persist to MongoDB if does not exist
// @route   GET /games/search?q=<search Tearm>
// @access  Public
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { message: 'No search term provided' },
      { status: 400 },
    );
  }

  try {
    const games = await getGameSearchResults(query);
    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.log(`Error Searching games from IGDB with ${query}`, error);
    return NextResponse.json('Error fetching games from IGDB by IDs ', {
      status: 500,
    });
  }
}

/*
// Helper functions
*/
const checkForNonExistingGames = async (igdbGameIds) => {
  const existing = await Game.find({ igdbId: { $in: igdbGameIds } });
  const existingIgdbIds = new Set(
    existing.map((game) => parseInt(game.igdbId)),
  );
  return igdbGameIds.filter((id) => !existingIgdbIds.has(id));
};
