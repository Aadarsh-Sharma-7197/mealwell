import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, RefreshCw, ChefHat, Heart, Flame, Clock } from 'lucide-react';

export default function MealPlan() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const mealPlan = {
    Monday: {
      breakfast: { name: 'Protein Oatmeal Bowl', calories: 380, protein: 25, carbs: 45, fats: 12, chef: 'Priya Sharma', time: '8:00 AM', image: '🥣' },
      lunch: { name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 30, fats: 18, chef: 'Raj Patel', time: '1:00 PM', image: '🥗' },
      snack: { name: 'Greek Yogurt Parfait', calories: 220, protein: 15, carbs: 25, fats: 8, chef: 'Sarah Kumar', time: '4:00 PM', image: '🥤' },
      dinner: { name: 'Baked Salmon & Veggies', calories: 520, protein: 40, carbs: 35, fats: 22, chef: 'Amit Singh', time: '7:30 PM', image: '🍱' }
    },
    Tuesday: {
      breakfast: { name: 'Avocado Toast with Eggs', calories: 420, protein: 22, carbs: 38, fats: 20, chef: 'Priya Sharma', time: '8:00 AM', image: '🥑' },
      lunch: { name: 'Quinoa Buddha Bowl', calories: 480, protein: 28, carbs: 52, fats: 16, chef: 'Raj Patel', time: '1:00 PM', image: '🥙' },
      snack: { name: 'Protein Smoothie', calories: 250, protein: 20, carbs: 30, fats: 6, chef: 'Sarah Kumar', time: '4:00 PM', image: '🥤' },
      dinner: { name: 'Lean Beef Stir Fry', calories: 540, protein: 42, carbs: 40, fats: 20, chef: 'Amit Singh', time: '7:30 PM', image: '🍜' }
    },
    // Add similar data for other days...
  };

  const currentPlan = mealPlan[selectedDay] || mealPlan.Monday;
  const totalCalories = Object.values(currentPlan).reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = Object.values(currentPlan).reduce((sum, meal) => sum + meal.protein, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Your Meal Plan</h1>
            <p className="text-gray-600">AI-personalized nutrition for this week</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Regenerate Plan
            </motion.button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <Flame className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-black mb-1">{totalCalories}</div>
            <div className="text-sm opacity-90">Daily Calories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <Heart className="w-8 h-8 mb-3 text-red-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">{totalProtein}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <Calendar className="w-8 h-8 mb-3 text-blue-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">Meals/Day</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <ChefHat className="w-8 h-8 mb-3 text-purple-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600">Chefs Assigned</div>
          </motion.div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {weekDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(currentPlan).map(([mealType, meal], i) => (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                  {meal.image}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                      {mealType}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meal.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{meal.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <ChefHat className="w-4 h-4" />
                    <span>by {meal.chef}</span>
                  </div>
                  
                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{meal.calories}</div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{meal.protein}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{meal.carbs}g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{meal.fats}g</div>
                      <div className="text-xs text-gray-600">Fats</div>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 transition-all">
                    View Recipe
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
