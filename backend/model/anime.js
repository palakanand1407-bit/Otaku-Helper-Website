const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
    Name: String,
    "English name": String,
    "Other name": String,
    Score: Number,
    Genres: String,
    Synopsis: String,
    Type: String,
    Episodes: Number,
    Aired: String,
    Premiered: String,
    Status: String,
    Producers: String,
    Licensors: String,
    Studios: String,
    Source: String,
    Duration: String,
    Rating: String,
    Rank: Number,
    Popularity: Number,
    Favorites: Number,
    "Scored By": Number,
    Members: Number,
    "Image URL": String
}, { collection: "dataset24" });

module.exports = mongoose.model("Anime", animeSchema);
