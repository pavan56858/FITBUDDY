// User authentication and management
class Auth {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
    }

    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : { users: [] };
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    isUsernameAvailable(username) {
        return !this.users.users.some(user => user.username === username);
    }

    register(username, password) {
        if (!username || !password) {
            return { success: false, message: 'Username and password are required' };
        }

        if (!this.isUsernameAvailable(username)) {
            return { success: false, message: 'Username is already taken' };
        }

        const newUser = {
            username,
            password, // In a real app, this should be hashed
            achievements: 0, // Start achievements at zero
            completedWorkouts: 0,
            points: 0,
            rank: 100000,
            streak: 0,
            lastWorkoutTime: null,
            weeklyProgress: {}
        };

        this.users.users.push(newUser);
        this.saveUsers();
        return { success: true, message: 'Registration successful' };
    }

    login(username, password) {
        const user = this.users.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', username);
            // Update user greeting
            const userGreeting = document.getElementById('userGreeting');
            if (userGreeting) {
                userGreeting.textContent = user.username;
            }
            return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid username or password' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const username = localStorage.getItem('currentUser');
            if (username) {
                this.currentUser = this.users.users.find(u => u.username === username);
            }
        }
        return this.currentUser;
    }

    updateUser(userData) {
        const index = this.users.users.findIndex(u => u.username === userData.username);
        if (index !== -1) {
            this.users.users[index] = userData;
            this.currentUser = userData;
            this.saveUsers();
        }
    }
}

// Create global auth instance
const auth = new Auth();

// User data storage
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const authSection = document.getElementById('authSection');
const mainContent = document.getElementById('mainContent');
const userInfo = document.getElementById('userInfo');
const userGreeting = document.getElementById('userGreeting');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

// Check if user is already logged in
function checkAuth() {
    if (currentUser) {
        showMainContent();
    } else {
        showAuthSection();
    }
}

// Show/Hide sections
function showMainContent() {
    authSection.style.display = 'none';
    mainContent.style.display = 'block';
    userInfo.style.display = 'flex';
    userGreeting.textContent = `Welcome, ${currentUser.username}!`;
}

function showAuthSection() {
    authSection.style.display = 'flex';
    mainContent.style.display = 'none';
    userInfo.style.display = 'none';
}

// Toggle between login and register forms
function toggleAuthForms() {
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    loginMessage.textContent = '';
    registerMessage.textContent = '';
}

// Handle login
function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage(loginMessage, 'Please fill in all fields', 'error');
        return;
    }

    if (users[username] && users[username].password === password) {
        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainContent();
        showMessage(loginMessage, 'Login successful!', 'success');
    } else {
        showMessage(loginMessage, 'Invalid username or password', 'error');
    }
}

// Handle registration
function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        showMessage(registerMessage, 'Please fill in all fields', 'error');
        return;
    }

    if (users[username]) {
        showMessage(registerMessage, 'Username already exists', 'error');
        return;
    }

    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    showMessage(registerMessage, 'Registration successful! Please login.', 'success');
    toggleAuthForms();
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthSection();
}

// Show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `auth-message ${type}`;
    setTimeout(() => {
        element.textContent = '';
        element.className = 'auth-message';
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', checkAuth); 
