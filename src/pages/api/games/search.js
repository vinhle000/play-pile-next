import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { connectDB } from '@/lib/db';

connectDB();

export default async function handler(req, res) {
  console.log(' GOT TO HANDLER');
  switch (req.method) {
    case 'GET':
      const { q } = req.query;
      console.debug(`Search query: ${q}`);

      if (!q) {
        return res.status(400).json({ message: 'No search term provided' });
      }

      try {
        const igdbGames = await IGDB.fetchGamesBySearchTerm(q);
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
        res.status(200).json(games);
      } catch (error) {
        console.error(
          `Error fetching games from IGDB by query "${q}": ${error}`,
        );
        res.status(500).json({
          message: `Error fetching games from IGDB by query "${q}"`,
        });
      }
      break;

    case 'POST':
      return addGame(req, res);
    case 'PUT':
      return updateGame(req, res);
    case 'DELETE':
      return deleteGame(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper functions
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
    logger.debug(`New game(s) created from [${ids}] IGDB ID(s)`);
    return newGames;
  } catch (error) {
    console.error(`Error in creating games(s): ${error}`);
    throw new Error({ message: 'Error in creating games(s)' });
  }
};
