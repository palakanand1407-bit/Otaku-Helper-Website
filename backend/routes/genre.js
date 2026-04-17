const express = require("express");
const router = express.Router();
const Anime = require("../model/anime");

const buildGenreRegex = (genre) => {
    let searchPattern = genre;
    if (genre.toLowerCase() === 'scifi' || genre.toLowerCase() === 'sci-fi') {
        return new RegExp("(sci[- ]?fi|science fiction)", "i");
    }
    
    const cleanGenre = genre.replace(/-/g, ' ').trim();
    
    return new RegExp(`\\b${cleanGenre}\\b`, "i");
};

// GET: Single genre (e.g. /api/genre/Action)
router.get("/genre/:genreName", async (req, res) => {
    try {
        const genre = req.params.genreName.trim();
        const limit = parseInt(req.query.limit) || 5;

        if (!genre) {
            return res.status(400).json({ error: "Genre parameter is required" });
        }

        let searchGenre = genre.replace(/-/g, ' ');
        let searchRegex;
        if (searchGenre.toLowerCase() === 'scifi' || searchGenre.toLowerCase() === 'sci fi') {
            searchRegex = new RegExp("(sci[- ]?fi|science fiction)", "i");
        } else {
            searchRegex = buildGenreRegex(searchGenre);
        }

        const results = await Anime.find({
            $or: [
                { Genres: { $regex: searchRegex } },
                { Genre: { $regex: searchRegex } }
            ]
        })
        .limit(limit)
        .sort({ Score: -1 });

        if (!results.length) {
            return res.status(404).json({ 
                message: `No anime found for ${searchGenre}`, 
                searchPattern: searchRegex.toString() 
            });
        }

        res.json(results);
    } catch (error) {
        console.error(`Genre search error:`, error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// GET: Multiple genres (e.g. /api/genre/genres?genres=Action,Romance,Horror)
router.get("/genres", async (req, res) => {
    try {
        const genres = req.query.genres?.split(',') || ['Action', 'Romance', 'Horror', 'Comedy', 'Adventure', 'Girls Love', 'Slice of Life', 'Fantasy', 'Supernatural', 'Thriller', 'Mystery', 'Drama'];
        const limit = parseInt(req.query.limit) || 8;

        const result = {};

        for (const genre of genres) {
            const searchGenre = genre.trim().replace(/-/g, ' ');
            const regex = buildGenreRegex(searchGenre);

            const animeList = await Anime.find({
                $or: [
                    { Genres: { $regex: regex } },
                    { Genre: { $regex: regex } }
                ]
            })
            .limit(limit)
            .select("Name 'Image URL' anime_id _id Genres Genre Score")
            .sort({ Score: -1 });

            result[genre.trim()] = animeList;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// GET: Available genres (processed from comma-separated strings)
router.get("/available-genres", async (req, res) => {
    try {
        let genres = await Anime.distinct("Genres");

        const genreSet = new Set();
        genres.forEach(genreString => {
            if (genreString) {
                genreString.split(',').map(g => g.trim()).forEach(g => {
                    if (g) genreSet.add(g);
                });
            }
        });

        const singularGenres = await Anime.distinct("Genre");
        singularGenres.forEach(g => {
            if (g) genreSet.add(g.trim());
        });

        res.json([...genreSet]);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = router;