const columnController = require('../controllers/columnController');
const express = require('express');
const router = express.Router();
const protected = require('../middleware/authMiddleware');

router.get('/', protected, columnController.getColumns);
router.post('/', protected, columnController.createColumn);
router.patch('/', protected, columnController.updateColumn);
router.delete('/:columnId', protected, columnController.deleteColumn);
router.delete('/', protected, columnController.deleteAllColumns)

module.exports = router;