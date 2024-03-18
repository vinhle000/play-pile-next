const Game = require("../models/gameModel");
const asyncHandler = require("express-async-handler");
const IGDBWrapper = require("../services/IGDBWrapper");
const logger = require("../../config/logger");

// Create a single instance of IGDBWrapper to reuse
const IGDB = new IGDBWrapper();

// @desc    Get game by ID from IGDB
// @route   GET /games/:id
// @access  Public
const getIgdbGameById = asyncHandler(async (req, res) => {
    const gameId = req.params.id;

    logger.debug("getIgdbGames", igdbGameIds);
    if (!gameId) {
        return res.status(400).json({ message: 'No game ID provided' });
    }

    try {
        const game = await IGDB.fetchGameById(gameId);
        res.status(200).json(game);
    } catch (error) {
        logger.error(`Error fetching game by ID from IGDB ${error}`);
        res.status(500).json({ message: "Error fetching game from IGDB" });
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
        res.status(500).json({ message: "Error fetching games from IGDB" });
    }
});

module.exports = { getIgdbGameById, getIgdbGames };
