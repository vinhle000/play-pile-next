const Game = require('../models/gameModel');
const asyncHandler = require('express-async-handler');
const IGDBWrapper = require('../services/IGDBWrapper');
const logger = require('../../config/logger');
const mongoose = require('mongoose');

//TODO: convert into a classbased controller
// class GameController {
//   constructor() {
//       this.IGDB = new IGDBWrapper();
//   }


//  =======================================================================================
// IGDB API operations
//  =======================================================================================
// Create a single instance of IGDBWrapper to reuse
const IGDB = new IGDBWrapper();

// @desc    Get game by ID from IGDB
// @route   GET /games/:id
// @access  Public
const getIgdbGameById = asyncHandler(async (req, res) => {
  const gameId = req.params.id;
  if (!gameId) {
    return res.status(400).json({ message: 'No game ID provided' });
  }
  try {
    const game = await IGDB.fetchGameById(gameId);
    res.status(200).json(game);
  } catch (error) {
    logger.error(`Error fetching game by ID from IGDB ${error}`);
    res.status(500).json({ message: 'Error fetching game from IGDB' });
  }
});

// @desc    Get games from array of IGDB IDs
// @route   POST /games
// @access  Public
const getIgdbGames = asyncHandler(async (req, res) => {
  const igdbGameIds = req.body.igdbGameIds;

  if (!igdbGameIds || igdbGameIds.length === 0) {
    return res.status(400).json({ message: 'No IGDB IDs provided' });
  }

  try {
    const games = await IGDB.fetchGames(igdbGameIds);
    res.status(200).json(games);
  } catch (error) {
    logger.error(`Error fetching games from IGDB ${error}`);
    res.status(500).json({ message: 'Error fetching games from IGDB' });
  }
});

// @desc    Get games from IGDB by search query
// @route   GET /games/search //
// @access  Public
const searchIgdbGames = asyncHandler(async (req, res) => {

  const { q } = req.query;
  logger.debug(`Search query: ${q}`);
  if (!q) {
    return res.status(400).json({ message: 'No search term provided' });
  }

  try {
    const igdbGames = await IGDB.fetchGamesBySearchTerm(q);
    const igdbIds = igdbGames.map((game) => game.id);

    const existingGames = await Game.find({ igdbId: { $in: igdbIds } });

   //NOTE:  DOUBLE CHECK Issue with existing games not being found due to Number vs String type of IgdbId
    const existingIgdbIds = new Set(existingGames.map((game) => parseInt(game.igdbId)));
    const newIgdbGames = igdbGames.filter((game) => !existingIgdbIds.has(game.id));

    if (newIgdbGames.length > 0) {
      const newGames = await storeGames(newIgdbGames);
    }
    // Fetch all games after insertion to ensure we have a complete list of persisted games
    const games = await Game.find({ igdbId: { $in: igdbIds } });
    res.status(200).json(games);
  } catch (error) {
    logger.error(
      `Error fetching games from IGDB by query "${q}": ${error}`
    );
    res.status(500).json({
      message: `Error fetching games from IGDB by query "${q}"`,
    });
  }

  // TODO: Implement pagination for search results
  // const page = req.query.page || 1;
  //Here is an example for how to use limit. The default limit is 10. The maximum value you can set for limit is 500.
        // Address:
        // https://api.igdb.com/v4/platforms/
        // Body:
        // limit 33;
        // There is also an offset. This will start the list at position 22 and give 33 results.
        // Address:
        // https://api.igdb.com/v4/platforms/
        // Body:
        // limit 33;
        // offset 22;

});


//  =======================================================================================
// Operations with Games controller
//  =======================================================================================

// @desc    Get game from MongoDB by igdbId
// @route   GET /games/:igdbId
// @access  Public
const getGameById = asyncHandler(async (req, res) => {
  const igdbId = req.params.igdbId;

  if (!igdbId) {
    return res.status(400).json({ message: 'No game id provided' });
  }

  try {
    const game = await Game.findOne({ igdbId: parseInt(igdbId) });
    if (!game) {
      logger.debug(`No game found for igdbId: ${igdbId}`);
      return res
        .status(404)
        .json({ message: `Game with igdbId ${igdbId} not found` });
    }
    res.status(200).json(game);
  } catch (error) {
    logger.error(`Error fetching game by ID from MongoDB ${error}`);
    res.status(500).json({ message: 'Error fetching game from MongoDB' });
  }
});

// @desc    Get multiple games from MongoDB by [igdbId]
// @route   POST /games/list
// @access  Public
const getGames = asyncHandler(async (req, res) => {
  let igdbIds = req.body.igdbIds;

  if (!igdbIds || igdbIds.length === 0) {
    return res.status(400).json({ message: 'No igdbId provided' });
  }

  try {
    // Query the database using the igdbId
    let games = await Game.find({ igdbId: { $in: igdbIds } });
    if (!games || games.length === 0) {
      logger.debug(`No games found for igdbIds: ${igdbIds}`);
      return res.status(404).json({ message: 'No games found' });
    }
    res.status(200).json(games);
  } catch (error) {
    logger.error(`Error fetching games by igdbId from MongoDB ${error}`);
    res.status(500).json({ message: 'Error fetching games from MongoDB' });
  }
});


// @desc    Create game document(s) in MongoDB
// @route   POST /games/
// @access  Public //TODO: should be protected //Might not be neccessary
const createGames = asyncHandler(async (req, res) => {
  let igdbIds = req.body.igdbIds;

  if (!igdbIds || igdbIds.length === 0) {
    return res.status(400).json({ message: 'No IGDB IDs provided' });
  }

  try {
    // Check if games already exist in MongoDB
    let newIgdbIds = await checkForNonExistingGames(igdbIds);

    if (newIgdbIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Game(s) already exists in database' });
    }

    //lookup Games in IGDB and store in MongoDB
    let newGamesData = await IGDB.fetchGames([newIgdbIds]);
    let newGames = await storeGames(newGamesData);

    logger.debug(`New game(s) DB items created from [${newIgdbIds}] IGDB ID(s)`);
    res.status(201).json(newGames);
  } catch (error) {
    logger.error(`Error in creating game(s): ${error}`);
    res.status(500).json({ message: 'Error in creating games(s)' });
  }
});


// @desc    Update game document in MongoDB by igdbId
// @route   PUT /games/:id
// @access  Public TODO: should be protected  (for dev and testing currently)
// Going to sync with IGDB data through Webhooks
const updateGameById = asyncHandler(async (req, res) => {
  let igdbId = req.params.igdbId;
  let gameDataUpdateFields = req.body;

  if (!igdbId) {
    return res.status(400).json({ message: 'No game IGDB id provided' });
  }

  if (!gameDataUpdateFields) {
    // TODO: validate game data
    // use the scheme to validae? or use a middleware?
    return res.status(400).json({ message: 'No game data provided' });
  }

  try {
    // Check if game exists in MongoDB
    const game = await Game.findOne({ igdbId: igdbId });
    if (!game) {
      return res
        .status(404)
        .json({ message: `Game with IGDB id ${id} not found` });
    }

    // Update game data
    game.set({ ...gameDataUpdateFields });
    game.save();
    res.status(201).json(game);
  } catch (error) {
    logger.error(`Error updating game by igdbId from MongoDV ${error}`);
    res.status(500).json({ message: 'Error updating game from MongoDB' });
  }
});


// @desc    Delete game document in MongoDB by igdbId
// @route   DELETE /games/:id
// @access  Public TODO: should be protected  (for dev and testing only)
const deleteGameById = asyncHandler(async (req, res) => {
  const igdbId = req.params.igdbId;

  if (!igdbId) {
    return res.status(400).json({ message: 'No game igdbId provided' });
  }

  try {
    const result = await Game.deleteOne({ igdbId: igdbId });

    if (result.deletedCount === 0) {
      logger.debug(`Game with igdbId ${igdbId} not found`);
      return res
        .status(404)
        .json({ message: `Game with igdbId ${igdbId} not found` });
    }
    logger.debug(`Game with igdbId ${igdbId} deleted`);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    logger.error(`Error deleting game by IGDB ID from MongoDB ${error}`);
    res.status(500).json({ message: 'Error deleting game from MongoDB' });
  }
});


//  =======================================================================================
// Helper functions
//  =======================================================================================

const checkForNonExistingGames = async (igdbGameIds) => {
  const existing = await Game.find({ igdbId: { $in: igdbGameIds } });
  const existingIgdbIds = new Set(
    existing.map((game) => parseInt(game.igdbId))
  );
  return igdbGameIds.filter((id) => !existingIgdbIds.has(id));
};


const storeGames = async (igdbGames) => {
  let ids = [];
  const games = igdbGames.map((game) => {
    ids.push(game.id);
        return {
      igdbId: game.id,
      name: game.name,
      summary: game.summary,
      releaseDates: game.release_dates,
      firstReleaseDate: game.first_release_date,
      genres: game.genres,
      platforms: game.platforms,
      cover: {
        image_id: game.cover.image_id,
        url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
      },
      // artworks: game.artworks,
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
    logger.error(`Error in creating games(s): ${error}`);
    throw new Error({ message: 'Error in creating games(s)' });
  }
};


module.exports = {
  getIgdbGameById,
  getIgdbGames,
  searchIgdbGames,
  getGameById,
  getGames,
  createGames,
  updateGameById,
  deleteGameById,
};
