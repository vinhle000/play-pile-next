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
      // required: true
    },
    isInBacklog: {
      type: Boolean,
      default: false,
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
