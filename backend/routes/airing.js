const express = require('express');
const router = express.Router();
const Anime = require('../model/anime');

router.get('/top_airing', async (req, res) => {
    try {
        const topAiringAnime = await Anime.find({ Status: "Currently Airing" }) // Filter airing anime
            .sort({ Popularity: -1 }) // Sort by highest popularity
            .limit(5); // Get top 5

        res.status(200).json(topAiringAnime);
    } catch (error) {
        console.error('Error fetching top airing anime:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;