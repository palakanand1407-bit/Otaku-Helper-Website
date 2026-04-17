const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Like = require("../model/likes");
const User = require("../model/user");
const Anime = require("../model/anime");
const authMiddleware = require("../middleware/authMiddleware");

// Get all likes for a user
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId.trim();
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const likes = await Like.find({ userId }).sort({ likedAt: -1 });
    
    res.json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Check if an anime is liked by a user
router.get("/check/:userId/:animeId", authMiddleware, async (req, res) => {
  try {
    const { userId, animeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(animeId)) {
      return res.status(400).json({ message: "Invalid userId or animeId format" });
    }

    const like = await Like.findOne({ userId, animeId });
    
    res.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Toggle like status (like or unlike)
router.post("/toggle", authMiddleware, async (req, res) => {
  try {
    const { userId, animeId, animeName, imageUrl } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(animeId)) {
      return res.status(400).json({ message: "Invalid userId or animeId format" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if anime exists
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ userId, animeId });
    
    if (existingLike) {
      // Unlike: Remove the like
      await Like.deleteOne({ _id: existingLike._id });
      res.json({ liked: false, message: "Anime unliked successfully" });
    } else {
      // Like: Create new like
      const newLike = new Like({
        userId,
        animeId,
        animeName,
        imageUrl
      });
      
      await newLike.save();
      res.json({ liked: true, message: "Anime liked successfully" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Remove a like
router.delete("/:userId/:animeId", authMiddleware, async (req, res) => {
  try {
    const { userId, animeId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(animeId)) {
      return res.status(400).json({ message: "Invalid userId or animeId format" });
    }

    const result = await Like.deleteOne({ userId, animeId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Like not found" });
    }
    
    res.json({ message: "Like removed successfully" });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;