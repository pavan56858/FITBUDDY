// Global variables
let timerInterval;
let seconds = 0;
let isTimerRunning = false;
let currentExerciseIndex = 0;
let currentChallenge = null;
let totalChallengeTime = 0;
let recognition;
let synthesis = window.speechSynthesis;

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
        document.getElementById('timerMode').textContent = `Current: ${exercise}`;
        
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
function startWorkout() {
    const currentWorkout = document.getElementById('todayWorkout');
    currentWorkout.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57)';
    speakText("Alright! Let's start your workout! Remember to maintain proper form and listen to your body. You've got this!");
    startTimer();
    
    // Update stats
    const workoutsCompleted = document.getElementById('workoutsCompleted');
    workoutsCompleted.textContent = parseInt(workoutsCompleted.textContent) + 1;
    
    addMessageToChat("Workout started! Remember to stay hydrated and push through! 💪", 'ai');
}

function selectWorkout(type) {
    const workout = workoutData[type];
    const todayWorkout = document.getElementById('todayWorkout');
    
    todayWorkout.innerHTML = `
        <h4>${workout.name}</h4>
        <div class="exercise-list">
            ${workout.exercises.map(exercise => `<div class="exercise-item">${exercise}</div>`).join('')}
        </div>
        <button class="control-btn" onclick="startWorkout()">Start Workout</button>
    `;
    
    speakText(`Great choice! I've loaded the ${workout.name} workout for you. Ready to get started?`);
    addMessageToChat(`${workout.name} workout selected! This is going to be an amazing session! 🚀`, 'ai');
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
                    ${exercise}
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
}

// Start the app
initializeApp(); 