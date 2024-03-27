const express = require('express');
const router = express.Router();
const userGameController = require('../controllers/userGameController');
const protectRoute  = require('../middleware/authMiddleware');

router.get('/', protectRoute, userGameController.getUserBacklog);
router.put('/backlog/:igdbId', protectRoute, userGameController.addGameToBacklog);
router.put('/backlog/remove/:igdbId', protectRoute, userGameController.removeGameFromBacklog);
router.patch('/backlog/:igdbId', protectRoute, userGameController.updateUserGame);


module.exports = router;

