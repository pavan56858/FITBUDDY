// Global variables
let timerInterval;
let seconds = 0;
let isTimerRunning = false;
let currentExerciseIndex = 0;
let workoutTimer = null;
let workoutStartTime = null;
let workoutDuration = 0;
let recognition;
let synthesis = window.speechSynthesis;

// Workout data
const workoutPlans = {
    strength: {
        name: '💪 Strength Training',
        exercises: [
            { name: 'Push-ups', reps: '3 sets x 12 reps', duration: '5 min' },
            { name: 'Squats', reps: '3 sets x 15 reps', duration: '8 min' },
            { name: 'Deadlifts', reps: '3 sets x 10 reps', duration: '10 min' },
            { name: 'Plank', reps: '3 sets x 45 sec', duration: '5 min' }
        ]
    },
    cardio: {
        name: '🏃 Cardio Blast',
        exercises: [
            { name: 'Jumping Jacks', reps: '4 sets x 30 sec', duration: '5 min' },
            { name: 'High Knees', reps: '4 sets x 30 sec', duration: '5 min' },
            { name: 'Burpees', reps: '3 sets x 10 reps', duration: '8 min' },
            { name: 'Mountain Climbers', reps: '4 sets x 20 reps', duration: '6 min' }
        ]
    },
    yoga: {
        name: '🧘 Yoga Flow',
        exercises: [
            { name: 'Sun Salutation', reps: '5 rounds', duration: '10 min' },
            { name: 'Warrior Pose', reps: '2 min each side', duration: '4 min' },
            { name: 'Tree Pose', reps: '1 min each side', duration: '2 min' },
            { name: 'Savasana', reps: '5 min', duration: '5 min' }
        ]
    },
    hiit: {
        name: '⚡ HIIT Session',
        exercises: [
            { name: 'Sprint Intervals', reps: '8 rounds x 30 sec', duration: '10 min' },
            { name: 'Jump Squats', reps: '4 sets x 15 reps', duration: '6 min' },
            { name: 'Push-up Burpees', reps: '3 sets x 8 reps', duration: '8 min' },
            { name: 'Rest & Stretch', reps: '5 min', duration: '5 min' }
        ]
    }
};

let currentWorkout = null;
let workoutInProgress = false;

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
function selectWorkoutPlan(planType) {
    currentWorkout = workoutPlans[planType];
    document.getElementById('workoutSelection').classList.add('hidden');
    document.getElementById('workoutDetails').classList.remove('hidden');
    
    document.getElementById('selectedWorkoutName').textContent = currentWorkout.name;
    
    const exercisesList = document.getElementById('workoutExercises');
    exercisesList.innerHTML = '';
    
    currentWorkout.exercises.forEach(exercise => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.innerHTML = `
            <div>
                <strong>${exercise.name}</strong><br>
                <small>${exercise.reps}</small>
            </div>
            <div style="color: #667eea; font-weight: 600;">${exercise.duration}</div>
        `;
        exercisesList.appendChild(exerciseDiv);
    });
}

function startWorkout() {
    workoutInProgress = true;
    document.getElementById('startWorkoutBtn').classList.add('hidden');
    document.getElementById('completeWorkoutBtn').classList.remove('hidden');
    
    const statusDiv = document.getElementById('workoutStatus');
    statusDiv.innerHTML = '🔥 Workout in progress... You got this!';
    statusDiv.className = 'workout-status active';
}

function completeWorkout() {
    workoutInProgress = false;
    // Get user object
    let user = auth.getCurrentUser && auth.getCurrentUser();
    if (!user) return;
    // Update stats in user object
    user.completedWorkouts = (user.completedWorkouts || 0) + 1;
    user.streak = (user.streak || 0) + 1;
    user.achievements = (user.achievements || 0) + 1;
    // Save user data
    if (auth.updateUser) auth.updateUser(user);
    // Update UI
    updateUserProgress();
    // Show completion message and next workout time as before
    const statusDiv = document.getElementById('workoutStatus');
    statusDiv.innerHTML = '🎉 Workout completed! Great job!';
    statusDiv.className = 'workout-status';
    statusDiv.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
    statusDiv.style.color = '#155724';
    const nextWorkoutDiv = document.getElementById('nextWorkoutTime');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextWorkoutDiv.innerHTML = `⏰ Next workout: ${tomorrow.toLocaleDateString()}`;
    nextWorkoutDiv.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('completeWorkoutBtn').classList.add('hidden');
        document.getElementById('startWorkoutBtn').classList.remove('hidden');
        document.getElementById('workoutDetails').classList.add('hidden');
        document.getElementById('workoutSelection').classList.remove('hidden');
    }, 3000);
}

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
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    // Scroll to top of the page
    window.scrollTo(0, 0);
}

function showAuthForms() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    // Clear form fields
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
}

// Check if user is already logged in
function checkAuth() {
    const user = auth.getCurrentUser();
    if (user) {
        showMainContent();
        updateUserProgress();
    } else {
        showAuthForms();
    }
}

// Diet Plan Functions
function showDietPlan(planType) {
    console.log('Showing diet plan:', planType);
    const plan = nutritionData.mealPlans[planType];
    if (!plan) {
        console.error('Diet plan not found:', planType);
        return;
    }

    // Update active tab
    document.querySelectorAll('.diet-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase() === planType) {
            tab.classList.add('active');
        }
    });

    // Update meal categories
    const mealCategories = document.querySelectorAll('.meal-category');
    mealCategories.forEach(category => {
        const categoryName = category.querySelector('h4').textContent.toLowerCase();
        const mealItems = category.querySelector('.meal-items');
        const meals = plan[categoryName];
        
        if (meals && mealItems) {
            mealItems.innerHTML = '';
            meals.forEach(meal => {
                const mealElement = document.createElement('div');
                mealElement.className = 'meal-item';
                mealElement.innerHTML = `
                    <div class="meal-name">${meal.name}</div>
                    <div class="nutrition-info">
                        <span>Calories: ${meal.calories}</span>
                        <span>Protein: ${meal.protein}g</span>
                    </div>
                `;
                mealItems.appendChild(mealElement);
            });
        }
    });

    // Update nutrition tips
    const tipsContainer = document.querySelector('.tips-container');
    if (tipsContainer) {
        tipsContainer.innerHTML = '';
        nutritionData.tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip-item';
            tipElement.textContent = tip;
            tipsContainer.appendChild(tipElement);
        });
    }
}

function initializeDietPlan() {
    console.log('Initializing diet plan');
    showDietPlan('balanced');
}

// Initialize diet plan display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    console.log('Nutrition Data:', nutritionData); // Debug log
    
    // Add click event listeners to diet plan buttons
    const dietPlanButtons = document.querySelectorAll('.diet-plan-btn');
    console.log('Found diet plan buttons:', dietPlanButtons.length); // Debug log
    
    dietPlanButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Button clicked:', btn.dataset.plan); // Debug log
            showDietPlan(btn.dataset.plan);
        });
    });
    
    // Show default diet plan
    showDietPlan('balanced');

    // Initialize other features
    checkAuth();
    const user = auth.getCurrentUser();
    if (user) {
        updateUserProgress();
        showNextWorkoutTime();
    }
});

function updateUserProgress() {
    const user = auth.getCurrentUser && auth.getCurrentUser();
    if (!user) return;
    document.getElementById('workoutsCompleted').textContent = user.completedWorkouts || 0;
    document.getElementById('caloriesBurned').textContent = ((user.completedWorkouts || 0) * 250).toLocaleString();
    document.getElementById('streakDays').textContent = user.streak || 0;
    document.getElementById('achievements').textContent = user.achievements || 0;
    // Update weekly progress bar and percentage based on achievements
    const weeklyGoal = 5; // You can adjust this goal as needed
    const progress = Math.min(100, ((user.achievements || 0) / weeklyGoal) * 100);
    document.getElementById('weeklyProgress').style.width = progress + '%';
    // Update the progress text if present
    const progressText = document.querySelector('.progress-bar + p');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}% Complete - You're doing great!`;
    }
} 
