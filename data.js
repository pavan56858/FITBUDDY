// Motivational quotes and responses
const motivationalQuotes = [
    "You're stronger than you think! 💪",
    "Every workout counts towards your goals! 🎯",
    "Push through the discomfort - that's where growth happens! 🔥",
    "You've got this! One rep at a time! 💯",
    "Your future self will thank you for this workout! 🌟",
    "Consistency beats perfection every time! 📈",
    "You're not just building muscle, you're building character! 🏆"
];

const workoutData = {
    cardio: {
        name: "Cardio Blast",
        exercises: [
            "Jumping Jacks - 3 sets x 30 seconds",
            "High Knees - 3 sets x 30 seconds", 
            "Mountain Climbers - 3 sets x 20 reps",
            "Burpees - 3 sets x 10 reps"
        ]
    },
    strength: {
        name: "Strength Training",
        exercises: [
            "Push-ups - 4 sets x 10 reps",
            "Squats - 4 sets x 12 reps",
            "Lunges - 3 sets x 10 each leg",
            "Plank - 3 sets x 45 seconds"
        ]
    },
    yoga: {
        name: "Yoga Flow",
        exercises: [
            "Sun Salutation - 5 rounds",
            "Warrior Pose - Hold 30 seconds each side",
            "Downward Dog - Hold 45 seconds",
            "Child's Pose - Hold 1 minute"
        ]
    },
    hiit: {
        name: "HIIT Training",
        exercises: [
            "Squat Jumps - 4 sets x 15 reps",
            "Push-up to T - 4 sets x 8 reps",
            "Sprint in Place - 4 sets x 20 seconds",
            "Plank Jacks - 4 sets x 12 reps"
        ]
    }
};

const nutritionData = {
    mealPlans: {
        balanced: {
            name: "Balanced Diet Plan",
            meals: {
                breakfast: [
                    "Oatmeal with berries and nuts",
                    "Greek yogurt with honey and granola",
                    "Whole grain toast with avocado and eggs"
                ],
                lunch: [
                    "Grilled chicken salad with mixed vegetables",
                    "Quinoa bowl with roasted vegetables and tofu",
                    "Whole grain wrap with lean protein and vegetables"
                ],
                dinner: [
                    "Baked salmon with sweet potato and greens",
                    "Lean beef stir-fry with brown rice",
                    "Vegetable curry with chickpeas and whole grain rice"
                ],
                snacks: [
                    "Apple with almond butter",
                    "Greek yogurt with berries",
                    "Mixed nuts and seeds",
                    "Carrot sticks with hummus"
                ]
            }
        },
        highProtein: {
            name: "High Protein Diet Plan",
            meals: {
                breakfast: [
                    "Protein smoothie with banana and peanut butter",
                    "Egg white omelet with vegetables",
                    "Cottage cheese with fruit and nuts"
                ],
                lunch: [
                    "Grilled chicken breast with quinoa",
                    "Tuna salad with whole grain crackers",
                    "Turkey and cheese wrap with vegetables"
                ],
                dinner: [
                    "Lean steak with roasted vegetables",
                    "Baked fish with sweet potato",
                    "Chicken stir-fry with brown rice"
                ],
                snacks: [
                    "Protein shake",
                    "Hard-boiled eggs",
                    "Greek yogurt",
                    "Protein bar"
                ]
            }
        },
        vegetarian: {
            name: "Vegetarian Diet Plan",
            meals: {
                breakfast: [
                    "Smoothie bowl with plant-based protein",
                    "Tofu scramble with vegetables",
                    "Overnight oats with chia seeds"
                ],
                lunch: [
                    "Lentil soup with whole grain bread",
                    "Falafel wrap with hummus",
                    "Vegetable and chickpea curry"
                ],
                dinner: [
                    "Stuffed bell peppers with quinoa",
                    "Vegetable stir-fry with tempeh",
                    "Mushroom and spinach pasta"
                ],
                snacks: [
                    "Trail mix with nuts and dried fruits",
                    "Hummus with vegetables",
                    "Fruit and nut bars",
                    "Roasted chickpeas"
                ]
            }
        }
    },
    nutritionTips: [
        "Stay hydrated! Aim for 8-10 glasses of water daily 💧",
        "Include protein in every meal to support muscle recovery 🥩",
        "Eat a variety of colorful vegetables for essential nutrients 🥗",
        "Choose whole grains over refined carbohydrates 🌾",
        "Don't skip meals - maintain regular eating patterns ⏰",
        "Limit processed foods and added sugars 🚫",
        "Include healthy fats like avocados and nuts 🥑",
        "Plan your meals ahead to make healthy choices easier 📝"
    ],
    preWorkoutSnacks: [
        "Banana with almond butter",
        "Greek yogurt with berries",
        "Whole grain toast with honey",
        "Protein smoothie",
        "Trail mix with nuts and dried fruits"
    ],
    postWorkoutSnacks: [
        "Chocolate milk",
        "Protein shake with banana",
        "Greek yogurt with granola",
        "Turkey and cheese wrap",
        "Smoothie with protein powder"
    ]
};

const challengeData = {
    dailyChallenges: [
        {
            id: 1,
            title: "30-Minute HIIT Blast",
            description: "Complete 4 rounds of high-intensity exercises",
            points: 100,
            streakBonus: 20,
            exercises: [
                "Jumping Jacks - 45 seconds",
                "Mountain Climbers - 45 seconds",
                "Burpees - 30 seconds",
                "Rest - 30 seconds",
                "High Knees - 45 seconds",
                "Push-ups - 30 seconds",
                "Plank - 45 seconds",
                "Rest - 30 seconds"
            ]
        },
        {
            id: 2,
            title: "Core Crusher",
            description: "Complete 3 rounds of core-focused exercises",
            points: 80,
            streakBonus: 15,
            exercises: [
                "Plank - 60 seconds",
                "Russian Twists - 45 seconds",
                "Leg Raises - 45 seconds",
                "Rest - 30 seconds",
                "Bicycle Crunches - 45 seconds",
                "Mountain Climbers - 45 seconds",
                "Side Plank - 30 seconds each side",
                "Rest - 30 seconds"
            ]
        },
        {
            id: 3,
            title: "Upper Body Power",
            description: "Complete 4 rounds of upper body exercises",
            points: 90,
            streakBonus: 18,
            exercises: [
                "Push-ups - 45 seconds",
                "Tricep Dips - 45 seconds",
                "Arm Circles - 45 seconds",
                "Rest - 30 seconds",
                "Diamond Push-ups - 30 seconds",
                "Shoulder Taps - 45 seconds",
                "Superman - 45 seconds",
                "Rest - 30 seconds"
            ]
        }
    ],
    upcomingChallenges: [
        {
            id: 4,
            title: "Weekend Warrior",
            description: "Complete a 45-minute full body workout",
            points: 150,
            streakBonus: 30,
            date: "2024-03-20"
        },
        {
            id: 5,
            title: "Flexibility Focus",
            description: "30 minutes of stretching and mobility work",
            points: 70,
            streakBonus: 15,
            date: "2024-03-21"
        },
        {
            id: 6,
            title: "Cardio Endurance",
            description: "Complete a 5K run or equivalent cardio",
            points: 120,
            streakBonus: 25,
            date: "2024-03-22"
        }
    ],
    achievements: [
        {
            id: 1,
            title: "Challenge Champion",
            description: "Complete 7 daily challenges in a row",
            points: 500,
            icon: "🏆"
        },
        {
            id: 2,
            title: "Early Bird",
            description: "Complete 5 morning challenges",
            points: 300,
            icon: "🌅"
        },
        {
            id: 3,
            title: "Weekend Warrior",
            description: "Complete 3 weekend challenges",
            points: 400,
            icon: "⚔️"
        }
    ]
}; 
