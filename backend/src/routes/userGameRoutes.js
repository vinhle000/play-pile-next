const express = require('express');
const router = express.Router();
const userGameController = require('../controllers/userGameController');
const protectRoute  = require('../middleware/authMiddleware');

router.get('/backlog', protectRoute, userGameController.getUserBacklog);
// router.put('/backlog/:igdbId', protectRoute, userGameController.addGameToBacklog);  //TODO: consolidate endpoints to a general and flexible update userGame fields with PATCH request
// router.delete('/backlog/:igdbId', protectRoute, userGameController.removeGameFromBacklog);
router.patch('/:igdbId', protectRoute, userGameController.updateUserGameData);

module.exports = router;
// http://localhost:5173/backlog
//  const response = await axios.patch(`${API_URL}/${igdbId}`, fields, { withCredentials: true });
// return response.data;