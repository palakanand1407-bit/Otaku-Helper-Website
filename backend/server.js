require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); 

app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/otakuhelper")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const animeRoutes = require("./routes/animeroutes");
const authRoutes = require("./routes/auth");
const randomRoutes = require("./routes/random");
const underratedRoutes = require("./routes/underrated");
const trendingRoutes = require("./routes/trending");
const airingRoutes = require("./routes/airing");
const analyticsRoutes = require("./routes/analytics");
const genreRoutes = require("./routes/genre");
const threadRoutes = require("./routes/threads");
const quizRoutes = require("./routes/quiz");
const likesRoutes = require("./routes/likes");

app.use("/api/auth", authRoutes);
app.use("/api/anime", animeRoutes); 
app.use("/api/random", randomRoutes);
app.use("/api/underrated", underratedRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/api/airing", airingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/genre", genreRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/likes", likesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




