const express = require("express");
const router = express.Router();
const {
  getIgdbGameById,
  getIgdbGames,
} = require("../controllers/gameController");

// Search games and get items
router.get("/", (req, res) => {
  res.send("get games - search games");
});

//Get game by IGDB id
router.get("/igdb/:id", getIgdbGameById);

// Get games from array of IGDB game ids
router.post("/igdb/", getIgdbGames);

// Get game by id'
// Items are from mongo with enriched data user related metrics and data from IGDB
router.get("/", (req, res) => {
  res.send("get game by from mongo");
});
module.exports = router;
