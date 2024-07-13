import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import Game from '@/lib/models/gameModel';
import IGDB from '@/lib/igdbWrapper';
import { dbConnect } from '@/lib/db';

/**
 * @desc    Get game document from MongoDB by igdbId
 * @route   GET /games/:igdbId
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @param {Object} context - The context object containing URL parameters
 * @param {Object} context.params - The URL parameters
 * @param {string} context.params.igdbId - The IGDB ID of the game to update
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function GET(request, { params }) {
  await dbConnect();
  const igdbId = params.igdbId;

  if (!igdbId) {
    return NextResponse.json(
      { message: 'No game ID provided' },
      { status: 400 },
    );
  }

  try {
    const game = await Game.findById(igdbId);
    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    console.log('Error fetching game by ID from MongoDB ', error);
    return NextResponse.json('Error fetching game from DB', {
      status: 500,
    });
  }
}

/**
 * @desc    Update game document in MongoDB by igdbId
 * @route   PUT /api/games/:igdbId
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @param {Object} context - The context object containing URL parameters
 * @param {Object} context.params - The URL parameters
 * @param {string} context.params.igdbId - The IGDB ID of the game to update
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }

  const igdbId = params.igdbId;
  if (!igdbId) {
    return NextResponse.json(
      { message: 'No game ID provided' },
      { status: 400 },
    );
  }
  const updateData = await request.json().then((body) => body);

  try {
    const game = await Game.findOne({ igdbId: igdbId });

    if (!game) {
      return NextResponse.json(
        { message: `Game with IGDB id ${igdbId} not found` },
        { status: 404 },
      );
    }
    // Update game data
    game.set({ ...updateData });
    await game.save();
    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    console.error(`Error updating game by igdbId from MongoDB ${error}`);
    return NextResponse.json(
      { message: 'Error updating game from MongoDB' },
      {
        status: 500,
      },
    );
  }
}

/**
 * @desc    Delete game document in MongoDB by igdbId
 * @route   DELETE /api/games/:igdbId
 * @access  Private
 *
 * @param {NextRequest} request - The incoming HTTP request object
 * @param {Object} context - The context object containing URL parameters
 * @param {Object} context.params - The URL parameters
 * @param {string} context.params.igdbId - The IGDB ID of the game to update
 * @returns {Promise<NextResponse>} The HTTP response object
 */
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }

  const igdbId = params.igdbId;
  if (!igdbId) {
    return NextResponse.json(
      { message: 'No game ID provided' },
      { status: 400 },
    );
  }
  try {
    const result = await Game.deleteOne({ igdbId: igdbId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: `Game with IGDB id ${igdbId} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Game IGDB:${igdbId} successfully deleted from DB` },
      { status: 200 },
    ); // 204 No content
  } catch (error) {
    console.error(`Error updating game by igdbId from MongoDB ${error}`);
    return NextResponse.json(
      { message: 'Error deleting game from MongoDB' },
      {
        status: 500,
      },
    );
  }
}
