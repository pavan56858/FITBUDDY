// Diet plan data
const dietPlans = {
    balanced: {
        breakfast: [
            'Oatmeal with fruits and nuts',
            'Greek yogurt with honey',
            'Whole grain toast with avocado'
        ],
        lunch: [
            'Grilled chicken salad',
            'Quinoa bowl with vegetables',
            'Whole grain wrap with hummus'
        ],
        dinner: [
            'Baked salmon with vegetables',
            'Lean beef stir-fry',
            'Vegetable pasta with olive oil'
        ],
        snacks: [
            'Mixed nuts',
            'Fresh fruits',
            'Protein smoothie'
        ]
    },
    highProtein: {
        breakfast: [
            'Protein pancakes with berries',
            'Egg white omelette with spinach',
            'Protein shake with banana'
        ],
        lunch: [
            'Grilled chicken breast with sweet potato',
            'Tuna salad with whole grain bread',
            'Turkey and cheese wrap'
        ],
        dinner: [
            'Steak with roasted vegetables',
            'Baked chicken with quinoa',
            'Salmon with brown rice'
        ],
        snacks: [
            'Hard-boiled eggs',
            'Protein bars',
            'Greek yogurt with protein powder'
        ]
    },
    vegetarian: {
        breakfast: [
            'Tofu scramble with vegetables',
            'Chia seed pudding with fruits',
            'Vegan protein smoothie bowl'
        ],
        lunch: [
            'Lentil soup with whole grain bread',
            'Falafel wrap with hummus',
            'Vegetable stir-fry with tofu'
        ],
        dinner: [
            'Chickpea curry with rice',
            'Vegetable lasagna',
            'Mushroom and spinach pasta'
        ],
        snacks: [
            'Roasted chickpeas',
            'Vegan protein bars',
            'Fresh fruits and nuts'
        ]
    }
};

// Nutrition tips
const nutritionTips = [
    'Stay hydrated by drinking at least 8 glasses of water daily',
    'Include protein in every meal to support muscle growth',
    'Eat a variety of colorful vegetables for essential nutrients',
    'Choose whole grains over refined carbohydrates',
    'Don\'t skip meals - maintain regular eating patterns',
    'Limit processed foods and added sugars',
    'Include healthy fats in your diet',
    'Plan your meals ahead to stay on track'
];

function showDietPlan(planType) {
    console.log('Showing diet plan:', planType); // Debug log
    
    // Update active tab
    const dietTabs = document.querySelectorAll('.diet-tab');
    dietTabs.forEach(tab => {
        if (tab.getAttribute('data-plan') === planType) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Get the selected diet plan
    const selectedPlan = dietPlans[planType];
    if (!selectedPlan) {
        console.error('Diet plan not found:', planType);
        return;
    }

    // Update meal items for each category
    const categories = ['breakfast', 'lunch', 'dinner', 'snacks'];
    categories.forEach(category => {
        const mealItemsContainer = document.querySelector(`.meal-items[data-category="${category}"]`);
        if (!mealItemsContainer) {
            console.error('Meal items container not found for:', category);
            return;
        }

        // Clear existing items
        mealItemsContainer.innerHTML = '';

        // Add new items
        selectedPlan[category].forEach(item => {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-item';
            mealItem.textContent = item;
            mealItemsContainer.appendChild(mealItem);
        });
    });

    // Update nutrition tips
    const tipsContainer = document.querySelector('.nutrition-tips');
    if (tipsContainer) {
        tipsContainer.innerHTML = '<h3>💡 Nutrition Tips</h3>';
        // Show 3 random tips
        const randomTips = getRandomTips(3);
        randomTips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip';
            tipElement.textContent = tip;
            tipsContainer.appendChild(tipElement);
        });
    }
}

function getRandomTips(count) {
    const shuffled = [...nutritionTips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing diet plans...'); // Debug log
    
    // Add click event listeners to diet tabs
    const dietTabs = document.querySelectorAll('.diet-tab');
    dietTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            console.log('Tab clicked:', planType); // Debug log
            showDietPlan(planType);
        });
    });
    
    // Show balanced diet by default
    showDietPlan('balanced');
}); 