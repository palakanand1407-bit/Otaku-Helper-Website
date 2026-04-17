document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeModal = document.querySelector('.close-modal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const submitLogin = document.getElementById('submitLogin');
    const submitRegister = document.getElementById('submitRegister');
    const commentForm = document.querySelector('.comment-form');
    const loginPrompt = document.getElementById('loginPrompt');
    const loginLink = document.getElementById('loginLink');
    const postCommentBtn = document.getElementById('postComment');
    
    // Check if user is logged in
    function checkAuth() {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (token) {
            // User is logged in
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            
            // Update user avatar with username initial
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                // You can update this to use a real avatar if you have one
                userAvatar.alt = username || 'User';
            }
            
            // Enable comment form
            if (postCommentBtn) postCommentBtn.style.display = 'inline-block';
            if (loginPrompt) loginPrompt.style.display = 'none';
        } else {
            // User is not logged in
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            
            // Disable comment form
            if (postCommentBtn) postCommentBtn.style.display = 'none';
            if (loginPrompt) loginPrompt.style.display = 'block';
        }
    }
    
    // Run auth check on page load
    checkAuth();
    
    // Modal controls
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            authModal.style.display = 'block';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            authModal.style.display = 'block';
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            checkAuth();
            alert('You have been logged out.');
            
            // Reload threads to update UI
            if (typeof loadAllThreads === 'function') {
                loadAllThreads();
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    // Click outside to close
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Switch between login and register forms
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }
    
    // Login functionality
    if (submitLogin) {
        submitLogin.addEventListener('click', function() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }
            
            // Send login request
            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed. Please check your credentials.');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('email', data.user.email); 
                
                authModal.style.display = 'none';
                checkAuth();
                
                // Reset form
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                
                // Reload threads to update UI
                if (typeof loadAllThreads === 'function') {
                    loadAllThreads();
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                alert(error.message);
            });
        });
    }
    // Register functionality
    if (submitRegister) {
        submitRegister.addEventListener('click', function() {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            if (!username || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Send register request
            fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed. Email may be already in use.');
                }
                return response.json();
            })
            .then(data => {
                alert('Registration successful! Please log in.');
                
                // Switch to login form
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                
                // Reset form
                document.getElementById('registerUsername').value = '';
                document.getElementById('registerEmail').value = '';
                document.getElementById('registerPassword').value = '';
            })
            .catch(error => {
                console.error('Registration error:', error);
                alert(error.message);
            });
        });
    }
    
    // Login link in prompt
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.style.display = 'block';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to access this page');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Function to get current user info
function getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
}

// Add a logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

