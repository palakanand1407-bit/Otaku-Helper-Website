const express = require('express');
const router = express.Router();
const Anime = require('../model/anime');

router.get('/trending', async (req, res) => {
    try {
        const trendingAnime = await Anime.find()
            .sort({ Popularity:-1 })
            .limit(5);

        res.status(200).json(trendingAnime);
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

