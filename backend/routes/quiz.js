// routes/quiz.js
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// Define anime recommendations by genre
const animeRecommendations = {
  "Action": ["Fullmetal Alchemist: Brotherhood", "Bleach: Sennen Kessen-hen", "Gintama°", "Hunter x Hunter (2011)", "Shingeki no Kyojin Season 3 Part 2"],
  "Romance": ["Kaguya-sama wa Kokurasetai", "Fruits Basket: The Final", "Clannad: After Story", "Monogatari Series: Second Season", "Shigatsu wa Kimi no Uso"],
  "Comedy": ["Gintama°", "Kaguya-sama wa Kokurasetai", "Gintama", "Owarimonogatari 2nd Season", "Mob Psycho 100 II"],
  "Fantasy": ["Fullmetal Alchemist: Brotherhood", "Bleach: Sennen Kessen-hen", "Hunter x Hunter (2011)", "Kimetsu no Yaiba: Yuukaku-hen", "Mushoku Tensei"],
  "Drama": ["Fullmetal Alchemist: Brotherhood", "Shingeki no Kyojin Season 3 Part 2", "Fruits Basket: The Final", "\"Oshi no Ko\"", "3-gatsu no Lion 2nd Season"],
  "Mystery": ["Owarimonogatari 2nd Season", "Monster", "Monogatari Series: Second Season", "Mushishi Zoku Shou 2nd Season", "Mushishi Zoku Shou"],
  "Sci-Fi": ["Gintama°", "Code Geass: Hangyaku no Lelouch R2", "Gintama", "Cowboy Bebop", "Code Geass: Hangyaku no Lelouch"],
  "Horror": ["Kenpuu Denki Berserk", "Mononoke", "Kiseijuu: Sei no Kakuritsu", "Shinsekai yori", "Higurashi no Naku Koro ni"],
  "Adventure": ["One Piece", "Hunter x Hunter", "Fullmetal Alchemist: Brotherhood", "Bleach: Sennen Kessen-hen", "Mushishi Zoku Shou"],
  "Slice of Life": ["Mushishi Zoku Shou", "Natsume Yuujinchou Shi", "Nichijou", "Barakamon", "March Comes in Like a Lion"],
  "Isekai": ["Re:Zero-Starting Life in Another World", "That Time I Got Reincarnated as a Slime", "Sword Art Online", "Mushoku Tensei", "The Rising of the Shield Hero"],
  "Sports": ["Haikyuu!! Karasuno Koukou vs. Shiratorizawa Gakuen Koukou", "Hajime no Ippo", "Haikyuu!! Second Season", "Ping Pong the Animation", "Slam Dunk"],
  "Psychological": ["Death Note", "Steins;Gate", "Paranoia Agent", "Monster", "Perfect Blue"]
};

// POST endpoint to process quiz answers
router.post('/results', (req, res) => {
  const answers = req.body.answers;
  
  // Validate input
  if (!answers || answers.length !== 12) {
    return res.status(400).json({ error: 'Invalid input: 12 answers required' });
  }
  
  // Spawn Python process
  const python = spawn('python', ['quiz/predict.py']);
  let dataString = '';
  
  // Send data to Python script
  python.stdin.write(JSON.stringify(answers));
  python.stdin.end();
  
  // Collect data from script
  python.stdout.on('data', (data) => {
    dataString += data.toString();
  });
  
  // Handle errors
  python.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });
  
  // When the script is done
  python.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Error processing quiz answers' });
    }
    
    try {
      const result = JSON.parse(dataString);
      const topGenre = result.top_genre;
      const recommendations = animeRecommendations[topGenre] || [];
      
      return res.json({
        genre: topGenre,
        all_genres: result.all_genres,
        recommendations: recommendations
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error processing results' });
    }
  });
});


module.exports = router;