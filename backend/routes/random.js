const express = require("express");
const Anime = require("../model/anime");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const count = await Anime.countDocuments();

    if (count === 0) {
      return res.status(404).json({ error: "No anime found!" });
    }

    const randomIndex = Math.floor(Math.random() * count);

    const randomAnime = await Anime.findOne().skip(randomIndex).select("-__v -_id -anime_id");

    res.status(200).json(randomAnime);
  } catch (err) {
    console.error("Error fetching random anime:", err);
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
// const express = require("express");
// const Anime = require("../model/anime");

// const router = express.Router();


// router.get("/", async (req, res) => {
//   try {
//     const count = await Anime.countDocuments();
    
//     if (count === 0) {
//       return res.status(404).json({ error: "No anime found!" });
//     }

//     const randomIndex = Math.floor(Math.random() * count);

  
//     const randomAnime = await Anime.findOne().skip(randomIndex);

//     res.status(200).json(randomAnime);
//   } catch (err) {
//     console.error("Error fetching random anime:", err);
//     res.status(500).json({ error: "Server error!" });
//   }
// });

// module.exports = router;
