document.addEventListener('DOMContentLoaded', function() {
    // Get the container for liked anime
    const likedAnimeGrid = document.getElementById('liked-anime-grid');
    
    // Check if user is logged in
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!currentUserId) {
        likedAnimeGrid.innerHTML = `
            <div class="login-prompt">
                <h3>You need to login to see your favorites</h3>
                <a href="login.html" class="login-button">Login</a>
            </div>
        `;
        return;
    }
    
    // Load all liked anime
    loadUserLikedAnime();
    
    // Function to load user's liked anime
    function loadUserLikedAnime() {
        likedAnimeGrid.innerHTML = '<div class="loading">Loading your favorites...</div>';
        
        fetch(`http://localhost:5000/api/likes/${currentUserId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch liked anime');
            }
            return response.json();
        })
        .then(likes => {
            if (!likes || likes.length === 0) {
                likedAnimeGrid.innerHTML = `
                    <div class="no-favorites">
                        <h3>You haven't added any favorites yet</h3>
                        <p>Explore anime and click the heart icon to add to favorites!</p>
                        <a href="index.html" class="explore-button">Explore Anime</a>
                    </div>
                `;
                return;
            }
            
            // Display liked anime
            displayLikedAnime(likes);
        })
        .catch(error => {
            console.error('Error loading liked anime:', error);
            likedAnimeGrid.innerHTML = `
                <div class="error">
                    Error loading your favorites: ${error.message}
                </div>
            `;
        });
    }
    
    // Function to display liked anime
    function displayLikedAnime(likes) {
        likedAnimeGrid.innerHTML = '';
        
        likes.forEach(anime => {
            const cardContainer = document.createElement('div');
            cardContainer.classList.add('anime-card-container');
            
            // Create the card
            const card = document.createElement('div');
            card.classList.add('anime-card');
            
            card.innerHTML = `
                <a href="anime-details.html?id=${anime.animeId}">
                    <img src="${anime.imageUrl}" alt="${anime.animeName}">
                    <div class="anime-info">
                        <h3>${anime.animeName}</h3>
                    </div>
                </a>
            `;
            
            cardContainer.appendChild(card);
            
            // Add like button (already liked)
            const likeBtn = document.createElement('button');
            likeBtn.classList.add('like-btn', 'liked');
            likeBtn.innerHTML = '❤️';
            
            // Set data attributes
            likeBtn.setAttribute('data-id', anime.animeId);
            likeBtn.setAttribute('data-name', anime.animeName);
            likeBtn.setAttribute('data-image', anime.imageUrl);
            
            // Add click event to unlike
            likeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                toggleLike(anime.animeId, anime.animeName, anime.imageUrl, this);
                
                // Remove the card with animation after unliking
                if (this.classList.contains('liked')) {
                    this.classList.remove('liked');
                    this.innerHTML = '🤍';
                } else {
                    // If unliked, remove the card from view with animation
                    cardContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    cardContainer.style.opacity = '0';
                    cardContainer.style.transform = 'scale(0.8)';
                    
                    // Remove from DOM after animation completes
                    setTimeout(() => {
                        cardContainer.remove();
                        
                        // Check if there are any cards left
                        if (likedAnimeGrid.children.length === 0) {
                            likedAnimeGrid.innerHTML = `
                                <div class="no-favorites">
                                    <h3>You haven't added any favorites yet</h3>
                                    <p>Explore anime and click the heart icon to add to favorites!</p>
                                    <a href="index.html" class="explore-button">Explore Anime</a>
                                </div>
                            `;
                        }
                    }, 500);
                }
            });
            
            // Add button to container
            cardContainer.appendChild(likeBtn);
            
            // Add card to grid
            likedAnimeGrid.appendChild(cardContainer);
        });
    }
});