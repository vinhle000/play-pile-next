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
      required: true,
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
    playStatus: {
      type: String,
      enum: [
        'No status',
        'Not owned',
        'Playing',
        'Replaying',
        'Endless',
        'Paused',
        'Finished',
        'Completed',
        'Dropped',
      ],
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
    embeddedLinks: {
      type: [String],
      default: [],
    },
    gameInfo: {
      // Embedded game info
      type: {
        name: {
          type: String,
          required: true,
        },
        coverUrl: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

UserGameSchema.index({ igdbId: 1 });
UserGameSchema.index({ userId: 1 });

UserGameSchema.index({ userId: 1, isInPlayPile: 1 }); //All games in users play pile
UserGameSchema.index({ userId: 1, igdbId: 1 }, { unique: true }); // Find specific userGame data for a user
UserGameSchema.index({ userId: 1, columnId: 1 }); // Finding all userGame in a column
UserGameSchema.index({ userId: 1, isOnBoard: 1 }); // Finding all userGame on the board
UserGameSchema.index({ columnId: 1, columnPosition: 1 }); // Finding a specific userGame item
const UserGame =
  mongoose.models?.UserGame || mongoose.model('UserGame', UserGameSchema);
export default UserGame;
