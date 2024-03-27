const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    igdbId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      // required: true,
    },
    releaseDates: {
      type: [Object],
      // required: true,
    },
    firstReleaseDate: {
      type: Date,
      // required: true,
    },
    genres: {
      type: [Object],
      // required: true,
    },
    platforms: {
      type: [Object],
      // required: true,
    },
    cover: {
      type: [Object],
      // required: true,
    },
    artworks: {
      type: [String],
      // required: true,
    },
    screenshots: {
      type:  [Object]
    },
    similarGames: {
      type: [Number],
      // required: true,
    },
    igdbUrl: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

gameSchema.index({ igdbId: 1 }, { unique: true });

module.exports = mongoose.model('game', gameSchema);
