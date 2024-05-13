const mongoose = require('mongoose');

const UserGameSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    igdbId: {
      type: Number,
      required: true
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      default: null,
    },
    columnPosition: {
      type: Number,
      default: 0,
    },
    isInPlayPile: {
      type: Boolean,
      default: false,
    },
    playingStatus: {
      type: String,
      enum: ['Not started', 'Currently Playing', 'Paused', 'Endless', 'Replaying'],
      default: 'Not started',
    },
    playedStatus: {
      type: String,
      enum: ['No status', 'Finished', 'Completed', 'Dropped'],
      default: 'No status',
    },
    playDates: {
      type: [
        {
          from: {
            type: Date,
          },
          to: {
            type: Date,
          },
        },
      ],
      default: [],
    },
    hoursPlayed: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    gameInfo: { // Embedded game info
      type: {
        name: {
          type: String,
          required: true,
        },
        coverUrl: {
          type: String,
        }
      }
    },
  },
  {
    timestamps: true,
  }
);


UserGameSchema.index({ igdbId: 1 });
UserGameSchema.index({ userId: 1});


UserGameSchema.index({ userId: 1, isInPlayPile: 1 });  //All games in users play pile
UserGameSchema.index({ userId: 1, igdbId: 1 }, { unique: true }); // Find specific userGame data for a user
UserGameSchema.index({ userId: 1, columnId: 1 });  // Finding all userGame in a column
UserGameSchema.index({ userId: 1, isOnBoard: 1 }); // Finding all userGame on the board
UserGameSchema.index({ columnId: 1, columnPosition: 1 }); // Finding a specific userGame item
module.exports = mongoose.model('UserGame', UserGameSchema);
