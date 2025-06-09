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

// Workout Data
const workoutData = {
    cardio: {
        name: "Cardio Blast",
        exercises: [
            { name: "Jumping Jacks", sets: 3, reps: 50 },
            { name: "High Knees", sets: 3, reps: 30 },
            { name: "Mountain Climbers", sets: 3, reps: 40 },
            { name: "Burpees", sets: 3, reps: 15 },
            { name: "Jump Rope", sets: 3, reps: 100 }
        ]
    },
    strength: {
        name: "Strength Training",
        exercises: [
            { name: "Push-ups", sets: 3, reps: 15 },
            { name: "Squats", sets: 3, reps: 20 },
            { name: "Lunges", sets: 3, reps: 15 },
            { name: "Plank", sets: 3, reps: 30 },
            { name: "Dumbbell Rows", sets: 3, reps: 12 }
        ]
    },
    yoga: {
        name: "Yoga Flow",
        exercises: [
            { name: "Sun Salutation", sets: 3, reps: 1 },
            { name: "Warrior Pose", sets: 2, reps: 30 },
            { name: "Tree Pose", sets: 2, reps: 30 },
            { name: "Downward Dog", sets: 3, reps: 30 },
            { name: "Child's Pose", sets: 2, reps: 30 }
        ]
    },
    hiit: {
        name: "HIIT Workout",
        exercises: [
            { name: "Sprint in Place", sets: 4, reps: 30 },
            { name: "Jump Squats", sets: 4, reps: 20 },
            { name: "Push-up to Plank", sets: 4, reps: 15 },
            { name: "Mountain Climbers", sets: 4, reps: 30 },
            { name: "Rest", sets: 4, reps: 30 }
        ]
    }
};

// Nutrition Data
const nutritionData = {
    mealPlans: {
        balanced: {
            breakfast: [
                { name: "Oatmeal with Berries", calories: 350, protein: 12 },
                { name: "Greek Yogurt with Honey", calories: 200, protein: 15 },
                { name: "Whole Grain Toast with Avocado", calories: 250, protein: 8 }
            ],
            lunch: [
                { name: "Grilled Chicken Salad", calories: 400, protein: 30 },
                { name: "Quinoa Bowl with Vegetables", calories: 350, protein: 15 },
                { name: "Turkey Wrap with Hummus", calories: 450, protein: 25 }
            ],
            dinner: [
                { name: "Baked Salmon with Sweet Potato", calories: 500, protein: 35 },
                { name: "Lean Beef Stir-Fry", calories: 450, protein: 30 },
                { name: "Vegetable Pasta with Tofu", calories: 400, protein: 20 }
            ],
            snacks: [
                { name: "Mixed Nuts", calories: 200, protein: 8 },
                { name: "Apple with Almond Butter", calories: 250, protein: 6 },
                { name: "Protein Smoothie", calories: 300, protein: 20 }
            ]
        },
        highProtein: {
            breakfast: [
                { name: "Protein Pancakes", calories: 400, protein: 25 },
                { name: "Egg White Omelette", calories: 300, protein: 30 },
                { name: "Protein Shake with Banana", calories: 350, protein: 35 }
            ],
            lunch: [
                { name: "Grilled Chicken Breast with Rice", calories: 500, protein: 40 },
                { name: "Tuna Salad with Whole Grain Bread", calories: 450, protein: 35 },
                { name: "Protein Bowl with Quinoa", calories: 400, protein: 30 }
            ],
            dinner: [
                { name: "Steak with Vegetables", calories: 600, protein: 45 },
                { name: "Baked Fish with Brown Rice", calories: 500, protein: 40 },
                { name: "Chicken Stir-Fry with Tofu", calories: 550, protein: 35 }
            ],
            snacks: [
                { name: "Protein Bar", calories: 250, protein: 20 },
                { name: "Greek Yogurt with Protein Powder", calories: 300, protein: 25 },
                { name: "Hard-Boiled Eggs", calories: 200, protein: 15 }
            ]
        },
        vegetarian: {
            breakfast: [
                { name: "Tofu Scramble", calories: 300, protein: 20 },
                { name: "Chia Seed Pudding", calories: 250, protein: 10 },
                { name: "Vegan Protein Smoothie", calories: 350, protein: 25 }
            ],
            lunch: [
                { name: "Lentil Soup with Bread", calories: 400, protein: 20 },
                { name: "Chickpea Salad", calories: 350, protein: 15 },
                { name: "Vegetable Stir-Fry with Tofu", calories: 450, protein: 25 }
            ],
            dinner: [
                { name: "Vegetable Curry with Rice", calories: 500, protein: 15 },
                { name: "Mushroom and Spinach Pasta", calories: 450, protein: 20 },
                { name: "Stuffed Bell Peppers", calories: 400, protein: 15 }
            ],
            snacks: [
                { name: "Hummus with Vegetables", calories: 200, protein: 8 },
                { name: "Trail Mix", calories: 250, protein: 10 },
                { name: "Vegan Protein Bar", calories: 300, protein: 20 }
            ]
        }
    },
    tips: [
        "Stay hydrated by drinking at least 8 glasses of water daily",
        "Include a variety of colorful vegetables in your meals",
        "Choose whole grains over refined grains",
        "Limit processed foods and added sugars",
        "Eat mindfully and listen to your body's hunger cues",
        "Plan your meals ahead to make healthy choices easier",
        "Include protein in every meal to support muscle growth",
        "Don't skip breakfast - it kickstarts your metabolism",
        "Practice portion control to maintain a healthy weight",
        "Get enough sleep to support your fitness goals"
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
