import mongoose from 'mongoose';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';

function convertToPlainObject(doc) {
  return JSON.parse(JSON.stringify(doc));
}
/**
 * @desc  Add to game to user's "pile" of games they want to track
 * @route GET /api/user-games/play-pile
 * @access Private
 */
export async function getGameSearchResults(query) {
  try {
    await connectDB();
    const igdbGames = await IGDB.fetchGamesBySearchTerm(query);
    const igdbIds = igdbGames.map((game) => game.id);

    const existingGames = await Game.find({ igdbId: { $in: igdbIds } });

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
    const games = await Game.find({ igdbId: { $in: igdbIds } }).lean();

    return convertToPlainObject(games);
  } catch (error) {
    console.error('Error fetching games from IGDB by IDs ', error);
    throw new Error('Error getting userGames in PlayPile from DB');
  }
}

/*
// Helper functions
*/
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
