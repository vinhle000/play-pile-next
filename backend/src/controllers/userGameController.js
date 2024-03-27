const UserGame = require('../models/userGameModel');
const asyncHandler = require('express-async-handler');
const logger = require('../../config/logger');
const mongoose = require('mongoose');



class UserGameController {

  // // @desc  Get userGame by IGDB ID
  // // @route GET /api/userGames/:igdbId
  // // @access Public (for now) //TODO: MUST BE PRIVATE
  // getUserGameByIgdbId = asyncHandler( async (req, res) => {
  //   const igdbId = req.params.igdbId;
  //   const user = req.user;

  //   if (!igdbId) {
  //     return res.status(400).json({ message: 'No iddbId provided'});
  //   }
  //   if (!user) {
  //     return res.status(400).json({ message: 'User not authenticated'});
  //   }

  //   try {

  //     const userGame = await UserGame.findOne({userId: user.id, igdbId: igdbId});
  //     if (!userGame) {
  //       return res.status(404).json({ message: 'No userGame found'});
  //     }

  //     res.status(200).json(userGame)
  //   } catch (error) {
  //     logger.error(`Error fetching userGame by igdbId from MongoDB ${error}`);
  //     res.status(500).json({ message: 'Error fetching userGame by igdbId' });
  //   }

  // });

  // @desc  Add to game to user's backlog
  // @route GET /api/userGames/backlog
  // @access Private
  getUserBacklog = asyncHandler( async (req, res) => {
    let userId = req.user._id;
    console.log('USER ID', userId)
    //check user, but protectRouter authMiddleware should handle it
    try {
      const userGameBacklog = await UserGame.find({
        userId: userId,
        isInBacklog: true,
      });

      res.status(200).json(userGameBacklog);
    } catch (error) {
      logger.error(`Error getting backlog for user ${error}`)
      res.status(500).json({message: 'Error getting backlog for user'})
    }
  });

  // @desc  Add to game to user's backlog
  // @route PUT /api/userGames/backlog/:igdb
  // @access Private
  addGameToBacklog = asyncHandler( async (req, res) => {
    const igdbId = req.params.igdbId;
    const userId = req.user._id;
    if (!igdbId) {
      return res.status(400).json({ message: 'No iddbId provided'});
    }

    try {
      let userGameData = await this.getUserGameData(userId, igdbId);

      if (!userGameData) {
        const newUserGameData = await this.createUserGameData(userId, igdbId, true);
        return res.status(201).json(newUserGameData);
      }

      let updatedData = await this.updateUserGameData(
        userId,
        igdbId,
        {
          isInBacklog: true,
        }
      );
      res.status(201).json(updatedData)

    } catch (error) {
      logger.error(`Error adding game to user backlog ${error}`);
      res.status(500).json({message: 'Error adding game to user backlog'})
    }
  })


  // @desc  Remove game from user's backlog
  // @route PUT /api/userGames/backlog/remove/:igdbId
  // @access Private
  removeGameFromBacklog = asyncHandler( async (req, res) => {
    const igdbId = req.params.igdbId;
    const userId = req.user._id;

    if (!igdbId) {
      return res.status(400).json({ message: 'No iddbId provided'});
    }

    try {
      let userGameData = await this.getUserGameData(userId, igdbId);

      if (!userGameData) {
        //should we return the data?
        return res.status(400).json('Game Not found in user backlog');
      }

      let updatedData = await this.updateUserGameData(
        userId,
        igdbId,
        {
          isInBacklog: false,
        }
      );
      res.status(201).json(updatedData)
    } catch (error) {
      logger.error(`Error removing game from user backlog ${error}`);
      res.status(500).json({message: 'Error removing game from user backlog'})
    }
  })


  // @desc  Update user game data, can update multiple fields
  // @route PATCH /api/userGames/:igdbId
  // @access Private
  updateUserGame = asyncHandler( async (req, res) => {
    const igdbId = req.params.igdbId;
    const userId = req.user._id;

    updateData = req.body;

    if (!igdbId) {
      return res.status(400).json({ message: 'No iddbId provided'});
    }

    if (!updateData) {
      return res.status(400).json({ message: 'No update data provided'});
    }

    try {
      let userGameData = await this.getUserGameData(userId, igdbId);

      if (!userGameData) {
        return res.status(400).json('Game Not found in user backlog');
      }

      let updatedData = await this.updateUserGameData(
        userId,
        igdbId,
        updateData
      );
      res.status(201).json(updatedData)

    } catch (error) {
      logger.error(`Error updating user game data ${error}`);
      res.status(500).json({message: 'Error updating user game data'})
    }

    res.status(200).json({message: "update game status"})
  })


  // ====================================================
  // CRUD OPERATIONS
  // ====================================================

  // @desc  Get userGame document PRIVATE
  getUserGameData = async (userId, igdbId) => {
    try {
      // const objectId = mongoose.Types.ObjectId(userId);
      console.log('getUserGameData function ', {userId, igdbId})
      const userGame = await UserGame.findOne({userId: userId, igdbId: parseInt(igdbId)});
      console.log('getUserGameDAta ----', userGame)
      if (!userGame) {
        // create one
        const newUserGameData = await this.createUserGameData(userId, igdbId);
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
  createUserGameData = async (userId, igdbId, isInBacklog, status ) => {


    //BUG - NEED TO SET the game id of

    try {

      const userGame = await UserGame.create({
        userId: userId,
        igdbId: parseInt(igdbId),
        status: status || 'Plan to Play',
        isInBacklog: isInBacklog || false,
        notes: 'THIS IS A TEST',
      });

      return userGame;
    } catch (error) {
      logger.error(`Error creating userGame document in Mongo: ${error}`);
      throw new Error('Error creating userGame document in Mongo ');
    }
  }


  // @desc  Update userGame document PRIVATE
  updateUserGameData = async (userId, igdbId, updateData) => {
    try {
      const userGame = await UserGame.findOneAndUpdate(
        {userId: userId, igdbId: igdbId},
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