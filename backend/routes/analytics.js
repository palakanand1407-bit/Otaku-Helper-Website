// routes/analytics.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const FLASK_SERVER = "http://localhost:5001";

// 
router.get("/top-animes", async (req, res) => {
  try {
    // http://localhost:5000/api/analytics/top-animes
    const response = await axios.get(`${FLASK_SERVER}/top-rated-animes`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top animes" });
  }
});

// http://localhost:5000/api/analytics/popular-genres
router.get("/popular-genres", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_SERVER}/popular-genres`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

//http://localhost:5000/api/analytics/popular-genres-chart
router.get("/popular-genres-chart", async (req, res) => {
    try {
      const response = await axios({
        url: `${FLASK_SERVER}/popular-genres-chart`,
        method: "GET",
        responseType: "stream",
      });
  
      response.data.pipe(res);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genre chart" });
    }
  });

  // http://localhost:5000/api/analytics/top-favorited-animes
router.get("/top-favorited-animes", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_SERVER}/top-favorited-animes`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top favorited animes" });
  }
});
module.exports = router;
