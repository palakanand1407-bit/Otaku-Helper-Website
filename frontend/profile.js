document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email'); // Add this line to get email
    
    if (!token || !username) {
        // Not logged in, redirect to signup page
        alert('Please log in to view your profile');
        window.location.href = 'signup.html'; // Redirect to signup page instead of index.html
        return;
    }
    
    // DOM Elements
    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const currentAvatar = document.getElementById('currentAvatar');
    const avatarModal = document.getElementById('avatarModal');
    const closeModal = document.getElementById('closeModal');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    
    // Update profile information
    usernameElement.textContent = username || 'Otaku User';
    emailElement.textContent = email || 'animefan@otakuhelper.com'; // Uncommented this line
    
    // Load saved avatar if exists
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        currentAvatar.src = savedAvatar;
    }
    
    // Open modal when avatar is clicked
    avatarWrapper.addEventListener('click', function() {
        avatarModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal when X button is clicked
    closeModal.addEventListener('click', function() {
        avatarModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside the modal content
    avatarModal.addEventListener('click', function(e) {
        if (e.target === avatarModal) {
            avatarModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Change avatar when an option is selected
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newAvatar = this.querySelector('img').src;
            currentAvatar.src = newAvatar;
            
            // Save the selected avatar to localStorage
            localStorage.setItem('userAvatar', newAvatar);
            
            // Add animation effect
            currentAvatar.classList.add('fade-in');
            setTimeout(() => {
                currentAvatar.classList.remove('fade-in');
            }, 500);
            
            // Close the modal
            avatarModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Feedback to user
            console.log('Avatar updated and saved!');
        });
    });
});

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('email'); // Add this line to remove email on logout
    // Don't remove the avatar - we'll keep it for when they log back in
    // localStorage.removeItem('userAvatar');
    
    alert('You have been logged out successfully.');
    window.location.href = 'index.html'; // Redirect to homepage or login page
}

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