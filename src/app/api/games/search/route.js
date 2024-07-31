import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';

// @desc    Search games from IGDB and persist to MongoDB if does not exist
// @route   GET /games/search?q=<search Tearm>
// @access  Public
export async function GET(request) {
  await connectDB();
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { message: 'No search term provided' },
      { status: 400 },
    );
  }

  try {
    const igdbGames = await IGDB.fetchGamesBySearchTerm(query);
    const igdbIds = igdbGames.map((game) => game.id);

    const existingGames = await Game.find({ igdbId: { $in: igdbIds } });

    // NOTE: DOUBLE CHECK Issue with existing games not being found due to Number vs String type of IgdbId
    const existingIgdbIds = new Set(
      existingGames.map((game) => parseInt(game.igdbId)),
    );
    const newIgdbGames = igdbGames.filter(
      (game) => !existingIgdbIds.has(game.id),
    );
    if (newIgdbGames.length > 0) {
      await storeGames(newIgdbGames);
    }

    // Fetch all games after insertion to ensure we have a complete list of persisted games
    const games = await Game.find({ igdbId: { $in: igdbIds } });
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.log('Error fetching games from IGDB by IDs ', error);
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

const storeGames = async (igdbGames) => {
  let ids = [];
  const games = igdbGames.map((game) => {
    ids.push(game.id);
    const firstReleaseDate = new Date(game.first_release_date * 1000); // Convert the timestamp to milliseconds
    return {
      igdbId: game.id,
      name: game.name,
      summary: game.summary,
      releaseDates: game.release_dates,
      firstReleaseDate: firstReleaseDate,
      genres: game.genres,
      platforms: game.platforms,
      cover: {
        image_id: game.cover.image_id,
        url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
      },
      screenshots: game.screenshots,
      similarGames: game.similar_games,
      igdbUrl: game.url,
    };
  });
  try {
    const newGames = await Game.insertMany(games);

    return newGames;
  } catch (error) {
    console.error(`Error in creating games(s): ${error}`);
    throw new Error({ message: 'Error in creating games(s)' });
  }
};
