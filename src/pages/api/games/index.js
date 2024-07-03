import { NextResponse } from 'next/server';
import Game from '@./lib/models/game';
import IGDB from '@./lib/igdbWrapper';
import { connectDB } from '@lib/db';

connectDB();

export default async function handler(req, res) {
  const igdbId = req.params.igdbId;

  switch (req.method) {
    // @desc    Get game from MongoDB by igdbId
    // @route   GET /games/:igdbId
    // @access  Public
    case 'GET':
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
        console.error(`Error fetching game by ID from MongoDB ${error}`);
        res.status(500).json({ message: 'Error fetching game from MongoDB' });
      }
      break;

    //-------------------------------------------------------------
    // @desc    Create game document(s) in MongoDB
    // @route   POST /games/
    // @access  Public //TODO: should be protected ---- Might not be necessary
    //  case 'POST':
    //   return addGame(req, res);
    //-------------------------------------------------------------

    // @desc    Update game document in MongoDB by igdbId
    // @route   PUT /games/:id
    // @access  Public TODO: should be protected  (for dev and testing currently)
    // Going to sync with IGDB data through Webhooks
    case 'PUT':
      const gameDataUpdateFields = req.body;

      if (!igdbId) {
        return res.status(400).json({ message: 'No game IGDB id provided' });
      }

      if (!gameDataUpdateFields) {
        // TODO: validate game data
        // use the scheme to validate? or use a middleware?
        return res.status(400).json({ message: 'No game data provided' });
      }

      try {
        // Check if game exists in MongoDB
        const game = await Game.findOne({ igdbId: igdbId });
        if (!game) {
          return res
            .status(404)
            .json({ message: `Game with IGDB id ${igdbId} not found` });
        }

        // Update game data
        game.set({ ...gameDataUpdateFields });
        await game.save();
        res.status(201).json(game);
      } catch (error) {
        console.error(`Error updating game by igdbId from MongoDB ${error}`);
        res.status(500).json({ message: 'Error updating game from MongoDB' });
      }
      break;

    // @desc    Delete game document in MongoDB by igdbId
    // @route   DELETE /games/:id
    // @access  Public TODO: should be protected  (for dev and testing only)
    case 'DELETE':
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
        console.error(`Error deleting game by IGDB ID from MongoDB ${error}`);
        res.status(500).json({ message: 'Error deleting game from MongoDB' });
      }
      return deleteGame(req, res);

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
