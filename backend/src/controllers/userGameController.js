const UserGame = require('../models/userGameModel');
const Game = require('../models/gameModel');
const Column = require('../models/columnModel');
const asyncHandler = require('express-async-handler');
const logger = require('../../config/logger');
const mongoose = require('mongoose');



class UserGameController {

  // @desc  Add to game to user's "pile" of games they want to track
  // @route GET /api/userGames/pile
  // @access Private
  getUserGamePile = asyncHandler( async (req, res) => {
    let userId = req.user._id;

    try {
      const userGamePile = await UserGame.find({
        userId: userId,
        isInPlayPile: true,
      });

      res.status(200).json(userGamePile);
    } catch (error) {
      logger.error(`Error getting game pile for user ${error}`)
      res.status(500).json({message: 'Error getting game pile for user'})
    }
  })

  // @desc get only the games that are in columns that are on the board
  getUserGamesOnBoard = asyncHandler( async (req, res) => {
    // getColumns of user,
    // get Id's of columns that hav isOnBoard = true

    const userId = req.user._id;
    const columnsOnBoard = await Column.find({userId: userId, isOnBoard: true});
    const columnIds = columnsOnBoard.map(column => column._id);
    // console.log(' Usercontroller -> getUserGamesOnBoard --> ', {userId, columnsOnBoard, columnIds})
    try {
      const userGamesOnBoard = await UserGame.find({ userId: userId, columnId: columnIds });

      //map games to each column id that they are in
      // {columnId: [game1, game2, game3]
         // columnId2: [game4, game5, game6]}
      if (!userGamesOnBoard) {
        res.status(200).json({});
      }
      const gamesOnBoard = {};
      userGamesOnBoard.forEach((game) => {
        if (gamesOnBoard[game.columnId]) {
          gamesOnBoard[game.columnId].push(game);
        } else {
          gamesOnBoard[game.columnId] = [game];
        }
      })

      res.status(200).json(gamesOnBoard);

    } catch (error) {
      logger.error(`Error getting user games on board ${error}`);
      res.status(500).json({message: 'Error getting user games on board'});
    }
  })

  // BUG: Issue getting 401 when making PATCH request
  // @desc  Update user game data, can update multiple fields
  // @route PATCH /api/userGames/:igdbId
  // @access Private
  updateUserGameData = asyncHandler(async (req, res) => {
    const igdbId = req.params.igdbId;
    const userId = req.user._id;
    const updateData = req.body;

    if (!igdbId) {
      return res.status(400).json({ message: 'No igdbId provided' });
    }

    if (!updateData) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    try {
      let updatedData = await this.updateUserGameDocument(userId, igdbId, updateData);
      res.status(200).json(updatedData);
    } catch (error) {
      logger.error(`Error updating user game data ${error}`);
      res.status(500).json({ message: 'Error updating user game data' });
    }
  });


  // ====================================================
  // CRUD OPERATIONS
  // ====================================================
  // @desc  Get userGame document PRIVATE  //NOTE: may need to refactor or remove
  getUserGameDocument = async (userId, igdbId) => {

    try {
      const userGame = await UserGame.findOne({userId: userId, igdbId: parseInt(igdbId)});

      if (!userGame) {
        const newUserGameData = await this.createUserGameDocument(userId, igdbId);
        logger.info(`No userGame document in Mongo, creating one for ${userId} and ${igdbId}`)
        return newUserGameData;
      }

      return userGame;
    } catch (error) {
      logger.error(`Error getting userGame document in Mongo ${error}`)
      throw new Error('Error getting userGame docuement in Mongo')
    }
  }


  // @desc  Create userGame document PRIVATE
  createUserGameDocument = async (userId, igdbId, updatedData ) => {

    //NOTE: - Dont thisnk the mongo objectID is needed
    try {
      const userGame = await UserGame.create({
        userId: userId,
        igdbId: parseInt(igdbId),
        ...updatedData
      });

      return userGame;
    } catch (error) {
      logger.error(`Error creating userGame document in Mongo: ${error}`);
      throw new Error('Error creating userGame document in Mongo ');
    }
  }


  // @desc  Update userGame document PRIVATE
  updateUserGameDocument = async (userId, igdbId, updateData) => {
    try {
      let userGameDocument = await UserGame.findOne({userId, igdbId});

      // Fetch game from Game collection with Game model
      const gameInfo = await Game.findOne({igdbId: igdbId});
      if ( !gameInfo ) {
        throw new Error('Game info not found');
      }

      if (!userGameDocument) {  // NOTE: Create a New Doc to track User & Game relationship if it doesn't exist
        userGameDocument = new UserGame({
          userId,
          igdbId,
          gameInfo: {
            name: gameInfo.name,
            coverUrl: gameInfo.cover.url,
          },
        });
        await userGameDocument.save();
      }

      const userGame = await UserGame.findOneAndUpdate(
        { userId: userId, igdbId: igdbId },
        { $set: updateData },
        { new: true} // return the updated document
      )

      if (!userGame) {
        logger.warn('No userGame found for update');
      }
      return userGame;
    } catch (error) {
      logger.error(`Error updating userGame document ${error}`);
      throw new Error('Error updating userGame document ');
    }
  }

  // @desc Delete userGame document PRIVATE - //TODO: remove after dev and testing
  deleteUserGameData = async (userId, igdbId) => {
    try {
      const result = await UserGame.deleteOne({userId: userId, igdbId: igdbId})

      if (result.deletedCount === 0) {
        logger.debug(`Game for ${userId} and ${igdbId} not found`)
      }
      logger.debug(`UserGame data for ${userId} and ${igdbId} deleted`)
    } catch (error) {
      logger.error(`Error deleting userGame document ${error}`);
      throw new Error('Error deleting userGame document')
    }
  }
}

module.exports = new UserGameController();