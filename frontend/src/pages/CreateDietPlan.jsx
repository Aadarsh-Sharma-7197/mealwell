import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  Brain,
  User,
  Sparkles,
  Target,
  Activity,
  Utensils,
  Calendar,
  TrendingUp,
  Heart,
  Zap,
  Plus,
  X,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Flame,
  Mic,
  MicOff,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CreateDietPlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creationMode, setCreationMode] = useState("ai"); // 'ai' or 'manual'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Personal Info
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",

    // Goals
    primaryGoal: "",
    targetWeight: "",
    timeline: "",

    // Preferences
    dietType: [],
    allergies: [],
    dislikedFoods: [],
    mealsPerDay: 3,
    selectedMealTypes: ["breakfast", "lunch", "dinner"],
    customRestrictions: "",

    // Health Conditions
    healthConditions: [],
    medications: "",

    // Manual Plan
    manualMeals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isListening, setIsListening] = useState(false); // Voice Input State

  // Handle Voice Input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prev) => ({
        ...prev,
        customRestrictions: prev.customRestrictions
          ? `${prev.customRestrictions} ${transcript}`
          : transcript,
      }));
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Options
  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentary",
      desc: "Little or no exercise",
      icon: "🪑",
    },
    {
      value: "light",
      label: "Lightly Active",
      desc: "Exercise 1-3 days/week",
      icon: "🚶",
    },
    {
      value: "moderate",
      label: "Moderately Active",
      desc: "Exercise 3-5 days/week",
      icon: "🏃",
    },
    {
      value: "very",
      label: "Very Active",
      desc: "Exercise 6-7 days/week",
      icon: "💪",
    },
    {
      value: "extra",
      label: "Extra Active",
      desc: "Physical job + exercise",
      icon: "🏋️",
    },
  ];

  const goals = [
    {
      value: "weight_loss",
      label: "Weight Loss",
      icon: "📉",
      color: "from-red-500 to-orange-500",
    },
    {
      value: "muscle_gain",
      label: "Muscle Gain",
      icon: "💪",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "maintenance",
      label: "Maintain Weight",
      icon: "⚖️",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "health",
      label: "Better Health",
      icon: "❤️",
      color: "from-pink-500 to-rose-500",
    },
    {
      value: "energy",
      label: "More Energy",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "diabetes",
      label: "Diabetes Management",
      icon: "🩺",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const dietTypes = [
    { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
    { value: "vegan", label: "Vegan", icon: "🌱" },
    { value: "keto", label: "Keto", icon: "🥑" },
    { value: "paleo", label: "Paleo", icon: "🥩" },
    { value: "mediterranean", label: "Mediterranean", icon: "🫒" },
    { value: "low_carb", label: "Low Carb", icon: "🥦" },
    { value: "high_protein", label: "High Protein", icon: "🍗" },
    { value: "balanced", label: "Balanced", icon: "⚖️" },
  ];

  const healthConditions = [
    "Diabetes",
    "Hypertension",
    "High Cholesterol",
    "PCOS",
    "Thyroid Issues",
    "Heart Disease",
    "Kidney Disease",
    "None",
  ];

  const commonAllergies = [
    "Dairy",
    "Nuts",
    "Gluten",
    "Soy",
    "Eggs",
    "Shellfish",
    "Fish",
    "None",
  ];

  // Handle Input
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
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

  // Handle Manual Plan Generation
  const handleManualGeneration = () => {
    setLoading(true);

    // 1. Calculate BMR & TDEE
    const isMale = formData.gender === "male";
    const bmr = Math.round(
      10 * formData.weight +
        6.25 * formData.height -
        5 * formData.age +
        (isMale ? 5 : -161)
    );

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9,
    };

    const tdee = Math.round(
      bmr * (activityMultipliers[formData.activityLevel] || 1.2)
    );

    // Adjust for goal
    let targetCalories = tdee;
    if (formData.primaryGoal === "weight_loss") targetCalories -= 500;
    else if (formData.primaryGoal === "muscle_gain") targetCalories += 300;

    // 2. Generate Sample Structure
    const sampleDay = generateSampleMeals(
      targetCalories,
      formData.selectedMealTypes
    );
    const weeklyPlan = {
      calories: targetCalories,
      protein: Math.round((targetCalories * 0.3) / 4),
      carbs: Math.round((targetCalories * 0.4) / 4),
      fats: Math.round((targetCalories * 0.3) / 9),
      bmi: calculateBMI(),
      bmr: bmr,
      tdee: tdee,
      tips: generateTips(formData.primaryGoal),
      days: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        meals: sampleDay, // Use same sample for all days for now, but editable
      })),
    };

    setTimeout(() => {
      setGeneratedPlan(weeklyPlan);
      setStep(5);
      setLoading(false);
    }, 1000);
  };

  // Generate AI Plan
  const generateAIPlan = async () => {
    if (creationMode === "manual") {
      handleManualGeneration();
      return;
    }

    if (!user) {
      alert("Please sign in to generate a plan");
      navigate("/login");
      return;
    }
    setLoading(true);

    try {
      const response = await api.post("/ai/generate-plan", {
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activityLevel,
        goal: formData.primaryGoal,
        dietType: formData.dietType,
        allergies: formData.allergies,
        healthConditions: formData.healthConditions,
        customRestrictions: formData.customRestrictions,
        mealsPerDay: formData.mealsPerDay,
        selectedMealTypes: formData.selectedMealTypes,
      });

      if (response.data.success) {
        const plan = response.data.plan;
        setGeneratedPlan(plan);
        // Save to localStorage for use in CustomerDashboard
        // Also save selectedMealTypes to know which meal types were selected
        const planData = {
          plan: plan,
          selectedMealTypes: formData.selectedMealTypes || ["breakfast", "lunch", "dinner"],
          mealsPerDay: formData.mealsPerDay || 3
        };
        localStorage.setItem('aiMealPlan', JSON.stringify(planData));
        setStep(5);
      } else {
        alert("Failed to generate plan: " + response.data.message);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Error generating plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Sample Meals
  const generateSampleMeals = (calories, selectedTypes) => {
    const types =
      selectedTypes && selectedTypes.length > 0
        ? selectedTypes
        : ["breakfast", "lunch", "dinner"];

    // Standard ratios if all present: B:30%, L:35%, D:25%, S:10%
    const standardRatios = {
      breakfast: 0.3,
      lunch: 0.35,
      dinner: 0.35,
      snacks: 0.1, // snacks might be extra
    };

    // Calculate total ratio of selected types to normalize
    let totalRatio = 0;
    types.forEach((type) => {
      totalRatio += standardRatios[type] || 0.33;
    });

    // Avoid division by zero
    if (totalRatio === 0) totalRatio = 1;

    const meals = {};

    if (types.includes("breakfast")) {
      const ratio = standardRatios.breakfast / totalRatio;
      const cal = Math.round(calories * ratio);
      meals.breakfast = {
        calories: cal,
        items: [
          {
            name: "Oats with Fruits",
            calories: Math.round(cal * 0.6),
            protein: 12,
            carbs: 45,
            fats: 8,
          },
          {
            name: "Boiled Eggs",
            calories: Math.round(cal * 0.3),
            protein: 12,
            carbs: 2,
            fats: 10,
          },
          {
            name: "Green Tea",
            calories: Math.round(cal * 0.1),
            protein: 0,
            carbs: 2,
            fats: 0,
          },
        ],
      };
    }

    if (types.includes("lunch")) {
      const ratio = standardRatios.lunch / totalRatio;
      const cal = Math.round(calories * ratio);
      meals.lunch = {
        calories: cal,
        items: [
          {
            name: "Brown Rice",
            calories: Math.round(cal * 0.4),
            protein: 8,
            carbs: 45,
            fats: 2,
          },
          {
            name: "Grilled Chicken",
            calories: Math.round(cal * 0.35),
            protein: 30,
            carbs: 0,
            fats: 5,
          },
          {
            name: "Mixed Vegetables",
            calories: Math.round(cal * 0.25),
            protein: 3,
            carbs: 15,
            fats: 0,
          },
        ],
      };
    }

    if (types.includes("dinner")) {
      const ratio = standardRatios.dinner / totalRatio;
      const cal = Math.round(calories * ratio);
      meals.dinner = {
        calories: cal,
        items: [
          {
            name: "Chapati (2)",
            calories: Math.round(cal * 0.4),
            protein: 6,
            carbs: 40,
            fats: 2,
          },
          {
            name: "Paneer Curry",
            calories: Math.round(cal * 0.4),
            protein: 20,
            carbs: 10,
            fats: 15,
          },
          {
            name: "Salad",
            calories: Math.round(cal * 0.2),
            protein: 2,
            carbs: 8,
            fats: 0,
          },
        ],
      };
    }

    if (types.includes("snacks")) {
      const ratio = standardRatios.snacks / totalRatio;
      const cal = Math.round(calories * ratio);
      meals.snacks = {
        calories: cal,
        items: [
          {
            name: "Mixed Nuts",
            calories: Math.round(cal * 0.6),
            protein: 6,
            carbs: 5,
            fats: 14,
          },
          {
            name: "Fruit",
            calories: Math.round(cal * 0.4),
            protein: 1,
            carbs: 25,
            fats: 0,
          },
        ],
      };
    }

    return meals;
  };

  const generateWeeklyPlan = (calories) => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][i],
      calories: calories,
      meals: 3,
      exercise: i < 5 ? "30 min cardio" : "Rest/Light activity",
    }));
  };

  const generateTips = (goal) => {
    const tipsMap = {
      weight_loss: [
        "Create a calorie deficit of 500 calories per day",
        "Eat more protein to preserve muscle mass",
        "Drink 3-4 liters of water daily",
        "Get 7-8 hours of sleep",
        "Include cardio 4-5 times per week",
      ],
      muscle_gain: [
        "Eat in a calorie surplus of 300-500 calories",
        "Consume 2g protein per kg body weight",
        "Focus on progressive overload in training",
        "Eat every 3-4 hours",
        "Prioritize post-workout nutrition",
      ],
      maintenance: [
        "Maintain consistent eating schedule",
        "Balance macronutrients",
        "Stay active with regular exercise",
        "Monitor weight weekly",
        "Practice mindful eating",
      ],
      diabetes: [
        "Monitor blood sugar levels regularly",
        "Choose low glycemic index foods",
        "Eat smaller, frequent meals",
        "Limit refined carbohydrates",
        "Include high fiber foods",
      ],
    };

    return tipsMap[goal] || tipsMap.maintenance;
  };

  // Handle browse chefs with plan
  const handleBrowseChefs = () => {
    // Merge user preferences into the diet plan object
    const completeDietPlan = {
      ...generatedPlan,
      mealsPerDay: formData.mealsPerDay,
      selectedMealTypes: formData.selectedMealTypes,
    };

    navigate("/browse-chefs", {
      state: {
        dietPlan: completeDietPlan,
        userProfile: {
          age: formData.age,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
          goal: formData.primaryGoal,
          dietType: formData.dietType,
          allergies: formData.allergies,
          healthConditions: formData.healthConditions,
          mealsPerDay: formData.mealsPerDay,
          selectedMealTypes: formData.selectedMealTypes,
        },
      },
    });
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
        <p className="text-lg text-gray-600">
          Choose how you want to create your personalized meal plan
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Mode */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setCreationMode("ai");
            setStep(2);
          }}
          className={`relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 cursor-pointer text-white overflow-hidden group ${
            creationMode === "ai" ? "ring-4 ring-emerald-300" : ""
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-3">AI-Powered Plan</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Let our AI analyze your health data and create a personalized diet
              plan tailored to your goals
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Smart calorie calculation",
                "Personalized macro distribution",
                "Custom meal suggestions",
                "Science-based recommendations",
                "Adapts to your preferences",
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
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-10">
            🤖
          </div>
        </motion.div>

        {/* Manual Mode */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setCreationMode("manual");
            setStep(2);
          }}
          className={`relative bg-white border-2 border-gray-200 rounded-3xl p-8 cursor-pointer overflow-hidden group hover:border-emerald-500 transition-all ${
            creationMode === "manual"
              ? "ring-4 ring-emerald-300 border-emerald-500"
              : ""
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              Manual Creation
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Take full control and create your diet plan from scratch with your
              own meal choices
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Complete control over meals",
                "Choose specific foods",
                "Set your own calorie targets",
                "Flexible meal timing",
                "Customize everything",
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
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-5">
            ✏️
          </div>
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
        <h3 className="text-3xl font-black text-gray-900 mb-2">
          Personal Information
        </h3>
        <p className="text-gray-600">
          Help us understand your current health status
        </p>
      </div>

      <div className="space-y-6">
        {/* Age & Gender */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="25"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["male", "female"].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleInputChange("gender", gender)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 ${
                    formData.gender === gender
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {gender === "male" ? "👨 Male" : "👩 Female"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Height (cm) *
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="170"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Weight (kg) *
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
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
                <div className="text-sm text-emerald-700 font-semibold">
                  Your BMI
                </div>
                <div className="text-2xl font-black text-emerald-600">
                  {calculateBMI()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Activity Level *
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {activityLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange("activityLevel", level.value)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  formData.activityLevel === level.value
                    ? "bg-emerald-50 border-emerald-500"
                    : "border-gray-200 hover:border-gray-300"
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
          disabled={
            !formData.age ||
            !formData.gender ||
            !formData.height ||
            !formData.weight ||
            !formData.activityLevel
          }
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
        <h3 className="text-3xl font-black text-gray-900 mb-2">
          Your Health Goals
        </h3>
        <p className="text-gray-600">What would you like to achieve?</p>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Primary Goal *
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <motion.button
                key={goal.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange("primaryGoal", goal.value)}
                className={`relative p-6 rounded-2xl text-center transition-all overflow-hidden ${
                  formData.primaryGoal === goal.value
                    ? "ring-4 ring-emerald-300"
                    : "border-2 border-gray-200 hover:border-gray-300"
                }`}
              >
                {formData.primaryGoal === goal.value && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-10`}
                  />
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
        {(formData.primaryGoal === "weight_loss" ||
          formData.primaryGoal === "muscle_gain") && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={formData.targetWeight}
                onChange={(e) =>
                  handleInputChange("targetWeight", e.target.value)
                }
                placeholder="65"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange("timeline", e.target.value)}
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
        <h3 className="text-3xl font-black text-gray-900 mb-2">
          Dietary Preferences
        </h3>
        <p className="text-gray-600">
          Tell us about your food preferences and restrictions
        </p>
      </div>

      <div className="space-y-8">
        {/* Diet Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Diet Type (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietTypes.map((diet) => (
              <button
                key={diet.value}
                type="button"
                onClick={() => toggleArrayItem("dietType", diet.value)}
                className={`p-4 rounded-xl transition-all border-2 ${
                  formData.dietType.includes(diet.value)
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300"
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
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleArrayItem("allergies", allergy)}
                className={`px-4 py-2 rounded-full transition-all border-2 text-sm font-semibold ${
                  formData.allergies.includes(allergy)
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "border-gray-200 hover:border-gray-300"
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
            {healthConditions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => toggleArrayItem("healthConditions", condition)}
                className={`px-4 py-2 rounded-full transition-all border-2 text-sm font-semibold ${
                  formData.healthConditions.includes(condition)
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        {/* Meals Per Day */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Meals
          </label>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  handleInputChange("mealsPerDay", num);
                  // Reset selected types when number changes to ensure consistency
                  // Defaulting logic could be smarter, but let's just keep current selection if valid
                  // or reset to first N available types.
                  // For now, let user pick manually in next step.
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border-2 ${
                  formData.mealsPerDay === num
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {num} Meal{num > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Meal Types */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Your Meals (Choose {formData.mealsPerDay})
          </label>
          <div className="flex flex-wrap gap-3">
            {["breakfast", "lunch", "dinner", "snacks"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const current = formData.selectedMealTypes || [];
                  if (current.includes(type)) {
                    toggleArrayItem("selectedMealTypes", type);
                  } else {
                    if (current.length < formData.mealsPerDay) {
                      toggleArrayItem("selectedMealTypes", type);
                    } else {
                      // Replace the first element to keep the count consistent
                      const newTypes = [...current.slice(1), type];
                      handleInputChange("selectedMealTypes", newTypes);
                    }
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border-2 capitalize ${
                  (formData.selectedMealTypes || []).includes(type)
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {formData.selectedMealTypes?.length !== formData.mealsPerDay && (
            <p className="text-xs text-red-500 mt-2 font-semibold">
              Please select exactly {formData.mealsPerDay} meal types.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Selected: {(formData.selectedMealTypes || []).length} /{" "}
            {formData.mealsPerDay}
          </p>
        </div>

        {/* Custom Restrictions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Additional Restrictions / Custom Requests
          </label>
          <div className="relative">
            <textarea
              value={formData.customRestrictions}
              onChange={(e) =>
                handleInputChange("customRestrictions", e.target.value)
              }
              placeholder="E.g., No spicy food, prefer Indian cuisine, lactose intolerant but love yogurt..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all min-h-[100px] pr-12"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-3 p-2 rounded-full transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Voice Input"
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click the microphone icon to use voice input.
          </p>
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
          disabled={
            loading ||
            formData.selectedMealTypes?.length !== formData.mealsPerDay
          }
          className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {creationMode === "manual"
                ? "Generating Base Plan..."
                : "Generating Plan..."}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {creationMode === "manual"
                ? "Create My Plan"
                : "Generate AI Plan"}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const generatePDF = () => {
    try {
      if (!generatedPlan) {
        alert("No plan generated to download!");
        return;
      }

      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald 500
      doc.text("MealWell - Your Personalized Diet Plan", 105, 20, {
        align: "center",
      });

      // User Metrics
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Health Profile", 14, 40);

      const metricsData = [
        [
          "BMI",
          generatedPlan.bmi,
          generatedPlan.bmi < 18.5
            ? "Underweight"
            : generatedPlan.bmi < 25
            ? "Normal"
            : "Overweight",
        ],
        ["BMR", `${generatedPlan.bmr} kcal`, "Basal Metabolic Rate"],
        [
          "TDEE",
          `${generatedPlan.tdee} kcal`,
          "Total Daily Energy Expenditure",
        ],
      ];

      doc.autoTable({
        startY: 45,
        head: [["Metric", "Value", "Note"]],
        body: metricsData,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Nutrition Goals
      let finalY = doc.lastAutoTable.finalY + 15;
      doc.text("Daily Nutrition Goals", 14, finalY);

      const nutritionData = [
        ["Calories", `${generatedPlan.calories} kcal`],
        ["Protein", `${generatedPlan.protein}g`],
        ["Carbs", `${generatedPlan.carbs}g`],
        ["Fats", `${generatedPlan.fats}g`],
      ];

      doc.autoTable({
        startY: finalY + 5,
        head: [["Nutrient", "Target"]],
        body: nutritionData,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Meal Plan
      finalY = doc.lastAutoTable.finalY + 15;
      doc.text("Weekly Meal Plan", 14, finalY);

      const scheduleData = [];
      if (generatedPlan.days) {
        generatedPlan.days.forEach((dayData) => {
          const day = `Day ${dayData.day}`;
          if (dayData.meals) {
            Object.entries(dayData.meals).forEach(([mealType, dish]) => {
              if (dish.items && Array.isArray(dish.items)) {
                dish.items.forEach((item) => {
                  scheduleData.push([
                    day,
                    mealType.charAt(0).toUpperCase() + mealType.slice(1),
                    item.name,
                    `${Math.round(item.calories)} kcal | ${item.protein}g P`,
                  ]);
                });
              } else {
                scheduleData.push([
                  day,
                  mealType.charAt(0).toUpperCase() + mealType.slice(1),
                  dish.name || "Meal Option",
                  `${Math.round(dish.calories)} kcal | ${dish.protein}g P`,
                ]);
              }
            });
          }
        });
      } else if (generatedPlan.schedule) {
        Object.entries(generatedPlan.schedule).forEach(([day, meals]) => {
          Object.entries(meals).forEach(([mealType, dish]) => {
            if (dish.items && Array.isArray(dish.items)) {
              dish.items.forEach((item) => {
                scheduleData.push([
                  day,
                  mealType.charAt(0).toUpperCase() + mealType.slice(1),
                  item.name,
                  `${Math.round(item.calories)} kcal | ${item.protein}g P`,
                ]);
              });
            } else {
              scheduleData.push([
                day,
                mealType.charAt(0).toUpperCase() + mealType.slice(1),
                dish.name || "Meal Option",
                `${Math.round(dish.calories)} kcal | ${dish.protein}g P`,
              ]);
            }
          });
        });
      }

      doc.autoTable({
        startY: finalY + 5,
        head: [["Day", "Meal", "Dish", "Nutrition"]],
        body: scheduleData,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 80 },
          3: { cellWidth: 50 },
        },
      });

      // Tips
      finalY = doc.lastAutoTable.finalY + 15;
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }
      doc.text("AI Tips for Success", 14, finalY);

      const tipsData = generatedPlan.tips
        ? generatedPlan.tips.map((tip) => [tip])
        : [];

      doc.autoTable({
        startY: finalY + 5,
        body: tipsData,
        theme: "plain",
      });

      doc.save("MealWell-Diet-Plan.pdf");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

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
            {
              label: "Daily Calories",
              value: generatedPlan.calories,
              icon: Flame,
              color: "from-orange-500 to-red-500",
              unit: "kcal",
            },
            {
              label: "Protein",
              value: generatedPlan.protein,
              icon: Zap,
              color: "from-blue-500 to-cyan-500",
              unit: "g",
            },
            {
              label: "Carbs",
              value: generatedPlan.carbs,
              icon: Activity,
              color: "from-green-500 to-emerald-500",
              unit: "g",
            },
            {
              label: "Fats",
              value: generatedPlan.fats,
              icon: Heart,
              color: "from-pink-500 to-rose-500",
              unit: "g",
            },
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
              <div className="text-3xl font-black">
                {stat.value}{" "}
                <span className="text-lg font-normal">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Your BMI</div>
            <div className="text-2xl font-black text-gray-900">
              {generatedPlan.bmi}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {generatedPlan.bmi < 18.5
                ? "Underweight"
                : generatedPlan.bmi < 25
                ? "Normal"
                : generatedPlan.bmi < 30
                ? "Overweight"
                : "Obese"}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">
              Basal Metabolic Rate
            </div>
            <div className="text-2xl font-black text-gray-900">
              {generatedPlan.bmr} kcal
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Calories burned at rest
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Daily Energy</div>
            <div className="text-2xl font-black text-gray-900">
              {generatedPlan.tdee} kcal
            </div>
            <div className="text-xs text-gray-500 mt-1">
              With activity factored in
            </div>
          </div>
        </div>

        {/* 7-Day Meal Plan */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">
            Your 7-Day Meal Plan
          </h3>

          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {generatedPlan.days?.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedDay === d.day
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {generatedPlan.days?.find((d) => d.day === selectedDay)?.meals &&
              Object.entries(
                generatedPlan.days.find((d) => d.day === selectedDay).meals
              ).map(([mealType, meal]) => (
                <div
                  key={mealType}
                  className="border-l-4 border-emerald-500 pl-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-gray-900 capitalize">
                      {mealType}
                    </h4>
                    <span className="text-emerald-600 font-bold">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <div className="space-y-2">
                    {meal.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
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
            <h3 className="text-2xl font-black text-gray-900">
              AI Tips for Success
            </h3>
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
            onClick={handleBrowseChefs}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Find Chefs for This Plan</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={generatePDF}
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
              <span className="text-sm font-semibold text-gray-600">
                Step {step - 1} of 3
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {Math.round(((step - 1) / 3) * 100)}%
              </span>
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
