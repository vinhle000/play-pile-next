import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import UserGame from '@/lib/models/userGameModel';
import Game from '@/lib/models/gameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

// ====================================================
// userGames DB CRUD OPERATIONS
// ====================================================

export async function getUserGameDocument(userId, igdbId) {
  try {
    const userGame = await UserGame.findOne({
      userId: userId,
      igdbId: parseInt(igdbId),
    });

    if (!userGame) {
      const newUserGameData = await createUserGameDocument(userId, igdbId);
      logger.info(
        `No userGame document in Mongo, creating one for ${userId} and ${igdbId}`,
      );
      return newUserGameData;
    }

    return userGame;
  } catch (error) {
    console.error(`Error getting userGame document in Mongo ${error}`);
    throw new Error('Error getting userGame docuement in Mongo');
  }
}

export async function createUserGameDocument(userId, igdbId, updatedData) {
  //NOTE: - Dont thisnk the mongo objectID is needed
  try {
    const userGame = await UserGame.create({
      userId: userId,
      igdbId: parseInt(igdbId),
      ...updatedData,
    });

    return userGame;
  } catch (error) {
    console.error(`Error creating userGame document in Mongo: ${error}`);
    throw new Error('Error creating userGame document in Mongo ');
  }
}

export async function updateUserGameDocument(userId, igdbId, updateData) {
  try {
    let userGameDocument = await UserGame.findOne({ userId, igdbId });

    // Fetch game from Game collection with Game model
    const gameInfo = await Game.findOne({ igdbId: igdbId });
    if (!gameInfo) {
      throw new Error('Game info not found');
    }

    if (!userGameDocument) {
      // NOTE: Create a New Doc to track User & Game relationship if it doesn't exist
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
      { new: true }, // return the updated document
    );

    if (!userGame) {
      logger.warn('No userGame found for update');
    }
    return userGame;
  } catch (error) {
    console.error(`Error updating userGame document ${error}`);
    throw new Error('Error updating userGame document ');
  }
}

// @desc Delete userGame document PRIVATE - //TODO: remove after dev and testing
export async function deleteUserGameData(userId, igdbId) {
  try {
    const result = await UserGame.deleteOne({ userId: userId, igdbId: igdbId });

    if (result.deletedCount === 0) {
      logger.debug(`Game for ${userId} and ${igdbId} not found`);
    }
    logger.debug(`UserGame data for ${userId} and ${igdbId} deleted`);
  } catch (error) {
    console.error(`Error deleting userGame document ${error}`);
    throw new Error('Error deleting userGame document');
  }
}
