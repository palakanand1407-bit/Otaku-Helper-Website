const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/otakuhelper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


const animeSchema = new mongoose.Schema({
    anime_id: Number,
    Name: String,
    English_name: String,
    Other_name: String,
    Score: Number,
    Genres: [String],
    Synopsis: String,
    Type: String,
    Episodes: Number,
    Aired: String,
    Premiered: String,
    Status: String,
    Producers: [String],
    Licensors: [String],
    Studios: [String],
    Source: String,
    Duration: String,
    Rating: String,
    Rank: Number,
    Popularity: Number,
    Favorites: Number,
    Scored_By: Number,
    Members: Number,
    Image_URL: String,
}, { collection: "dataset24" }); 

const Anime = mongoose.model("Anime", animeSchema);

app.get("/anime/name/:name", async (req, res) => {
    try {
        const nameQuery = req.params.name.trim();
        console.log("Searching for anime with name:", nameQuery);

        const anime = await Anime.findOne(
            { Name: { $regex: new RegExp(nameQuery, "i") } }, // Case-insensitive regex
            { _id: 0, anime_id: 0 }
        );

        if (!anime) {
            console.log("Anime not found for:", nameQuery);
            return res.status(404).json({ message: "Anime not found" });
        }

        console.log("Anime found:", anime);
        res.json(anime);
    } catch (error) {
        console.error("Error fetching anime:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));