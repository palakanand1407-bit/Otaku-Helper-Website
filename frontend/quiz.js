// Add this at the beginning of your quiz.js file
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first before loading quiz
    checkAuthentication();

    const randomAnimeLink = document.getElementById('randomAnimeLink');
    if (randomAnimeLink) {
        randomAnimeLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.cursor = 'wait';
            fetch('http://localhost:5000/api/random')
                .then(res => res.json())
                .then(anime => {
                    localStorage.setItem('randomAnime', JSON.stringify(anime));
                    window.location.href = 'anime-details.html?id=random';
                })
                .catch(err => console.error(err))
                .finally(() => document.body.style.cursor = 'default');
        });
    }

    // Authentication check function
    function checkAuthentication() {
        // Check if user is logged in by looking for the token in localStorage
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            // User is not logged in, show access denied and redirect after delay
            showAccessDenied();
            return false;
        }
        
        // User is authenticated, load the quiz
        loadQuiz();
        return true;
    }

    function showAccessDenied() {
        // Replace quiz content with access denied message
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <div class="access-denied">
                <i class="fas fa-lock" style="font-size: 4rem; color: #ff6b81; margin-bottom: 20px;"></i>
                <h2>Access Restricted</h2>
                <p>You need to be logged in to access the anime quiz.</p>
                <button id="loginRedirect" class="submit-btn">Go to Login <i class="fas fa-sign-in-alt"></i></button>
            </div>
        `;
        
        // Add some styling to the access denied message
        const style = document.createElement('style');
        style.textContent = `
            .access-denied {
                text-align: center;
                padding: 40px 20px;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 300px;
            }
            .access-denied h2 {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: #ff6b81;
            }
            .access-denied p {
                font-size: 1.1rem;
                margin-bottom: 25px;
            }
        `;
        document.head.appendChild(style);
        
        // Add click event for redirect button
        document.getElementById('loginRedirect').addEventListener('click', function() {
            window.location.href = 'login.html?redirect=quiz.html';
        });
    }

    function loadQuiz() {
        // This contains your original quiz loading code
        const questions = [
            {
                question: "How do you prefer the pacing of a story?",
                background: "url('quiz image/question 1.png')",
                options: [
                    "Fast and full of action",
                    "Slow but emotional",
                    "Deep and thought-provoking",
                    "Realistic and daily-life based",
                    "Magical and imaginative"
                ]
            },
            {
                question: "Which setting do you enjoy the most?",
                background: "url('quiz image/question 2.png')",
                options: [
                    "War zones or battlefield",
                    "High school romance spots",
                    "Mental hospitals or dark cities",
                    "Classrooms or cafes",
                    "Fantasy worlds or medieval kingdoms"
                ]
            },
            {
                question: "What drives the main character in your ideal anime?",
                background: "url('quiz image/question 3.png')",
                options: [
                    "Justice and strength",
                    "Love and relationships",
                    "Mental struggles and identity",
                    "Daily routine and growth",
                    "Destiny and magic"
                ]
            },
            {
                question: "Which type of conflict do you like?",
                background: "url('quiz image/question 11.png')",
                options: [
                    "Physical battles",
                    "Emotional dilemmas",
                    "Psychological mind games",
                    "Social misunderstandings",
                    "Mystical or supernatural forces"
                ]
            },
            {
                question: "Your ideal anime has...",
                background: "url('quiz image/question 5.png')",
                options: [
                    "Explosions and power-ups",
                    "Confessions and heartbreaks",
                    "Dark plot twists",
                    "Friendship moments and slice-of-life feels",
                    "Enchanted weapons and quests"
                ]
            },
            {
                question: "How important is romance in anime for you?",
                background: "url('quiz image/question 4.png')",
                options: [
                    "Not at all",
                    "A little is okay",
                    "Only if it affects the plot deeply",
                    "Quite a lot",
                    "It's the main reason I watch"
                ]
            },
            {
                question: "What kind of protagonist do you enjoy?",
                background: "url('quiz image/question 7.png')",
                options: [
                    "Brave warrior",
                    "Shy lover",
                    "Silent genius",
                    "Relatable and kind",
                    "Chosen one with powers"
                ]
            },
            {
                question: "How do you feel about plot complexity?",
                background: "url('quiz image/question 8.png')",
                options: [
                    "Simple is fine",
                    "Moderate drama",
                    "I love complex stories",
                    "Light and fun",
                    "A balance of depth and fantasy"
                ]
            },
            {
                question: "Which emotional tone do you prefer?",
                background: "url('quiz image/question 9.png')",
                options: [
                    "Intense adrenaline",
                    "Warm and heartfelt",
                    "Dark and eerie",
                    "Relaxed and peaceful",
                    "Mysterious and epic"
                ]
            },
            {
                question: "Preferred animation style?",
                background: "url('quiz image/question 10.png')",
                options: [
                    "Sharp, detailed fight scenes",
                    "Soft and romantic",
                    "Gritty and symbolic",
                    "Cozy and bright",
                    "Fantasy and colorful"
                ]
            },
            {
                question: "Favorite kind of ending?",
                background: "url('quiz image/question 6.png')",
                options: [
                    "Epic finale",
                    "Romantic closure",
                    "Open-ended, thought-provoking",
                    "Everyone happy",
                    "Hero's destiny fulfilled"
                ]
            },
            {
                question: "What kind of worldbuilding excites you?",
                background: "url('quiz image/question 12.png')",
                options: [
                    "Warrior clans, rivalries",
                    "Love triangles and drama",
                    "Hidden truths and mental games",
                    "Normal school and family life",
                    "New worlds, magic systems"
                ]
            }
        ];

        // DOM Elements
        const quizBody = document.getElementById('quizBody');
        const submitBtn = document.getElementById('submitQuiz');
        const resultModal = document.getElementById('resultModal');
        const closeResult = document.getElementById('closeResult');
        const retakeQuiz = document.getElementById('retakeQuiz');
        const resultGenre = document.getElementById('resultGenre');
        const resultDescription = document.getElementById('resultDescription');
        const animeRecommendations = document.getElementById('animeRecommendations');
        const genreIcon = document.getElementById('genreIcon');
        const genreBreakdown = document.getElementById('genreBreakdown');
        
        // Quiz State
        let answers = [];

        // Initialize Quiz
        initQuiz();

        // Display All Questions
        function showAllQuestions() {
            let questionsHTML = '';
            
            questions.forEach((question, qIndex) => {
                questionsHTML += `
                    <div class="question-card" style="background-image: ${question.background}">
                        <h2>${qIndex + 1}. ${question.question}</h2>
                `;
                
                // Add options
                question.options.forEach((option, oIndex) => {
                    questionsHTML += `
                        <button class="option" data-qindex="${qIndex}" data-oindex="${oIndex}">
                            ${option}
                        </button>
                    `;
                });
                
                questionsHTML += `</div>`;
            });
            
            quizBody.innerHTML = questionsHTML;
            
            // Add event listeners to options
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', selectOption);
            });
        }

        // Initialize Quiz
        function initQuiz() {
            showAllQuestions();
        }

        // Select an Option
        function selectOption(e) {
            const qIndex = parseInt(e.target.dataset.qindex);
            const oIndex = parseInt(e.target.dataset.oindex);
            
            // Remove selected class from all options in this question
            const questionCard = e.target.closest('.question-card');
            questionCard.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            e.target.classList.add('selected');
            
            // Store answer
            answers[qIndex] = oIndex;
        }

        // Submit Quiz Results
        function submitQuiz() {
            // Check if user is still authenticated before submission
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html?redirect=quiz.html';
                return;
            }

            // Check if all questions are answered
            if (answers.length !== questions.length || answers.includes(undefined)) {
                alert('Please answer all questions before submitting!');
                return;
            }

            // Show loading indicator
            submitBtn.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Send answers to the backend
            fetch('http://localhost:5000/api/quiz/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Use token from localStorage
                },
                body: JSON.stringify({ answers: answers }),
            })
            .then(response => {
                if (response.status === 401) {
                    // Handle unauthorized
                    throw new Error('Unauthorized');
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data); // Debug logging
                
                // Display results
                resultGenre.textContent = data.genre || data.top_genre;
                
                // Set description based on genre
                const genreDescriptions = {
                    "Action": "You thrive on adrenaline-pumping battles and heroic journeys! Your ideal anime features intense action sequences, power-ups, and protagonists who never give up.",
                    "Romance": "You're drawn to deep emotional stories and heartfelt connections. Your perfect anime explores relationships, romantic moments, and the ups and downs of love.",
                    "Comedy": "You love to laugh and enjoy lighthearted stories! Your ideal anime brings joy and relaxation, featuring hilarious situations and quirky characters.",
                    "Drama": "You appreciate powerful emotional storytelling with complex characters facing difficult challenges and meaningful character growth.",
                    "Fantasy": "You love escaping to magical worlds filled with extraordinary powers, mythical creatures, and epic quests.",
                    "Slice of Life": "You enjoy relaxing, heartwarming stories about everyday experiences and the beauty found in ordinary moments.",
                    "Psychological": "You're fascinated by the human mind and enjoy anime that explores complex mental states, philosophical questions, and thought-provoking themes.",
                    "Horror": "You enjoy the thrill of fear and supernatural elements that create suspense and tension.",
                    "Mystery": "You love solving puzzles and uncovering secrets in stories filled with clever twists and intriguing investigations.",
                    "Sports": "You're inspired by the passion, determination, and teamwork found in competitive athletic pursuits.",
                    "Adventure": "You crave excitement and discovery, enjoying stories about journeys to new places and experiences.",
                    "Sci-Fi": "You're fascinated by futuristic technology, space exploration, and the possibilities of science.",
                    "Isekai": "You crave the thrill of exploring new worlds and starting life from scratch! Your perfect anime transports characters to magical realms full of adventure, challenges, and endless possibilities."
                };
                
                const genre = data.genre || data.top_genre;
                resultDescription.textContent = genreDescriptions[genre] || 
                    `You're a fan of ${genre} anime! These stories captivate your imagination and match your personal preferences.`;
                
                // Set icon based on genre
                const genreIcons = {
                    "Action": "⚔️",
                    "Romance": "💖",
                    "Comedy": "😂",
                    "Drama": "😢",
                    "Fantasy": "🔮",
                    "Slice of Life": "☕",
                    "Psychological": "🧠",
                    "Horror": "👻",
                    "Mystery": "🔍",
                    "Sports": "🏆",
                    "Adventure": "🗺️",
                    "Sci-Fi": "🚀",
                    "Isekai": "🌀"
                };
                
                genreIcon.textContent = genreIcons[genre] || "🎬";
                
                // Display recommendations
                animeRecommendations.innerHTML = '';
                if (data.recommendations && Array.isArray(data.recommendations)) {
                    data.recommendations.forEach(anime => {
                        const li = document.createElement('li');
                        li.textContent = anime;
                        animeRecommendations.appendChild(li);
                    });
                } else {
                    console.error("Recommendations data is not in expected format", data.recommendations);
                    const li = document.createElement('li');
                    li.textContent = "No recommendations found";
                    animeRecommendations.appendChild(li);
                }
                
                // Display genre breakdown
                displayGenreBreakdown(data.all_genres || []);
                
                // Show modal
                resultModal.style.display = 'flex';
                
                // Reset button
                submitBtn.innerHTML = 'Get My Results <i class="fas fa-chevron-right"></i>';
                submitBtn.disabled = false;

                // Save quiz results to user profile
                try {
                    saveQuizResultToProfile(genre);
                } catch (err) {
                    console.error("Error saving quiz result:", err);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.message === 'Unauthorized') {
                    alert('Your session has expired. Please login again.');
                    window.location.href = 'login.html?redirect=quiz.html';
                } else {
                    alert('Something went wrong! Please try again.');
                }
                
                // Reset button
                submitBtn.innerHTML = 'Get My Results <i class="fas fa-chevron-right"></i>';
                submitBtn.disabled = false;
            });
        }

        // Save quiz result to user profile
        function saveQuizResultToProfile(genre) {
            // Get user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('token');
            
            if (!user || !user._id || !token) return;
            
            // Update user preferences
            fetch(`http://localhost:5000/api/users/${user._id}/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    preferred_genre: genre,
                    quiz_taken_date: new Date().toISOString()
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to save quiz result');
                return response.json();
            })
            .then(data => {
                console.log("Quiz result saved to profile", data);
                // Update user data in localStorage if needed
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            })
            .catch(err => console.error("Error saving quiz result:", err));
        }

        // Display Genre Breakdown
        function displayGenreBreakdown(genres) {
            genreBreakdown.innerHTML = '';
            
            // If there are no genres, show a message
            if (!genres || genres.length === 0) {
                genreBreakdown.innerHTML = '<p>No genre breakdown available</p>';
                return;
            }
            
            // Handle both formats: array of strings or array of [genre, probability] pairs
            let formattedGenres = genres;
            if (genres.length > 0 && Array.isArray(genres[0])) {
                formattedGenres = genres.map(item => {
                    return {
                        name: item[0],
                        percentage: Math.round(item[1] * 100)
                    };
                });
            } else {
                // If just string array, calculate percentages
                const totalGenres = genres.length;
                const basePercentage = 100 / totalGenres;
                
                formattedGenres = genres.map((genre, index) => {
                    return {
                        name: genre,
                        percentage: Math.round(basePercentage * (1 - (index * 0.15)))
                    };
                });
            }
            
            // Create the bars
            formattedGenres.forEach((genre, index) => {
                const genreBar = document.createElement('div');
                genreBar.className = 'genre-bar';
                genreBar.innerHTML = `
                    <span class="genre-name">${genre.name}</span>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: 0%"></div>
                    </div>
                    <span class="genre-percentage">${genre.percentage}%</span>
                `;
                
                genreBreakdown.appendChild(genreBar);
                
                // Animate the bar after a short delay
                setTimeout(() => {
                    genreBar.querySelector('.bar-fill').style.width = `${genre.percentage}%`;
                }, 100 * index);
            });
        }

        // Reset Quiz
        function resetQuiz() {
            answers = [];
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });
            resultModal.style.display = 'none';
        }

        // Event Listeners
        submitBtn.addEventListener('click', submitQuiz);
        closeResult.addEventListener('click', () => {
            resultModal.style.display = 'none';
        });
        retakeQuiz.addEventListener('click', resetQuiz);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === resultModal) {
                resultModal.style.display = 'none';
            }
        });
    }
});