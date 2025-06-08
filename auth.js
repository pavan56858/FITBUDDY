// User authentication and management
class Auth {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    loadUsers() {
        try {
            const usersData = localStorage.getItem('users');
            return usersData ? JSON.parse(usersData) : { users: [] };
        } catch (error) {
            console.error('Error loading users:', error);
            return { users: [] };
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
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
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUser(userData) {
        if (!this.currentUser) return false;
        
        const userIndex = this.users.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            // Update all user data
            this.users.users[userIndex] = { ...this.users.users[userIndex], ...userData };
            this.currentUser = this.users.users[userIndex];
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// Create global auth instance
const auth = new Auth(); 