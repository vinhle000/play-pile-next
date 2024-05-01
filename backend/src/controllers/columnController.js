const Column = require('../models/columnModel');
const asyncHandler = require('express-async-handler');
const logger = require('../../config/logger');
class ColumnController {
  // NOTE: Possibly add option to only get columns that isOnBoard
  // May help avoid extra filtering check for the active columns displayed board in frontend

  // @desc  Get all columns ofr user
  // @route GET /api/board/columns
  // @access Private
  getColumns = asyncHandler(async (req, res) => {
    let userId = req.user._id;

    try {
      const columns = await Column.find({
        userId: userId,
      });

      res.status(200).json(columns);
    } catch (error) {
      logger.error(`Error getting columns ${error}`);
      res.status(500).json({ message: 'Error getting columns' });
    }
  });

  // TODO:
  // @desc  Get single column
  // @route GET /api/board/columns/:columnId
  // @access Private


  // @desc  Get columns that are to be displayed on board
  // @route GET /api/board/columns/onBoard // NOTE: redo api name url
  // @access Private
  getColumnsOnBoard = asyncHandler(async (req, res) => {
    let userId = req.user._id;

    try {
      const columns = await Column.find({
        userId: userId,
        isOnBoard: true,
      }).sort('position');

      res.status(200).json(columns);
    } catch (error) {
      logger.error(`Error getting columns on board ${error}`);
      res.status(500).json({ message: 'Error getting columns on board' });
    }

  });

  // Create a column
  // @desc  Create a column for user
  // @route POST /api/board/columns/
  // @access Private
  createColumn = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    let columnTitle = req.body.columnTitle ? req.body.columnTitle : '';

    logger.debug(`createColumn --> ${columnTitle}`)

    const currentColumnCount = await Column.countDocuments({
      userId: userId,
      isOnBoard: true,
    });
    console.log(`currentColumnCount --> `, currentColumnCount)


    try {
      const newColumn = await Column.create({
        userId: userId,
        title: columnTitle,
        onBoard: true,
        position: currentColumnCount + 1,
      });
      res.status(201).json(newColumn);
    } catch (error) {
      logger.error(`user: ${userId} had Error creating column. ${error}`);
      res.status(500).json({ message: 'Error creating column' });
    }
  });


  // @desc  Update column
  // @route PATCH /api/board/columns
  // @access Private
  updateColumn = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    let columnId = req.body.columnId;
    let updateData = req.body;

    if (!columnId) res.status(400).json({ message: 'No columnId provided' });
    if (!updateData) res.status(400).json({ message: 'No update data provided' });

    try {
      let updatedColumn = await this.updateColumnDocument(columnId, updateData);
      res.status(200).json(updatedColumn);
    } catch (error) {
      logger.error(`Error updating column: ${columnId}`);
      res.status(500).json({ message: 'Error updating column' });
    }
  });

  // @desc  Delete column
  // @route DELETE /api/board/columns/:columnId
  // @access Private
  deleteColumn = asyncHandler(async (req, res) => {
    let columnId = req.params.columnId;
    if (!columnId) res.status(400).json({ message: 'No columnId provided' });

    try {
      let result = await Column.deleteOne({ _id: columnId });
      if (result.deletedCount === 0)
        logger.debug(`Column: ${columnId} not found`);

      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error deleting column: ${columnId}`);
      res.status(500).json({ message: 'Error deleting column' });
    }
  });

  // @desc  Delete ALL column
  // @route DELETE /api/board/columns/
  // @access Private
  deleteAllColumns = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    let toDeleteAll = req.body.toDeleteAll;
    console.log('deleteAllCollumns --> ', toDeleteAll)
    if(!toDeleteAll) {
      res.status(400).json({message: '"toDeleteAll" set to true must be provided in request body'})
    } else {
      try {
        let result = await Column.deleteMany({ userId: userId });
        res.status(200).json(result)
      } catch (error) {
        logger.error(`Error deleting all columns for user: ${userId}`);
        res.status(500).json({ message: 'Error deleting all column' });
      }
    }
  });

  // ====================================================
  // CRUD OPERATIONS - directly to MongoDB
  // ====================================================

  updateColumnDocument = async (columnId, updateData) => {
    try {
      let column = await Column.findOneAndUpdate(
        { _id: columnId },
        { $set: updateData },
        { new: true } // return updated document
      );

      if (!column) {
        logger.warn(`No column: ${columnId} found for update`);
      }
      return column;
    } catch (error) {
      throw new Error('Error updating userGame document');
    }
  };
}

module.exports = new ColumnController();
