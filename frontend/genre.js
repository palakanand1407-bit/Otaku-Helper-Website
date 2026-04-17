document.addEventListener('DOMContentLoaded', () => {
    // Fixed to match the ID in genre.html
    const searchInput = document.getElementById('search');
    const searchButton = document.querySelector('.search-container button');
    
    // Genre anime loader
    const genres = [
        'Action', 'Romance', 'Comedy', 'Adventure', 'Horror',
        'Sci-Fi', 'Fantasy', 'Drama', 'Slice of Life',
        'Mystery', 'Supernatural', 'Girls Love'
    ];

    function fetchGenre(genreName) {
        let formattedGenre = genreName.toLowerCase();

        if (formattedGenre === 'sci-fi') formattedGenre = 'scifi';
        else if (formattedGenre === 'slice of life') formattedGenre = 'slice-of-life';
        else if (formattedGenre === 'girls love') formattedGenre = 'girls-love';
        else formattedGenre = formattedGenre.replace(/ of /g, '-of-').replace(/ /g, '-');

        const sectionTitle = document.evaluate(`//h2[contains(text(), '${genreName}')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!sectionTitle) return;

        const section = sectionTitle.parentNode;
        const grid = section.querySelector('.anime-grid');
        grid.innerHTML = '<div class="loading">Loading anime...</div>';

        fetch(`http://localhost:5000/api/genre/genre/${formattedGenre}`)
            .then(res => res.json())
            .then(data => {
                if (!data.length) {
                    grid.innerHTML = `<div class="error">No ${genreName} anime found</div>`;
                    return;
                }
                grid.innerHTML = '';
                data.slice(0, 8).forEach(anime => {
                    const card = createAnimeCard(anime);
                    grid.appendChild(card);
                });
            })
            .catch(err => {
                grid.innerHTML = `<div class="error">Error: ${err.message}</div>`;
            });
    }

    // Shared card creator
    function createAnimeCard(anime) {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        const animeId = anime.anime_id || anime._id || '';
        const imageUrl = anime['Image URL'] || 'placeholder.jpg';
        const animeName = anime.Name || 'Unknown Anime';
        const score = anime.Score || 'N/A';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${animeName}" onerror="this.src='placeholder.jpg'">
            <div class="anime-card-content">
                <h3>${animeName}</h3>
                <div class="genres">${anime.Genres || anime.Genre || 'N/A'}</div>
                <div class="score">Score: ${score}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `anime-details.html?id=${animeId}`;
        });

        return card;
    }

    // Implement the search functionality
    function searchAnime() {
        const query = searchInput.value.trim();
        if (!query) return;

        // Create or find a search results section
        let searchResultsSection = document.getElementById('search-results-section');
        
        if (!searchResultsSection) {
            searchResultsSection = document.createElement('section');
            searchResultsSection.id = 'search-results-section';
            searchResultsSection.className = 'anime-section';
            searchResultsSection.innerHTML = `
                <h2>Search Results</h2>
                <div class="anime-grid">
                    <div class="loading">Searching anime...</div>
                </div>
            `;
            
            // Insert after the hero section
            const heroSection = document.querySelector('.hero');
            heroSection.after(searchResultsSection);
        } else {
            // If it exists, just update the grid content
            const grid = searchResultsSection.querySelector('.anime-grid');
            grid.innerHTML = '<div class="loading">Searching anime...</div>';
        }

        // Scroll to search results
        searchResultsSection.scrollIntoView({behavior: 'smooth'});
        
        // Fetch search results
        fetch(`http://localhost:5000/api/anime/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error("No results found");
                return res.json();
            })
            .then(data => {
                const grid = searchResultsSection.querySelector('.anime-grid');
                grid.innerHTML = '';
                
                if (data.length === 0) {
                    grid.innerHTML = '<div class="error">No results found</div>';
                    return;
                }
                
                data.forEach(anime => {
                    const card = createAnimeCard(anime);
                    grid.appendChild(card);
                });
            })
            .catch(err => {
                const grid = searchResultsSection.querySelector('.anime-grid');
                grid.innerHTML = `<div class="error">${err.message}</div>`;
            });
    }

    // Add event listeners for search
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', searchAnime);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchAnime();
            }
        });
    }

    // Random anime button
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

    // Load all genre sections
    genres.forEach(fetchGenre);
});