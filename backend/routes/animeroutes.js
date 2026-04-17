const express = require("express");
const router = express.Router();
const Anime = require("../model/anime");

//http://localhost:5000/api/anime/search?q=Cowboy Bebop
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Query parameter is required" });

        const results = await Anime.find({
            $or: [
                { Name: { $regex: query, $options: "i" } },
                { "English name": { $regex: query, $options: "i" } },
                { Genres: { $regex: query, $options: "i" } } 
            ]
        }).select("-_id");

        if (!results.length) {
            return res.status(404).json({ message: "No results found" });
        }

        res.json(results);
    } catch (error) {
        console.error("Search API Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//http://localhost:5000/api/anime/all

router.get("/all", async (req, res) => {
    try {
        const results = await Anime.find({});
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});



// Fetch all anime for the homepage with extra fields for frontend display
router.get("/", async (req, res) => {
    try {
        const animeList = await Anime.find({}, {
            _id: 0,
            Name: 1,
            "Image URL": 1,
            anime_id: 1,
            Genres: 1,
            Genre: 1,
            Score: 1
        });
        res.json(animeList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch details of a specific anime by anime_id
router.get("/:id", async (req, res) => {
    try {
        const anime = await Anime.findOne({ anime_id: parseInt(req.params.id) }, { _id: 0 });
        if (!anime) return res.status(404).json({ message: "Anime not found" });
        res.json(anime);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
