document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Keep track of liked anime IDs for quick reference
    let likedAnimeIds = [];
    
    // Load user's liked anime if logged in
    if (currentUserId) {
        loadLikedAnimeIds();
    }
    
    // Function to load user's liked anime IDs
    function loadLikedAnimeIds() {
        fetch(`http://localhost:5000/api/likes/${currentUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch liked anime');
            }
            return response.json();
        })
        .then(likes => {
            // Store just the IDs in the array for quick checking
            likedAnimeIds = likes.map(anime => anime.animeId);
            
            // Update any existing like buttons on the page
            updateLikeButtons();
            
            // Update detail page like button if on details page
            updateDetailPageLikeButton();
        })
        .catch(error => {
            console.error('Error loading liked anime IDs:', error);
        });
    }
    
    // Function to update existing like buttons based on liked status
    function updateLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(button => {
            const animeId = button.getAttribute('data-id');
            
            if (likedAnimeIds.includes(animeId)) {
                button.classList.add('liked');
                button.innerHTML = '❤️';
            } else {
                button.classList.remove('liked');
                button.innerHTML = '🤍';
            }
            
            // Make sure the event listener is attached
            if (!button.hasAttribute('data-like-event-added')) {
                button.setAttribute('data-like-event-added', 'true');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const animeName = this.getAttribute('data-name');
                    const imageUrl = this.getAttribute('data-image');
                    
                    toggleLike(animeId, animeName, imageUrl, this);
                });
            }
        });
    }
    
    // Function to update the detail page like button if it exists
    function updateDetailPageLikeButton() {
        const detailBtn = document.getElementById('detailLikeBtn');
        if (!detailBtn) return;
        
        // Extract anime ID from URL or button
        const animeId = detailBtn.getAttribute('data-id');
        
        if (animeId && likedAnimeIds.includes(animeId)) {
            detailBtn.classList.add('liked');
            detailBtn.textContent = '❤️ Favorite';
        } else {
            detailBtn.classList.remove('liked');
            detailBtn.textContent = '🤍 Add to Favorites';
        }
        
        // Make sure the event listener is attached
        if (!detailBtn.hasAttribute('data-like-event-added')) {
            detailBtn.setAttribute('data-like-event-added', 'true');
            detailBtn.addEventListener('click', function() {
                // Get anime info from the data attributes
                const animeId = this.getAttribute('data-id');
                const animeName = this.getAttribute('data-name');
                const imageUrl = this.getAttribute('data-image');
                
                // Toggle the like
                toggleLike(animeId, animeName, imageUrl, this);
            });
        }
    }
    
    // Function to toggle like status
    window.toggleLike = function(animeId, animeName, imageUrl, buttonElement) {
        // If user is not logged in, redirect to login
        if (!currentUserId) {
            alert('Please log in to add favorites');
            window.location.href = 'login.html';
            return;
        }
        
        const isCurrentlyLiked = likedAnimeIds.includes(animeId);
        const isDetailButton = buttonElement.classList.contains('detail-like-btn');
        
        // Optimistically update the UI
        if (isCurrentlyLiked) {
            // Remove from liked IDs
            likedAnimeIds = likedAnimeIds.filter(id => id !== animeId);
            buttonElement.classList.remove('liked');
            
            if (isDetailButton) {
                buttonElement.textContent = '🤍 Add to Favorites';
            } else {
                buttonElement.innerHTML = '🤍';
            }
        } else {
            // Add to liked IDs
            likedAnimeIds.push(animeId);
            buttonElement.classList.add('liked');
            
            if (isDetailButton) {
                buttonElement.textContent = '❤️ Favorite';
            } else {
                buttonElement.innerHTML = '❤️';
            }
        }
        
        // Prepare data for API
        const likeData = {
            userId: currentUserId,
            animeId: animeId,
            animeName: animeName,
            imageUrl: imageUrl
        };
        
        // Send to API
        fetch(`http://localhost:5000/api/likes/${isCurrentlyLiked ? 'unlike' : 'like'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(likeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update like status');
            }
            return response.json();
        })
        .then(data => {
            console.log('Like status updated:', data);
        })
        .catch(error => {
            console.error('Error updating like status:', error);
            
            // Revert UI changes on error
            if (isCurrentlyLiked) {
                likedAnimeIds.push(animeId);
                buttonElement.classList.add('liked');
                
                if (isDetailButton) {
                    buttonElement.textContent = '❤️ Favorite';
                } else {
                    buttonElement.innerHTML = '❤️';
                }
            } else {
                likedAnimeIds = likedAnimeIds.filter(id => id !== animeId);
                buttonElement.classList.remove('liked');
                
                if (isDetailButton) {
                    buttonElement.textContent = '🤍 Add to Favorites';
                } else {
                    buttonElement.innerHTML = '🤍';
                }
            }
            
            alert('Error updating favorites: ' + error.message);
        });
    };
    
    // Initialize like buttons when new cards are added to the DOM
    // Set up a MutationObserver to watch for dynamically added cards
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check for new cards and update like buttons
                updateLikeButtons();
                updateDetailPageLikeButton();
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initialize like buttons on page load
    updateLikeButtons();
    updateDetailPageLikeButton();
});