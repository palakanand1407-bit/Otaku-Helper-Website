const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  animeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anime",
    required: true
  },
  animeName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  likedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only like an anime once
LikeSchema.index({ userId: 1, animeId: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);