const Game = require('../models/gameModel');
const asyncHandler = require('express-async-handler');
const IGDBWrapper = require('../services/IGDBWrapper');
const logger = require('../../config/logger');
const mongoose = require('mongoose');

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

  logger.debug('getIgdbGames', igdbGameIds);
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

  logger.info(`getIgdbGames- ---  ${igdbGameIds}`);

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
// @route   POST /games/search
// @access  Public
const searchIgdbGames = asyncHandler(async (req, res) => {
  const searchTerm = req.body.searchTerm;

  if (!searchTerm || searchTerm.length === 0) {
    return res.status(400).json({ message: 'No search term provided' });
  }

  try {
    const games = await IGDB.fetchGamesBySearchTerm(searchTerm);
    res.status(200).json(games);
  } catch (error) {
    logger.error(
      `Error fetching games from IGDB by search term "${searchTerm}": ${error}`
    );
    res.status(500).json({
      message: `Error fetching games from IGDB by search term "${searchTerm}"`,
    });
  }

  // check if games exist in MongoDB
  // if not, store games in MongoDB
  // return games;
  res.status(200).json({ message: 'search games by query' }); // placeholder
});

//  =======================================================================================
// Operations with Games controller
//  =======================================================================================

// @desc    Get game from DB by IGDB ID
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

// @desc    Get multiple games from DB by IGDB ID
// @route   POST /games/query
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
// @access  Public //TODO: should be protected
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

    logger.debug(`New game(s) created from [${newIgdbIds}] IGDB ID(s)`);
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
  let gameData = req.body;

  if (!igdbId) {
    return res.status(400).json({ message: 'No game IGDB id provided' });
  }

  if (!gameData) {
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
    game.set({ ...gameData });
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
// Operations with Games and UserGames controller
//  =======================================================================================
// TODO: Implement the following operations

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

// persist games in MongoDB
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
      cover: game.cover,
      // artworks: game.artworks,
      screenshots: game.screenshots,
      similar_games: game.similar_games,
      igdbUrl: game.url,
    };
  });
  console.log({ games });
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
