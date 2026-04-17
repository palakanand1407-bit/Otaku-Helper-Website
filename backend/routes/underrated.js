const express = require("express");
const router = express.Router();
const Anime = require("../model/anime");

router.get("/", async (req, res) => {
  try {
    const underratedAnime = await Anime.aggregate([
      { 
        $match: { 
          Score: { $gte: 7.5 }, 
          Members: { $lt: 100000 }
        } 
      },
      { $sample: { size: 5 } }
    ]);

    res.json(underratedAnime);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;



