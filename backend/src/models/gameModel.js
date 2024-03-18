const mongoose = require("mongoose");

const Game = mongoose.model(
  "Game",
  new mongoose.Schema({
    igdbId: Number,
    name: String,
    summary: String,
    releaseDates: [Date], // Set the release_date field as a Date type
    firstReleaseDate: Date,
    genres: ["Action", "Adventure"],
    platforms: [Number],
    cover: Number,
    artworks: [Number],
    updatedAt: Date, //lastUpdateByIgdbAtr: Date,
    url: String,
    involvedCompanies: [Number],
    userInteraction: {
      owned: Boolean,
      wishlist: Boolean,
      played: Boolean,
      completionStatus: String, // "100% completion", "Main story complete", "Not completed"
    },
    // rating: 85.0,
    // rating_count: 1000,
    // popularity: 500,
    // developer: "Developer Name",
    // publisher: "Publisher Name",
    // age_ratings: ["ESRB: Teen"],
    // game_modes: ["Single-player", "Multiplayer"],
    // tags: ["open world", "story rich"],
    // status: "Released",
    // screenshots: ["https://example.com/screenshot1.jpg", "https://example.com/screenshot2.jpg"],
    // videos: ["https://example.com/trailer.mp4"],
  }),
);

module.exports = Game;
// getGamesById =
// [
//   {
//       "id": 198581,
//       "alternative_names": [
//           118750,
//           118751
//       ],
//       "artworks": [
//           74794,
//           117432,
//           127409
//       ],
//       "category": 11,
//       "cover": 329096,
//       "created_at": 1651153697,
//       "first_release_date": 694137600,
//       "franchises": [
//           457
//       ],
//       "game_modes": [
//           1
//       ],
//       "involved_companies": [
//           184072
//       ],
//       "name": "Sonic the Hedgehog",
//       "parent_game": 3192,
//       "platforms": [
//           411
//       ],
//       "player_perspectives": [
//           4
//       ],
//       "release_dates": [
//           382181
//       ],
//       "screenshots": [
//           781282
//       ],
//       "similar_games": [
//           25636,
//           57296,
//           87622,
//           87728,
//           95340,
//           100800,
//           103292,
//           105233,
//           109277,
//           113895
//       ],
//       "slug": "sonic-the-hedgehog--10",
//       "summary": "Sonic the Hedgehog is an LCD game created by Tiger Electronics. This game is unique among Sonic LCD games as it comes in a form similar to that of a wristwatch. There is a total of 4 levels.",
//       "tags": [
//           1
//       ],
//       "themes": [
//           1
//       ],
//       "updated_at": 1707095262,
//       "url": "https://www.igdb.com/games/sonic-the-hedgehog--10",
//       "websites": [
//           279036
//       ],
//       "checksum": "e487ffe5-e38a-6027-8ae6-35fda952a423",
//       "collections": [
//           2156
//       ]
//   }
// ]
