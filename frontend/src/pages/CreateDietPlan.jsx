import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, User, Sparkles, Target, Activity, Utensils, 
  Calendar, TrendingUp, Heart, Zap, Plus, X, Check,
  AlertCircle, ArrowRight, ChevronRight, Flame
} from 'lucide-react';

export default function CreateDietPlan() {
  const [creationMode, setCreationMode] = useState('ai'); // 'ai' or 'manual'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    // Personal Info
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    
    // Goals
    primaryGoal: '',
    targetWeight: '',
    timeline: '',
    
    // Preferences
    dietType: [],
    allergies: [],
    dislikedFoods: [],
    mealsPerDay: 3,
    
    // Health Conditions
    healthConditions: [],
    medications: '',
    
    // Manual Plan
    manualMeals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    }
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Options
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: '🪑' },
    { value: 'light', label: 'Lightly Active', desc: 'Exercise 1-3 days/week', icon: '🚶' },
    { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5 days/week', icon: '🏃' },
    { value: 'very', label: 'Very Active', desc: 'Exercise 6-7 days/week', icon: '💪' },
    { value: 'extra', label: 'Extra Active', desc: 'Physical job + exercise', icon: '🏋️' }
  ];

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss', icon: '📉', color: 'from-red-500 to-orange-500' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪', color: 'from-blue-500 to-cyan-500' },
    { value: 'maintenance', label: 'Maintain Weight', icon: '⚖️', color: 'from-green-500 to-emerald-500' },
    { value: 'health', label: 'Better Health', icon: '❤️', color: 'from-pink-500 to-rose-500' },
    { value: 'energy', label: 'More Energy', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { value: 'diabetes', label: 'Diabetes Management', icon: '🩺', color: 'from-purple-500 to-indigo-500' }
  ];

  const dietTypes = [
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'keto', label: 'Keto', icon: '🥑' },
    { value: 'paleo', label: 'Paleo', icon: '🥩' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { value: 'low_carb', label: 'Low Carb', icon: '🥦' },
    { value: 'high_protein', label: 'High Protein', icon: '🍗' },
    { value: 'balanced', label: 'Balanced', icon: '⚖️' }
  ];

  const healthConditions = [
    'Diabetes', 'Hypertension', 'High Cholesterol', 'PCOS', 
    'Thyroid Issues', 'Heart Disease', 'Kidney Disease', 'None'
  ];

  const commonAllergies = [
    'Dairy', 'Nuts', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Fish', 'None'
  ];

  // Handle Input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightM = formData.height / 100;
      const bmi = (formData.weight / (heightM * heightM)).toFixed(1);
      return bmi;
    }
    return null;
  };

  // Generate AI Plan
  const generateAIPlan = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const bmi = calculateBMI();
    const bmr = formData.gender === 'male' 
      ? 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5
      : 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    };
    
    const tdee = Math.round(bmr * (activityMultipliers[formData.activityLevel] || 1.2));
    
    let targetCalories = tdee;
    if (formData.primaryGoal === 'weight_loss') targetCalories -= 500;
    if (formData.primaryGoal === 'muscle_gain') targetCalories += 300;
    
    const plan = {
      calories: targetCalories,
      protein: Math.round(formData.weight * 2),
      carbs: Math.round(targetCalories * 0.4 / 4),
      fats: Math.round(targetCalories * 0.25 / 9),
      bmi: bmi,
      bmr: Math.round(bmr),
      tdee: tdee,
      meals: generateSampleMeals(targetCalories),
      weeklyPlan: generateWeeklyPlan(targetCalories),
      tips: generateTips(formData.primaryGoal)
    };
    
    setGeneratedPlan(plan);
    setLoading(false);
    setStep(5);
  };

  // Generate Sample Meals
  const generateSampleMeals = (calories) => {
    const breakfast = Math.round(calories * 0.3);
    const lunch = Math.round(calories * 0.35);
    const dinner = Math.round(calories * 0.25);
    const snacks = Math.round(calories * 0.1);
    
    return {
      breakfast: {
        calories: breakfast,
        items: [
          { name: 'Oats with Fruits', calories: breakfast * 0.6, protein: 12, carbs: 45, fats: 8 },
          { name: 'Boiled Eggs', calories: breakfast * 0.3, protein: 12, carbs: 2, fats: 10 },
          { name: 'Green Tea', calories: breakfast * 0.1, protein: 0, carbs: 2, fats: 0 }
        ]
      },
      lunch: {
        calories: lunch,
        items: [
          { name: 'Brown Rice', calories: lunch * 0.4, protein: 8, carbs: 45, fats: 2 },
          { name: 'Grilled Chicken', calories: lunch * 0.35, protein: 30, carbs: 0, fats: 5 },
          { name: 'Mixed Vegetables', calories: lunch * 0.15, protein: 3, carbs: 15, fats: 0 },
          { name: 'Dal (Lentils)', calories: lunch * 0.1, protein: 10, carbs: 20, fats: 1 }
        ]
      },
      dinner: {
        calories: dinner,
        items: [
          { name: 'Chapati (2)', calories: dinner * 0.4, protein: 6, carbs: 40, fats: 2 },
          { name: 'Paneer Curry', calories: dinner * 0.4, protein: 20, carbs: 10, fats: 15 },
          { name: 'Salad', calories: dinner * 0.2, protein: 2, carbs: 8, fats: 0 }
        ]
      },
      snacks: {
        calories: snacks,
        items: [
          { name: 'Mixed Nuts', calories: snacks * 0.6, protein: 6, carbs: 5, fats: 14 },
          { name: 'Fruit', calories: snacks * 0.4, protein: 1, carbs: 25, fats: 0 }
        ]
      }
    };
  };

  const generateWeeklyPlan = (calories) => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
      calories: calories,
      meals: 3,
      exercise: i < 5 ? '30 min cardio' : 'Rest/Light activity'
    }));
  };

  const generateTips = (goal) => {
    const tipsMap = {
      weight_loss: [
        'Create a calorie deficit of 500 calories per day',
        'Eat more protein to preserve muscle mass',
        'Drink 3-4 liters of water daily',
        'Get 7-8 hours of sleep',
        'Include cardio 4-5 times per week'
      ],
      muscle_gain: [
        'Eat in a calorie surplus of 300-500 calories',
        'Consume 2g protein per kg body weight',
        'Focus on progressive overload in training',
        'Eat every 3-4 hours',
        'Prioritize post-workout nutrition'
      ],
      maintenance: [
        'Maintain consistent eating schedule',
        'Balance macronutrients',
        'Stay active with regular exercise',
        'Monitor weight weekly',
        'Practice mindful eating'
      ],
      diabetes: [
        'Monitor blood sugar levels regularly',
        'Choose low glycemic index foods',
        'Eat smaller, frequent meals',
        'Limit refined carbohydrates',
        'Include high fiber foods'
      ]
    };
    
    return tipsMap[goal] || tipsMap.maintenance;
  };

  // Render Steps
  const renderModeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Create Your Perfect Diet Plan
        </h2>
        <p className="text-lg text-gray-600">Choose how you want to create your personalized meal plan</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Mode */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => { setCreationMode('ai'); setStep(2); }}
          className={`relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 cursor-pointer text-white overflow-hidden group ${
            creationMode === 'ai' ? 'ring-4 ring-emerald-300' : ''
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-3">AI-Powered Plan</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Let our AI analyze your health data and create a personalized diet plan tailored to your goals
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Smart calorie calculation',
                'Personalized macro distribution',
                'Custom meal suggestions',
                'Science-based recommendations',
                'Adapts to your preferences'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-10">🤖</div>
        </motion.div>

        {/* Manual Mode */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => { setCreationMode('manual'); setStep(2); }}
          className={`relative bg-white border-2 border-gray-200 rounded-3xl p-8 cursor-pointer overflow-hidden group hover:border-emerald-500 transition-all ${
            creationMode === 'manual' ? 'ring-4 ring-emerald-300 border-emerald-500' : ''
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Manual Creation</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Take full control and create your diet plan from scratch with your own meal choices
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Complete control over meals',
                'Choose specific foods',
                'Set your own calorie targets',
                'Flexible meal timing',
                'Customize everything'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-4 transition-all">
              <span>Create Manually</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-5">✏️</div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-black text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Help us understand your current health status</p>
      </div>

      <div className="space-y-6">
        {/* Age & Gender */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="25"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
            <div className="grid grid-cols-2 gap-3">
              {['male', 'female'].map(gender => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleInputChange('gender', gender)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                    formData.gender === gender
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {gender === 'male' ? '👨 Male' : '👩 Female'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm) *</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              placeholder="170"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="70"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* BMI Display */}
        {calculateBMI() && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-sm text-emerald-700 font-semibold">Your BMI</div>
                <div className="text-2xl font-black text-emerald-600">{calculateBMI()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level *</label>
          <div className="grid md:grid-cols-2 gap-3">
            {activityLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange('activityLevel', level.value)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  formData.activityLevel === level.value
                    ? 'bg-emerald-50 border-emerald-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{level.icon}</span>
                  <span className="font-bold text-gray-900">{level.label}</span>
                </div>
                <p className="text-xs text-gray-600 ml-11">{level.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep(1)}
          className="px-8 py-3 border-2 border-gray-200 rounded-xl font-bold hover:border-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!formData.age || !formData.gender || !formData.height || !formData.weight || !formData.activityLevel}
          className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );

  const renderGoals = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-black text-gray-900 mb-2">Your Health Goals</h3>
        <p className="text-gray-600">What would you like to achieve?</p>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Goal *</label>
          <div className="grid md:grid-cols-3 gap-4">
            {goals.map(goal => (
              <motion.button
                key={goal.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange('primaryGoal', goal.value)}
                className={`relative p-6 rounded-2xl text-center transition-all overflow-hidden ${
                  formData.primaryGoal === goal.value
                    ? 'ring-4 ring-emerald-300'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {formData.primaryGoal === goal.value && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-10`} />
                )}
                <div className="relative z-10">
                  <div className="text-4xl mb-2">{goal.icon}</div>
                  <div className="font-bold text-gray-900">{goal.label}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Target Weight & Timeline */}
        {(formData.primaryGoal === 'weight_loss' || formData.primaryGoal === 'muscle_gain') && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Weight (kg)</label>
              <input
                type="number"
                value={formData.targetWeight}
                onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                placeholder="65"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              >
                <option value="">Select timeline</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">1 Year</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep(2)}
          className="px-8 py-3 border-2 border-gray-200 rounded-xl font-bold hover:border-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!formData.primaryGoal}
          className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );

  const renderPreferences = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-3xl font-black text-gray-900 mb-2">Dietary Preferences</h3>
        <p className="text-gray-600">Tell us about your food preferences and restrictions</p>
      </div>

      <div className="space-y-8">
        {/* Diet Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Diet Type (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietTypes.map(diet => (
              <button
                key={diet.value}
                type="button"
                onClick={() => toggleArrayItem('dietType', diet.value)}
                className={`p-4 rounded-xl transition-all border-2 ${
                  formData.dietType.includes(diet.value)
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{diet.icon}</div>
                <div className="text-xs font-semibold">{diet.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Allergies (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-3">
            {commonAllergies.map(allergy => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleArrayItem('allergies', allergy)}
                className={`px-4 py-2 rounded-full transition-all border-2 text-sm font-semibold ${
                  formData.allergies.includes(allergy)
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Health Conditions (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-3">
            {healthConditions.map(condition => (
              <button
                key={condition}
                type="button"
                onClick={() => toggleArrayItem('healthConditions', condition)}
                className={`px-4 py-2 rounded-full transition-all border-2 text-sm font-semibold ${
                  formData.healthConditions.includes(condition)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Per Day */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Meals Per Day</label>
          <div className="flex gap-3">
            {[3, 4, 5, 6].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleInputChange('mealsPerDay', num)}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border-2 ${
                  formData.mealsPerDay === num
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {num} Meals
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep(3)}
          className="px-8 py-3 border-2 border-gray-200 rounded-xl font-bold hover:border-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={generateAIPlan}
          disabled={loading}
          className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Plan
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderGeneratedPlan = () => {
    if (!generatedPlan) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Your AI-Powered Diet Plan is Ready! 🎉
          </h2>
          <p className="text-lg text-gray-600">
            Personalized just for you based on your health profile
          </p>
        </motion.div>

        {/* Nutrition Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Daily Calories', value: generatedPlan.calories, icon: Flame, color: 'from-orange-500 to-red-500', unit: 'kcal' },
            { label: 'Protein', value: generatedPlan.protein, icon: Zap, color: 'from-blue-500 to-cyan-500', unit: 'g' },
            { label: 'Carbs', value: generatedPlan.carbs, icon: Activity, color: 'from-green-500 to-emerald-500', unit: 'g' },
            { label: 'Fats', value: generatedPlan.fats, icon: Heart, color: 'from-pink-500 to-rose-500', unit: 'g' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
            >
              <stat.icon className="w-8 h-8 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">{stat.label}</div>
              <div className="text-3xl font-black">{stat.value} <span className="text-lg font-normal">{stat.unit}</span></div>
            </motion.div>
          ))}
        </div>

        {/* Health Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Your BMI</div>
            <div className="text-2xl font-black text-gray-900">{generatedPlan.bmi}</div>
            <div className="text-xs text-gray-500 mt-1">
              {generatedPlan.bmi < 18.5 ? 'Underweight' : generatedPlan.bmi < 25 ? 'Normal' : generatedPlan.bmi < 30 ? 'Overweight' : 'Obese'}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Basal Metabolic Rate</div>
            <div className="text-2xl font-black text-gray-900">{generatedPlan.bmr} kcal</div>
            <div className="text-xs text-gray-500 mt-1">Calories burned at rest</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Daily Energy</div>
            <div className="text-2xl font-black text-gray-900">{generatedPlan.tdee} kcal</div>
            <div className="text-xs text-gray-500 mt-1">With activity factored in</div>
          </div>
        </div>

        {/* Sample Meal Plan */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">Today's Meal Plan</h3>
          
          <div className="space-y-6">
            {Object.entries(generatedPlan.meals).map(([mealType, meal]) => (
              <div key={mealType} className="border-l-4 border-emerald-500 pl-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-gray-900 capitalize">{mealType}</h4>
                  <span className="text-emerald-600 font-bold">{meal.calories} kcal</span>
                </div>
                <div className="space-y-2">
                  {meal.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <div className="flex gap-4 text-gray-500">
                        <span>{item.protein}g P</span>
                        <span>{item.carbs}g C</span>
                        <span>{item.fats}g F</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">AI Tips for Success</h3>
          </div>
          <ul className="space-y-3">
            {generatedPlan.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setStep(1)}
            className="px-8 py-4 border-2 border-gray-200 rounded-xl font-bold hover:border-gray-300 transition-all"
          >
            Create New Plan
          </button>
          <button
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Subscribe to This Plan
          </button>
          <button
            className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all"
          >
            Download PDF
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto">
        {/* Progress Bar */}
        {step > 1 && step < 5 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Step {step - 1} of 3</span>
              <span className="text-sm font-semibold text-emerald-600">{Math.round(((step - 1) / 3) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 && renderModeSelection()}
          {step === 2 && renderPersonalInfo()}
          {step === 3 && renderGoals()}
          {step === 4 && renderPreferences()}
          {step === 5 && renderGeneratedPlan()}
        </AnimatePresence>
      </div>
    </div>
  );
}
