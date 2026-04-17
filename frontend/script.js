document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('anime-cards-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Function to load all anime
    function loadAllAnime() {
        cardsContainer.innerHTML = '<div class="loading">Loading anime...</div>';
        
        fetch('http://localhost:5000/api/anime')
            .then(response => {
                console.log('API response status:', response.status);
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API data received:', data);
                
                if (!data || data.length === 0) {
                    cardsContainer.innerHTML = '<div class="error">No anime found in database</div>';
                    return;
                }
                
                // Display the anime cards
                cardsContainer.innerHTML = '';
                data.forEach(anime => {
                    // Create card for each anime
                    const card = createAnimeCard(anime);
                    cardsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching anime:', error);
                cardsContainer.innerHTML = `<div class="error">Error: ${error.message}<br>Make sure your backend server is running at http://localhost:5000</div>`;
            });
    }
    
    // Function to search anime
    function searchAnime(query) {
        cardsContainer.innerHTML = '<div class="loading">Searching anime...</div>';
        
        fetch(`http://localhost:5000/api/anime/search?q=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('No results found for your search');
                    }
                    throw new Error(`API responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    cardsContainer.innerHTML = '<div class="error">No results found for your search</div>';
                    return;
                }
                
                // Display the search results
                cardsContainer.innerHTML = '';
                data.forEach(anime => {
                    const card = createAnimeCard(anime);
                    cardsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Search error:', error);
                cardsContainer.innerHTML = `<div class="error">${error.message}</div>`;
            });
    }
    
    // Create anime card function
    function createAnimeCard(anime) {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        
        // Handle both string and number anime_id types
        const animeId = anime.anime_id !== undefined ? anime.anime_id : 
                       (anime._id !== undefined ? anime._id : '');
        
        card.innerHTML = `
            <img src="${anime['Image URL'] || 'placeholder.jpg'}" alt="${anime.Name}">
            <div class="anime-card-content">
                <h3>${anime.Name || 'Unknown Anime'}</h3>
                <div class="genres">${anime.Genres || anime.Genre || 'N/A'}</div>
                <div class="score">Score: ${anime.Score || 'N/A'}</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `anime-details.html?id=${animeId}`;
        });
        
        return card;
    }
    
    // Search button event listener
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchAnime(query);
        } else {
            loadAllAnime();
        }
    });
    
    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchAnime(query);
            } else {
                loadAllAnime();
            }
        }
    });
    
    // Load all anime on page load
    loadAllAnime();
});

// Add event listener for random anime link
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('randomAnimeLink').addEventListener('click', function(e) {
        e.preventDefault();
        fetchRandomAnime();
    });
});

function fetchRandomAnime() {
    // Show loading state (optional)
    document.body.style.cursor = 'wait';
    
    fetch('http://localhost:5000/api/random')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(anime => {
            // Get the anime ID or generate one if needed
            const animeId = anime._id || Math.floor(Math.random() * 10000);
            
            // Store the anime data in localStorage for use on the details page
            localStorage.setItem('randomAnime', JSON.stringify(anime));
            
            // Redirect to the anime details page with the ID
            window.location.href = `anime-details.html?id=random`;
        })
        .catch(error => {
            console.error('Error fetching random anime:', error);
        })
        .finally(() => {
            // Reset cursor
            document.body.style.cursor = 'default';
        });
}