import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const igdbGameIds = req.body.igdbGameIds;
    if (!igdbGameIds || igdbGameIds.length === 0) {
      res.status(400).json({ message: 'No IGDB IDs provided' });
    }

    try {
      const igdbGames = await IGDB.fetchGames(igdbGameIds);
      res.status(200).json(igdbGames);
    } catch (error) {
      console.log('Error fetching games from IGDB by IDs ', error);
      res.status(500).json('Error fetching games from IGDB by IDs ');
    }
  }
}

// DIRECT to IGDB's API  ===============================================
// router.post('/igdb/', getIgdbGames);

// @desc    Get games from array of IGDB IDs
// @route   POST /games
// @access  Public
// const getIgdbGames = asyncHandler(async (req, res) => {
//   const igdbGameIds = req.body.igdbGameIds;

//   if (!igdbGameIds || igdbGameIds.length === 0) {
//     return res.status(400).json({ message: 'No IGDB IDs provided' });
//   }

//   try {
//     const games = await IGDB.fetchGames(igdbGameIds);
//     res.status(200).json(games);
//   } catch (error) {
//     console.error(`Error fetching games from IGDB ${error}`);
//     res.status(500).json({ message: 'Error fetching games from IGDB' });
//   }
// });
