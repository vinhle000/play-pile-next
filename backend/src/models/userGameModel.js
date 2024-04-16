const mongoose = require('mongoose');

const UserGameSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    igdbId: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Playing', 'Completed', 'Dropped', 'Plan to Play'],
      default: 'Plan to Play',
    },
    isInBacklog: {
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
          startDate: {
            type: Date,
          },
          endDate: {
            type: Date,
          },
        },
      ],
    },
    hoursPlayed: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);


UserGameSchema.index({ igdbId: 1 });
UserGameSchema.index({ userId: 1});

UserGameSchema.index({ userId: 1, igdbId: 1 }, { unique: true });

module.exports = mongoose.model('UserGame', UserGameSchema);
