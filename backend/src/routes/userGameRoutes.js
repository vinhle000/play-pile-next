const express = require('express');
const router = express.Router();
const userGameController = require('../controllers/userGameController');
const protectRoute  = require('../middleware/authMiddleware');

router.get('/playPile', protectRoute, userGameController.getUserGamePile);
router.patch('/:igdbId', protectRoute, userGameController.updateUserGameData);

module.exports = router;
// http://localhost:5173/backlog
//  const response = await axios.patch(`${API_URL}/${igdbId}`, fields, { withCredentials: true });
// return response.data;