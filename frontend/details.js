document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");
    const detailsContainer = document.getElementById("anime-details");
    
    // Handle the case when id is "random"
    if (animeId === "random") {
        // Always fetch a new random anime from the server
        fetch('http://localhost:5000/api/random')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch random anime');
                return response.json();
            })
            .then(anime => {
                localStorage.setItem('randomAnime', JSON.stringify(anime));
                displayAnimeDetails(anime);
            })
            .catch(error => {
                console.error('Error fetching random anime:', error);
                detailsContainer.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            });
        return;
    }
    
    
    // Continue with your existing code for fetching by ID
    if (!animeId) {
        detailsContainer.innerHTML = "<p>No anime ID provided.</p>";
        return;
    }
    
    // Show loading state
    detailsContainer.innerHTML = '<div class="loading">Loading anime details...</div>';
    
    // Fetch anime details from API
    fetch(`http://localhost:5000/api/anime/${animeId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Anime not found');
                }
                throw new Error('Failed to fetch anime details');
            }
            return response.json();
        })
        .then(animeData => {
            displayAnimeDetails(animeData);
        })
        .catch(error => {
            console.error("Error:", error);
            detailsContainer.innerHTML = `<div class="error">Error loading anime details: ${error.message}</div>`;
        });
});

// Create a separate function to display anime details
function displayAnimeDetails(animeData) {
    const detailsContainer = document.getElementById("anime-details");
    const card = document.createElement("div");
    card.classList.add("anime-detail-card");
    
    card.innerHTML = `
        <div class="details-left">
            <h1>${animeData.Name}</h1>
            <p>${animeData.Synopsis || animeData.Description || "No description available."}</p>

            <ul class="anime-info">
                <li><strong>Episodes:</strong> ${animeData.Episodes || "N/A"}</li>
                <li><strong>Japanese:</strong> ${animeData["Other name"] || "N/A"}</li>
                <li><strong>Premiered:</strong> ${animeData.Premiered || "N/A"}</li>
                <li><strong>Duration:</strong> ${animeData.Duration || "N/A"}</li>
                <li><strong>Status:</strong> ${animeData.Status || "N/A"}</li>
                <li><strong>Genre:</strong> ${animeData.Genre || animeData.Genres || "N/A"}</li>
                <li><strong>Studios:</strong> ${animeData.Studios || "N/A"}</li>
                <li><strong>Producer:</strong> ${animeData.Producer || animeData.Producers || "N/A"}</li>
            </ul>
        </div>

        <div class="details-right">
            <img src="${animeData["Image URL"]}" alt="${animeData.Name}">
        </div>
    `;
    
    detailsContainer.innerHTML = '';
    detailsContainer.appendChild(card);
    
    // Remove the watchlist event listener since the button no longer exists
}

// Add event listener for random anime link
document.addEventListener('DOMContentLoaded', function() {
    const randomAnimeLink = document.getElementById('randomAnimeLink');
    if (randomAnimeLink) {
        randomAnimeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'anime-details.html?id=random';
        });
    }
});