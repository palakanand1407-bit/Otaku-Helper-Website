document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('.comment-form');
    const commentText = document.getElementById('commentText');
    const postCommentBtn = document.getElementById('postComment');
    const commentsSection = document.getElementById('commentsSection');
    
    // Load all threads when the page loads
    loadAllThreads();
    
    // Like button functionality with server interaction
    function setupLikeButtons() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const threadId = this.closest('.comment-card').dataset.threadId;
                const isLiked = this.classList.contains('liked');
                toggleLike(threadId, this);
            });
        });
    }
    
    // Function to toggle like on the server
    function toggleLike(threadId, likeButton) {
        // Get authentication token from localStorage (assuming user is logged in)
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('You must be logged in to like a thread.');
            return;
        }
        
        // Determine the API action (like or unlike)
        const action = likeButton.classList.contains('liked') ? 'unlike' : 'like';
        
        // Send request to the server
        fetch(`http://localhost:5000/api/threads/${threadId}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to ${action} thread. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Update the UI based on the server response
            updateLikeButton(likeButton, data.liked, data.likeCount);
        })
        .catch(error => {
            console.error(`Error ${action}ing thread:`, error);
            alert(`Error: ${error.message}`);
        });
    }
    
    // Function to update the like button UI
    function updateLikeButton(button, isLiked, likeCount) {
        const icon = button.querySelector('i');
        const countSpan = button.querySelector('span');
        
        if (isLiked) {
            button.classList.add('liked');
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            button.classList.remove('liked');
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        
        // Update the like count
        countSpan.textContent = likeCount;
    }
    
    // Function to check if user has already liked a thread
    function checkUserLikes(threads) {
        const userId = localStorage.getItem('userId');
        
        if (userId) {
            threads.forEach(thread => {
                thread.userHasLiked = thread.likedBy && thread.likedBy.includes(userId);
            });
        }
        
        return threads;
    }
    
    // Function to load all threads from the API
    function loadAllThreads() {
        commentsSection.innerHTML = '<div class="loading">Loading threads...</div>';
        
        fetch('http://localhost:5000/api/threads')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(threads => {
                if (!threads || threads.length === 0) {
                    commentsSection.innerHTML = '<div class="error">No threads found. Be the first to post!</div>';
                    return;
                }
                
                // Check user likes
                threads = checkUserLikes(threads);
                
                // Display the threads
                commentsSection.innerHTML = '';
                threads.forEach(thread => {
                    const threadElement = createThreadElement(thread);
                    commentsSection.appendChild(threadElement);
                });
                
                // Setup like buttons after adding threads to DOM
                setupLikeButtons();
            })
            .catch(error => {
                console.error('Error fetching threads:', error);
                commentsSection.innerHTML = `<div class="error">Error: ${error.message}<br>Make sure your backend server is running at http://localhost:5000</div>`;
            });
    }
    
    // Post new comment functionality
    postCommentBtn.addEventListener('click', function() {
        const content = commentText.value.trim();
        
        if (content) {
            // Get authentication token from localStorage (assuming user is logged in)
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('You must be logged in to post a comment.');
                return;
            }
            
            // Show loading state
            postCommentBtn.disabled = true;
            postCommentBtn.textContent = 'Posting...';
            
            // Post the thread to the API
            fetch('http://localhost:5000/api/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to post comment. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(newThread => {
                // Clear the input
                commentText.value = '';
                
                // Reload all threads to show the new one
                loadAllThreads();
            })
            .catch(error => {
                console.error('Error posting thread:', error);
                alert(`Error posting comment: ${error.message}`);
            })
            .finally(() => {
                // Reset button state
                postCommentBtn.disabled = false;
                postCommentBtn.textContent = 'Post Comment';
            });
        }
    });
    
    // Function to create a thread element
    function createThreadElement(thread) {
        const threadCard = document.createElement('div');
        threadCard.className = 'comment-card';
        threadCard.dataset.threadId = thread._id;
        
        // Format the date
        const timestamp = new Date(thread.createdAt).toLocaleString();
        
        // Determine if the user has liked this thread
        const likeClass = thread.userHasLiked ? 'liked' : '';
        const heartIcon = thread.userHasLiked ? 'fas' : 'far';
        
        threadCard.innerHTML = `
            <div class="comment-header">
                <div class="user-info">
                    <span class="username">${thread.user ? thread.user.username : 'Anonymous User'}</span>
                    <span class="timestamp">${timestamp}</span>
                </div>
            </div>
            <div class="comment-content">
                <p>${thread.content}</p>
            </div>
            <div class="comment-footer">
                <button class="like-btn ${likeClass}"><i class="${heartIcon} fa-heart"></i> <span>${thread.likes || 0}</span></button>
            </div>
        `;
        
        // Add edit and delete buttons if the thread belongs to the current user
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');
        
        if (token && currentUserId && thread.user && thread.user._id === currentUserId) {
            const footerDiv = threadCard.querySelector('.comment-footer');
            
            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener('click', () => editThread(thread._id, thread.content));
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', () => deleteThread(thread._id));
            
            footerDiv.prepend(deleteButton);
            footerDiv.prepend(editButton);
        }
        
        return threadCard;
    }
    
    // Function to edit a thread
    function editThread(threadId, currentContent) {
        const newContent = prompt('Edit your thread:', currentContent);
        
        if (newContent && newContent !== currentContent) {
            const token = localStorage.getItem('token');
            
            fetch(`http://localhost:5000/api/threads/${threadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newContent })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to update thread. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Reload all threads to show the updated one
                loadAllThreads();
            })
            .catch(error => {
                console.error('Error updating thread:', error);
                alert(`Error updating thread: ${error.message}`);
            });
        }
    }
    
    // Function to delete a thread
    function deleteThread(threadId) {
        if (confirm('Are you sure you want to delete this thread?')) {
            const token = localStorage.getItem('token');
            
            fetch(`http://localhost:5000/api/threads/${threadId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete thread. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                // Reload all threads
                loadAllThreads();
            })
            .catch(error => {
                console.error('Error deleting thread:', error);
                alert(`Error deleting thread: ${error.message}`);
            });
        }
    }

    // Handle random anime link
    document.getElementById('randomAnimeLink')?.addEventListener('click', function(e) {
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
            // Store the anime data in localStorage for use on the details page
            localStorage.setItem('randomAnime', JSON.stringify(anime));
            
            // Redirect to the anime details page
            window.location.href = `anime-details.html?id=random`;
        })
        .catch(error => {
            console.error('Error fetching random anime:', error);
            alert('Failed to get a random anime. Please try again.');
        })
        .finally(() => {
            // Reset cursor
            document.body.style.cursor = 'default';
        });
}