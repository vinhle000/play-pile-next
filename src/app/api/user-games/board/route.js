import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Column from '@/lib/models/columnModel';
import UserGame from '@/lib/models/userGameModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { getUserGamesOnBoard } from '@/lib/utils/user-game-utils';

/**
 * @desc  Get Only the games that are in columns that are on the board
 * @route GET /api/user-games/board
 * @access Private
 */
export async function GET() {
  let session = await auth();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    // await connectDB();

    // const columnsOnBoard = await Column.find({
    //   userId: userId,
    //   isOnBoard: true,
    // });

    // const columnIds = columnsOnBoard.map((column) => column._id);

    // const userGamesOnBoard = await UserGame.find({
    //   userId: userId,
    //   columnId: { $in: columnIds }, // NOTE: Double check if this is valid
    // });

    // if (!userGamesOnBoard) {
    //   return NextResponse.json({}, { stats: 200 }); // providing an empty object since no games were found
    // }
    // const userGamesByColumnId = {};

    // userGamesOnBoard.forEach((userGame) => {
    //   if (!userGamesByColumnId[userGame.columnId]) {
    //     userGamesByColumnId[userGame.columnId] = [userGame];
    //   }
    //   userGamesByColumnId[userGame.columnId].push(userGame);
    // });

    // // sort each column's userGames to respective column position order
    // for (const [columnId, userGames] of Object.entries(userGamesByColumnId)) {
    //   userGamesByColumnId[columnId] = userGames.sort(
    //     (a, b) => a.columnPosition - b.columnPosition,
    //   );
    // }
    const userGamesByColumnId = await getUserGamesOnBoard(userId);
    return NextResponse.json(userGamesByColumnId, { status: 200 });
  } catch (error) {
    console.error(`Error getting userGames on board ${error}`);
    return NextResponse.json(
      { error: 'Error getting userGames on board' },
      { status: 500 },
    );
  }
}
