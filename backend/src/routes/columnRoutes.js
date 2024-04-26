const columnController = require('../controllers/columnController');
const express = require('express');
const router = express.Router();
const protected = require('../middleware/authMiddleware');

router.get('/', protected, columnController.getColumns);
router.post('/:title', protected, columnController.createColumn);
router.patch('/:columnId', protected, columnController.updateColumn);
router.delete('/:columnId', protected, columnController.deleteColumn);

module.exports = router;