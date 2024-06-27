import dbConnect from '@/lib/dbConnect';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';

dbConnect();

// @desc    Get multiple games from MongoDB by [igdbId]
// @route   POST /games/list
// @access  Public
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const igdbGameIds = req.body.igdbGameIds;

    if (!igdbGameIds || igdbGameIds.length === 0) {
      res.status(400).json({ message: 'No IGDB IDs provided' });
    }

    try {
      // Query the database using the igdbId
      let games = await Game.find({ igdbId: { $in: igdbIds } });
      return res.status(200).json(games);
    } catch (error) {
      console.error(`Error fetching games by igdbId from MongoDB`);
      return res.status(400).json({ message: 'No games found' });
    }
  }
}
