const mongoose = require('mongoose');

const UserGame = mongoose.model(
  'UserGame',
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      gameId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Game',
      },
      igdbId: { type: Number, required: true },
      status: {
        type: String,
        enum: ['Playing', 'Completed', 'Dropped', 'Plan to Play'],
        default: 'Plan to Play',
        // required: true
      },
      addedToBacklog: {
        type: Date,
        default: Date.now,
      },
      notes: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

UserGame.index({ igdbId: 1 });
UserGame.index({ userId: 1, gameIds: 1 }, { unique: true });
UserGame.index({ userId: 1, igdbId: 1 }, { unique: true });

module.exports = UserGame;
