document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");
    const detailsContainer = document.getElementById("anime-details");
    
    if (!animeId) {
        detailsContainer.innerHTML = "<p>No anime ID provided.</p>";
        return;
    }
    
    detailsContainer.innerHTML = '<div class="loading">Loading anime details...</div>';
    
    // Handle random anime case
    if (animeId === 'random') {
        const randomAnime = localStorage.getItem('randomAnime');
        if (randomAnime) {
            displayAnimeDetails(JSON.parse(randomAnime));
        } else {
            detailsContainer.innerHTML = "<p>Random anime data not found.</p>";
        }
        return;
    }
    
    // Fetch anime by ID
    fetch(`http://localhost:5000/api/anime/${animeId}`)
        .then(response => {
            if (!response.ok) {
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
        
    // Function to display anime details
    function displayAnimeDetails(animeData) {
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
    }
});