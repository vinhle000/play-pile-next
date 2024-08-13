import mongoose from 'mongoose';
import UserGame from '@/lib/models/userGameModel';
import Column from '@/lib/models/columnModel';
import Game from '@/lib/models/gameModel';
import { connectDB } from '@/lib/db';

function convertToPlainObject(doc) {
  return JSON.parse(JSON.stringify(doc));
}
/**
 * @desc  Add to game to user's "pile" of games they want to track
 * @route GET /api/user-games/play-pile
 * @access Private
 */
export async function getUserGamesInPlayPile(userId) {
  try {
    await connectDB();

    const userGames = await UserGame.find({
      userId: userId,
      isInPlayPile: true,
    }).lean();

    return userGames.map(convertToPlainObject);
  } catch (error) {
    console.error('Error getting userGames in PlayPile from DB', error);
    throw new Error('Error getting userGames in PlayPile from DB');
  }
}

/**
 * @desc  Get Only the games that are in columns that are on the board
 * @route GET /api/user-games/board
 * @access Private
 */
export async function getUserGamesOnBoard(userId) {
  try {
    await connectDB();
    const columnsOnBoard = await Column.find({
      userId: userId,
      isOnBoard: true,
    }).lean();

    const columnIds = columnsOnBoard.map((column) => column._id);

    const userGamesOnBoard = await UserGame.find({
      userId: userId,
      columnId: { $in: columnIds },
    }).lean();

    if (!userGamesOnBoard) {
      return NextResponse.json({}, { stats: 200 }); // providing an empty object since no games were found
    }
    const userGamesByColumnId = {};

    userGamesOnBoard.forEach((userGame) => {
      if (!userGamesByColumnId[userGame.columnId]) {
        userGamesByColumnId[userGame.columnId] = [];
      }
      userGamesByColumnId[userGame.columnId].push(userGame);
    });

    // sort each column's userGames to respective column position order
    for (const [columnId, userGames] of Object.entries(userGamesByColumnId)) {
      userGamesByColumnId[columnId] = userGames.sort(
        (a, b) => a.columnPosition - b.columnPosition,
      );
    }
    return convertToPlainObject(userGamesByColumnId);
  } catch (error) {
    console.error('Error getting userGames on board from DB', error);
    throw new Error('Error getting userGames on board from DB');
  }
}

/**
 * @desc  Update user game data, can update multiple fields
 * @route PATCH /api/userGames/:igdbId
 * @access Private
 */
export async function updateUserGame(userId, igdbId, updateData) {
  try {
    // Fetch game from Game db item with Game model
    const gameInfo = await Game.findOne({ igdbId: igdbId });
    if (!gameInfo) {
      throw new Error('Game info not found');
    }

    let userGameDocument = await UserGame.findOne({ userId, igdbId });

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
    ).lean();

    if (!userGame) {
      console.warn('No userGame found for update');
    }
    return convertToPlainObject(userGame);
  } catch (error) {
    console.error(`Error updating userGame document ${error}`);
    throw new Error('Error updating userGame document ');
  }
}

/**
 * @desc  Update userGame card position in assigned column
 * @route PATCH /api/user-games/board/positions
 * @access Private
 */
export async function updateUserGamePositions(source, destination) {
  try {
    await connectDB();
    const sourceColumnPromises = source.userGames.map((item, index) =>
      UserGame.findOneAndUpdate(
        { _id: item._id },
        { $set: { columnId: source.columnId, columnPosition: index } },
        { new: true },
      ),
    );

    const destinationColumnPromises = destination.userGames.map((item, index) =>
      UserGame.findOneAndUpdate(
        { _id: item._id },
        { $set: { columnId: destination.columnId, columnPosition: index } },
        { new: true },
      ),
    );

    await Promise.all([...sourceColumnPromises, ...destinationColumnPromises]);

    return {
      message: 'Successfully updated userGame card positions in column',
    };
  } catch (error) {
    console.error();
    throw new ERROR();
  }
}
