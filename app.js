// Global variables
let timerInterval;
let seconds = 0;
let isTimerRunning = false;
let currentExerciseIndex = 0;
let currentChallenge = null;
let totalChallengeTime = 0;
let recognition;
let synthesis = window.speechSynthesis;

// Workout plan definitions
const workoutPlans = {
    strength: {
        name: 'Strength Training',
        exercises: [
            { name: 'Push-ups', sets: 3, reps: 12 },
            { name: 'Squats', sets: 3, reps: 15 },
            { name: 'Plank', sets: 3, duration: '30 seconds' },
            { name: 'Dumbbell Rows', sets: 3, reps: 12 }
        ]
    },
    cardio: {
        name: 'Cardio Blast',
        exercises: [
            { name: 'Jumping Jacks', sets: 3, duration: '1 minute' },
            { name: 'Mountain Climbers', sets: 3, duration: '45 seconds' },
            { name: 'High Knees', sets: 3, duration: '1 minute' },
            { name: 'Burpees', sets: 3, reps: 10 }
        ]
    },
    yoga: {
        name: 'Yoga Flow',
        exercises: [
            { name: 'Sun Salutations', sets: 3, duration: '2 minutes' },
            { name: 'Warrior Poses', sets: 2, duration: '1 minute each' },
            { name: 'Tree Pose', sets: 2, duration: '30 seconds each side' },
            { name: 'Child\'s Pose', sets: 1, duration: '2 minutes' }
        ]
    },
    hiit: {
        name: 'HIIT Workout',
        exercises: [
            { name: 'Sprint in Place', sets: 4, duration: '30 seconds' },
            { name: 'Rest', sets: 4, duration: '15 seconds' },
            { name: 'Jump Squats', sets: 4, duration: '30 seconds' },
            { name: 'Rest', sets: 4, duration: '15 seconds' }
        ]
    }
};

let currentWorkoutPlan = 'strength';
let workoutTimer = null;
let workoutStartTime = null;
let workoutDuration = 0;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

// Event listeners
document.getElementById('listenBtn').addEventListener('click', startListening);
document.getElementById('speakBtn').addEventListener('click', speakMotivation);
document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);
document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Timer functions
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById('startTimer').style.opacity = '0.5';
        
        // If we're in a challenge, start the exercise timer
        if (currentChallenge) {
            startExerciseTimer();
        }
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        isTimerRunning = false;
        clearInterval(timerInterval);
        document.getElementById('startTimer').style.opacity = '1';
    }
}

function resetTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    seconds = 0;
    currentExerciseIndex = 0;
    updateTimerDisplay();
    updateTimerProgress(0);
    document.getElementById('startTimer').style.opacity = '1';
}

function updateTimer() {
    seconds++;
    updateTimerDisplay();
    
    if (currentChallenge) {
        updateTimerProgress((seconds / totalChallengeTime) * 100);
        
        // Check if we need to move to the next exercise
        const currentExercise = currentChallenge.exercises[currentExerciseIndex];
        const exerciseTime = getExerciseTime(currentExercise);
        
        if (seconds >= exerciseTime) {
            moveToNextExercise();
        }
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('workoutTimer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerProgress(percentage) {
    document.getElementById('timerProgress').style.width = `${percentage}%`;
}

function getExerciseTime(exercise) {
    // Extract time from exercise string (e.g., "Jumping Jacks - 45 seconds")
    const timeMatch = exercise.match(/(\d+)\s*seconds/);
    return timeMatch ? parseInt(timeMatch[1]) : 0;
}

function startExerciseTimer() {
    if (currentChallenge && currentExerciseIndex < currentChallenge.exercises.length) {
        const exercise = currentChallenge.exercises[currentExerciseIndex];
        const exerciseTime = getExerciseTime(exercise);
        
        // Update timer mode display
        document.getElementById('timerMode').textContent = `Current: ${exercise.name}`;
        
        // Calculate total challenge time if not already set
        if (totalChallengeTime === 0) {
            totalChallengeTime = currentChallenge.exercises.reduce((total, ex) => 
                total + getExerciseTime(ex), 0);
        }
    }
}

function moveToNextExercise() {
    if (currentChallenge) {
        currentExerciseIndex++;
        
        if (currentExerciseIndex < currentChallenge.exercises.length) {
            startExerciseTimer();
        } else {
            // Challenge completed
            completeChallenge();
        }
    }
}

// Voice functions
function startListening() {
    if (recognition) {
        const btn = document.getElementById('listenBtn');
        btn.classList.add('listening');
        btn.textContent = '🎤 Listening...';
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            addMessageToChat(transcript, 'user');
            processVoiceCommand(transcript);
        };
        
        recognition.onend = function() {
            btn.classList.remove('listening');
            btn.textContent = '🎤 Talk to Coach';
        };
    } else {
        alert('Voice recognition not supported in this browser');
    }
}

function speakMotivation() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    speakText(quote);
    document.getElementById('coachMessage').textContent = quote;
    animateCoach();
}

function speakText(text) {
    if (synthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        synthesis.speak(utterance);
    }
}

function animateCoach() {
    const avatar = document.getElementById('coachAvatar');
    avatar.style.transform = 'scale(1.2)';
    setTimeout(() => {
        avatar.style.transform = 'scale(1)';
    }, 300);
}

// Chat functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        addMessageToChat(message, 'user');
        input.value = '';
        processUserMessage(message);
    }
}

function addMessageToChat(message, sender) {
    const chatArea = document.getElementById('chatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Nutrition functions
function showNutritionPlan(planType) {
    const plan = nutritionData.mealPlans[planType];
    const nutritionPlan = document.getElementById('nutritionPlan');
    
    // Update active tab
    document.querySelectorAll('.nutrition-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.nutrition-tab[onclick="showNutritionPlan('${planType}')"]`).classList.add('active');
    
    // Generate meal plan HTML
    let html = `<h4>${plan.name}</h4>`;
    
    for (const [mealType, meals] of Object.entries(plan.meals)) {
        html += `
            <div class="meal-category">
                <h5>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h5>
                ${meals.map(meal => `<div class="meal-item">${meal}</div>`).join('')}
            </div>
        `;
    }
    
    nutritionPlan.innerHTML = html;
}

function displayNutritionTips() {
    const tipsContainer = document.getElementById('nutritionTips');
    tipsContainer.innerHTML = nutritionData.nutritionTips
        .map(tip => `<div class="tip-item">${tip}</div>`)
        .join('');
}

function displayWorkoutSnacks() {
    const preWorkoutList = document.getElementById('preWorkoutSnacks');
    const postWorkoutList = document.getElementById('postWorkoutSnacks');
    
    preWorkoutList.innerHTML = nutritionData.preWorkoutSnacks
        .map(snack => `<li>${snack}</li>`)
        .join('');
    
    postWorkoutList.innerHTML = nutritionData.postWorkoutSnacks
        .map(snack => `<li>${snack}</li>`)
        .join('');
}

// Update processUserMessage function to include nutrition-related responses
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = "";
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivate')) {
        response = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    } else if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
        response = "I'd recommend starting with our Full Body Strength workout! It's perfect for building overall fitness. Want me to guide you through it?";
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
        response = "I hear you! Remember, feeling tired is normal. Take a deep breath, hydrate, and remember why you started. You're stronger than you feel! 💪";
    } else if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
        response = "I've added a comprehensive nutrition guide to help you! Check out the different meal plans and nutrition tips. Would you like me to explain any specific diet plan? 🥗";
    } else if (lowerMessage.includes('meal') || lowerMessage.includes('food')) {
        response = "I can help you with meal suggestions! We have balanced, high-protein, and vegetarian meal plans. Which one interests you the most? 🍽️";
    } else if (lowerMessage.includes('pre-workout') || lowerMessage.includes('before workout')) {
        response = "Check out our pre-workout snack suggestions! They're designed to give you the energy you need for your workout. 🍎";
    } else if (lowerMessage.includes('post-workout') || lowerMessage.includes('after workout')) {
        response = "After your workout, it's important to refuel! Take a look at our post-workout snack suggestions to help with recovery. 🥤";
    } else if (lowerMessage.includes('rest') || lowerMessage.includes('recovery')) {
        response = "Recovery is just as important as training! Make sure you're getting 7-9 hours of sleep and taking at least one full rest day per week. Your muscles grow during rest! 😴";
    } else {
        response = "That's a great point! Remember, every step forward is progress. I'm here to support you on your fitness journey. What's your main goal right now? 🎯";
    }
    
    setTimeout(() => {
        addMessageToChat(response, 'ai');
        speakText(response);
    }, 1000);
}

function processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('start workout') || lowerCommand.includes('begin workout')) {
        startWorkout();
        addMessageToChat("Starting your workout now! Let's crush it! 🔥", 'ai');
    } else if (lowerCommand.includes('start timer')) {
        startTimer();
        addMessageToChat("Timer started! Time to work! ⏰", 'ai');
    } else if (lowerCommand.includes('stop timer') || lowerCommand.includes('pause timer')) {
        pauseTimer();
        addMessageToChat("Timer paused. Take a breather if you need it! 😌", 'ai');
    } else {
        processUserMessage(command);
    }
}

// Workout functions
function selectWorkoutPlan(plan) {
    if (!canStartNewWorkout()) {
        return;
    }

    currentWorkoutPlan = plan;
    const workoutSelection = document.getElementById('workoutSelection');
    const workoutDetails = document.getElementById('workoutDetails');
    const selectedWorkoutName = document.getElementById('selectedWorkoutName');
    const workoutExercises = document.getElementById('workoutExercises');

    // Update selected workout name
    selectedWorkoutName.textContent = workoutPlans[plan].name;

    // Clear previous exercises
    workoutExercises.innerHTML = '';

    // Add new exercises
    workoutPlans[plan].exercises.forEach(exercise => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise-item';
        exerciseElement.innerHTML = `
            <span class="exercise-name">${exercise.name}</span>
            <span class="exercise-details">
                ${exercise.sets} sets
                ${exercise.reps ? `× ${exercise.reps} reps` : ''}
                ${exercise.duration ? `(${exercise.duration})` : ''}
            </span>
        `;
        workoutExercises.appendChild(exerciseElement);
    });

    // Show workout details
    workoutSelection.style.display = 'none';
    workoutDetails.style.display = 'block';

    // Reset workout status
    document.getElementById('workoutStatus').textContent = '';
    document.getElementById('nextWorkoutTime').textContent = '';
    document.getElementById('startWorkoutBtn').style.display = 'block';
    document.getElementById('completeWorkoutBtn').style.display = 'none';
}

function canStartNewWorkout() {
    const user = auth.getCurrentUser();
    if (!user) return false;

    if (!user.lastWorkoutTime) return true;

    const lastWorkout = new Date(user.lastWorkoutTime);
    const now = new Date();
    const hoursSinceLastWorkout = (now - lastWorkout) / (1000 * 60 * 60);

    if (hoursSinceLastWorkout < 24) {
        alert('You can start a new workout after 24 hours from your last workout');
        return false;
    }

    return true;
}

function showNextWorkoutTime() {
    const user = auth.getCurrentUser();
    if (!user || !user.lastWorkoutTime) return;

    const lastWorkout = new Date(user.lastWorkoutTime);
    const nextWorkout = new Date(lastWorkout.getTime() + (24 * 60 * 60 * 1000));
    const now = new Date();

    if (nextWorkout > now) {
        const timeLeft = nextWorkout - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('nextWorkoutTime').textContent = 
            `Next workout available in ${hours}h ${minutes}m`;
    }
}

function startWorkout() {
    if (!auth.getCurrentUser()) {
        alert('Please log in to start a workout');
        return;
    }

    if (!canStartNewWorkout()) {
        return;
    }

    workoutStartTime = new Date();
    workoutDuration = 0;
    
    // Start timer
    workoutTimer = setInterval(() => {
        workoutDuration++;
        const minutes = Math.floor(workoutDuration / 60);
        const seconds = workoutDuration % 60;
        document.getElementById('workoutStatus').textContent = 
            `Workout in progress... ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    document.getElementById('startWorkoutBtn').style.display = 'none';
    document.getElementById('completeWorkoutBtn').style.display = 'block';
    document.getElementById('workoutStatus').className = 'workout-status in-progress';
}

function completeWorkout() {
    if (!workoutStartTime) return;

    const user = auth.getCurrentUser();
    if (!user) return;

    // Stop the timer
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - workoutStartTime) / 1000); // Duration in seconds

    // Initialize user progress if it doesn't exist
    if (typeof user.completedWorkouts === 'undefined') user.completedWorkouts = 0;
    if (typeof user.points === 'undefined') user.points = 0;
    if (typeof user.streak === 'undefined') user.streak = 0;

    // Update user progress
    user.completedWorkouts += 1;
    user.points += 10;
    user.lastWorkoutTime = endTime.toISOString();
    user.rank = Math.max(1, 100000 - user.points);

    // Update streak
    const lastWorkout = user.lastWorkoutTime ? new Date(user.lastWorkoutTime) : null;
    const today = new Date();
    if (!lastWorkout || (today - lastWorkout) / (1000 * 60 * 60 * 24) > 1) {
        user.streak = 1;
    } else {
        user.streak += 1;
    }

    // Update weekly progress
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    user.weeklyProgress = user.weeklyProgress || {};
    user.weeklyProgress[weekKey] = (user.weeklyProgress[weekKey] || 0) + 1;

    // Save user data
    auth.updateUser(user);

    // Immediately update the progress counters
    document.getElementById('workoutsCompleted').textContent = user.completedWorkouts;
    document.getElementById('caloriesBurned').textContent = (user.completedWorkouts * 300).toLocaleString();
    document.getElementById('streakDays').textContent = user.streak;

    // Update weekly progress bar
    const weeklyWorkouts = user.weeklyProgress[weekKey] || 0;
    const progress = (weeklyWorkouts / 5) * 100;
    document.getElementById('weeklyProgress').style.width = `${Math.min(progress, 100)}%`;

    // Update UI
    document.getElementById('workoutStatus').textContent = 'Workout completed!';
    document.getElementById('workoutStatus').className = 'workout-status completed';
    document.getElementById('startWorkoutBtn').style.display = 'block';
    document.getElementById('completeWorkoutBtn').style.display = 'none';
    
    showNextWorkoutTime();

    // Reset workout state
    workoutStartTime = null;
    workoutDuration = 0;

    // Show completion message
    alert(`Workout completed! You've earned 10 points.\nNext workout available in 24 hours.`);

    // Reset to workout selection after 3 seconds
    setTimeout(() => {
        document.getElementById('workoutDetails').style.display = 'none';
        document.getElementById('workoutSelection').style.display = 'block';
        document.getElementById('workoutStatus').textContent = '';
    }, 3000);
}

// Function to update user progress display
function updateUserProgress() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Initialize counters if they don't exist
    if (typeof user.completedWorkouts === 'undefined') user.completedWorkouts = 0;
    if (typeof user.streak === 'undefined') user.streak = 0;

    // Update stats
    document.getElementById('workoutsCompleted').textContent = user.completedWorkouts;
    document.getElementById('caloriesBurned').textContent = (user.completedWorkouts * 300).toLocaleString();
    document.getElementById('streakDays').textContent = user.streak;

    // Update weekly progress
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    const weeklyWorkouts = user.weeklyProgress?.[weekKey] || 0;
    const progress = (weeklyWorkouts / 5) * 100;
    document.getElementById('weeklyProgress').style.width = `${Math.min(progress, 100)}%`;
}

// Challenge System Functions
function startChallenge() {
    const challengeCard = document.getElementById('dailyChallenge');
    currentChallenge = challengeData.dailyChallenges[0]; // Get today's challenge
    
    // Reset timer state
    resetTimer();
    totalChallengeTime = 0;
    currentExerciseIndex = 0;
    
    // Update UI to show challenge in progress
    challengeCard.innerHTML = `
        <div class="challenge-title">${currentChallenge.title}</div>
        <div class="challenge-description">${currentChallenge.description}</div>
        <div class="exercise-list">
            ${currentChallenge.exercises.map((exercise, index) => 
                `<div class="exercise-item ${index === 0 ? 'active' : ''}" id="exercise-${index}">
                    ${exercise.name}
                </div>`
            ).join('')}
        </div>
        <div class="challenge-progress">
            <div class="progress-bar">
                <div class="progress-fill" id="challengeProgress" style="width: 0%"></div>
            </div>
        </div>
    `;
    
    startTimer();
}

function completeChallenge() {
    if (!currentChallenge) return;
    
    const totalPoints = document.getElementById('totalPoints');
    const challengeStreak = document.getElementById('challengeStreak');
    
    // Update points
    const pointsEarned = currentChallenge.points + currentChallenge.streakBonus;
    totalPoints.textContent = parseInt(totalPoints.textContent) + pointsEarned;
    
    // Update streak
    challengeStreak.textContent = parseInt(challengeStreak.textContent) + 1;
    
    // Reset timer and challenge state
    resetTimer();
    currentChallenge = null;
    totalChallengeTime = 0;
    
    // Reset challenge card
    updateDailyChallenge();
    
    // Check for achievements
    checkAchievements();
}

function updateDailyChallenge() {
    const challengeCard = document.getElementById('dailyChallenge');
    const currentChallenge = challengeData.dailyChallenges[0];
    
    challengeCard.innerHTML = `
        <div class="challenge-title">${currentChallenge.title}</div>
        <div class="challenge-description">${currentChallenge.description}</div>
        <div class="challenge-rewards">
            <span>🎯 Points: ${currentChallenge.points}</span>
            <span>⭐ Streak Bonus: +${currentChallenge.streakBonus}</span>
        </div>
        <button class="control-btn" onclick="startChallenge()">Accept Challenge</button>
    `;
}

function displayUpcomingChallenges() {
    const upcomingList = document.getElementById('upcomingChallenges');
    
    upcomingList.innerHTML = challengeData.upcomingChallenges.map(challenge => `
        <div class="upcoming-challenge-card">
            <div class="challenge-title">${challenge.title}</div>
            <div class="challenge-description">${challenge.description}</div>
            <div class="challenge-rewards">
                <span>🎯 Points: ${challenge.points}</span>
                <span>⭐ Streak Bonus: +${challenge.streakBonus}</span>
            </div>
            <div class="challenge-date">${new Date(challenge.date).toLocaleDateString()}</div>
        </div>
    `).join('');
}

function checkAchievements() {
    const streak = parseInt(document.getElementById('challengeStreak').textContent);
    const totalPoints = parseInt(document.getElementById('totalPoints').textContent);
    
    // Check for streak achievements
    if (streak === 7) {
        unlockAchievement(challengeData.achievements[0]);
    }
    
    // Check for point milestones
    if (totalPoints >= 1000) {
        unlockAchievement({
            id: 4,
            title: "Point Collector",
            description: "Reach 1,000 total points",
            points: 200,
            icon: "💰"
        });
    }
}

function unlockAchievement(achievement) {
    speakText(`Achievement Unlocked: ${achievement.title}! ${achievement.description}`);
    
    // Show achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-points">+${achievement.points} points</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Update initializeApp function
function initializeApp() {
    // Animate elements on load
    setTimeout(() => {
        document.querySelector('.header').style.animation = 'fadeInDown 1s ease-out';
    }, 100);
    
    // Welcome message
    setTimeout(() => {
        speakText("Welcome to FitBuddy! Ready to take on today's fitness challenge?");
    }, 2000);
    
    // Initialize challenge system
    updateDailyChallenge();
    displayUpcomingChallenges();
    
    // Random motivational updates
    setInterval(() => {
        const messages = [
            "Ready for today's challenge? 💪",
            "Your streak is looking great! Keep it up! 🔥",
            "Time to crush your fitness goals! 🎯",
            "Every challenge completed is a step closer to your goals! 🌟",
            "You're doing amazing! Ready for the next challenge? 🏆"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('coachMessage').textContent = randomMessage;
    }, 300000); // Every 5 minutes

    // Initialize progress display
    updateUserProgress();
}

// Start the app
initializeApp();

// Auth handling functions
function toggleAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    
    // Clear any existing messages when switching forms
    clearAuthMessages();
}

function clearAuthMessages() {
    const messages = document.querySelectorAll('.auth-message');
    messages.forEach(msg => msg.remove());
}

function showAuthMessage(formId, message, isError = false) {
    clearAuthMessages();
    const form = document.getElementById(formId);
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    form.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function checkUsernameAvailability() {
    const usernameInput = document.getElementById('registerUsername');
    const username = usernameInput.value.trim();
    
    if (username.length < 3) {
        showAuthMessage('registerForm', 'Username must be at least 3 characters long', true);
        return;
    }
    
    if (auth.isUsernameAvailable(username)) {
        showAuthMessage('registerForm', 'Username is available! ✅', false);
    } else {
        showAuthMessage('registerForm', 'Username is already taken ❌', true);
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showAuthMessage('loginForm', 'Please enter both username and password', true);
        return;
    }
    
    const result = auth.login(username, password);
    if (result.success) {
        showMainContent();
        updateUserProgress();
        initializeApp();
    } else {
        showAuthMessage('loginForm', result.message, true);
    }
}

function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !password) {
        showAuthMessage('registerForm', 'Please enter both username and password', true);
        return;
    }
    
    if (username.length < 3) {
        showAuthMessage('registerForm', 'Username must be at least 3 characters long', true);
        return;
    }
    
    if (!auth.isUsernameAvailable(username)) {
        showAuthMessage('registerForm', 'Username is already taken', true);
        return;
    }
    
    const result = auth.register(username, password);
    if (result.success) {
        // Automatically log in after registration
        const loginResult = auth.login(username, password);
        if (loginResult.success) {
            showMainContent();
            updateUserProgress();
            initializeApp();
        }
    } else {
        showAuthMessage('registerForm', result.message, true);
    }
}

function handleLogout() {
    auth.logout();
    showAuthForms();
}

function showMainContent() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    // Scroll to top of the page
    window.scrollTo(0, 0);
}

function showAuthForms() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    // Clear form fields
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
}

function updateUserProgress() {
    const user = auth.getCurrentUser();
    if (user) {
        document.getElementById('totalPoints').textContent = user.progress.points;
        document.getElementById('rank').textContent = '#' + user.progress.rank;
        document.getElementById('userGreeting').textContent = user.username;
    }
}

// Check if user is already logged in
function checkAuth() {
    const user = auth.getCurrentUser();
    if (user) {
        showMainContent();
        updateUserProgress();
        initializeApp();
    } else {
        showAuthForms();
    }
}

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Initialize workout display when page loads
document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getCurrentUser();
    if (user) {
        showNextWorkoutTime();
    }
}); 
