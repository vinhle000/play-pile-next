import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';

// @desc    Fetch multiple games DIRECTLY from IGDB
// @route   POST /games/list/igdb
// @access  Public
export async function POST(request) {
  const igdbGameIds = await request.json().then((body) => body.igdbGameIds);

  if (!igdbGameIds || igdbGameIds.length === 0) {
    return NextResponse.json(
      { message: 'No IGDB IDs provided' },
      { status: 400 },
    );
  }

  try {
    const igdbGames = await IGDB.fetchGames(igdbGameIds);
    return NextResponse.json(igdbGames, { status: 200 });
  } catch (error) {
    console.log('Error fetching games from IGDB by IDs ', error);
    return NextResponse.json('Error fetching games from IGDB by IDs ', {
      status: 500,
    });
  }
}
