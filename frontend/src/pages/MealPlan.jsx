import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, RefreshCw, ChefHat, Heart, Flame, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MealPlan() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [aiPlanData, setAiPlanData] = useState(null);
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    mealsPerDay: 0,
    chefsCount: 0
  });

  // Get actual day names for the current week
  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        date: date,
        dateString: date.toISOString().split('T')[0]
      });
    }
    return days;
  };

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, try to load AI-generated meal plan from localStorage
      const savedPlan = localStorage.getItem('aiMealPlan');
      let aiPlan = null;
      let selectedMealTypes = ["breakfast", "lunch", "dinner"];
      
      if (savedPlan) {
        try {
          const planData = JSON.parse(savedPlan);
          if (planData.plan) {
            aiPlan = planData.plan;
            selectedMealTypes = planData.selectedMealTypes || selectedMealTypes;
          } else {
            aiPlan = planData; // Old format
          }
        } catch (e) {
          console.error('Error parsing AI meal plan:', e);
        }
      }

      // If AI plan exists, use it
      if (aiPlan && aiPlan.days && aiPlan.days.length > 0) {
        setAiPlanData(aiPlan);
        const weekDaysData = getWeekDays();
        const weekMeals = [];
        
        // Get chef info from orders if available
        let orderChefMap = new Map();
        try {
          const response = await api.get('/orders');
          if (response.data.success) {
            const paidOrders = response.data.data.filter(
              (order) => order.paymentStatus === 'paid' && order.status !== 'cancelled'
            );
            paidOrders.forEach((order) => {
              const chefInfo = typeof order.chefId === 'object' && order.chefId ? {
                name: order.chefId?.userId?.name || 'Chef',
                avatar: order.chefId?.userId?.profile?.avatar || 
                        order.chefId?.coverImage ||
                        `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(order.chefId?.userId?.name || 'Chef')}`
              } : {
                name: 'Chef',
                avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef`
              };
              orderChefMap.set(order._id, chefInfo);
            });
          }
        } catch (err) {
          console.error('Error fetching orders for chef info:', err);
        }

        // Process AI plan days
        for (let i = 0; i < 7; i++) {
          const dayData = aiPlan.days[i] || aiPlan.days[0]; // Use first day if not enough days
          const date = weekDaysData[i]?.date || new Date();
          
          const mealsByType = {};
          const dayMeals = dayData.meals || {};
          
          // Get default chef info
          const defaultChef = {
            name: 'Chef',
            avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef`
          };
          
          // Process each meal type
          selectedMealTypes.forEach((mealType) => {
            const meal = dayMeals[mealType];
            if (meal && meal.items && meal.items.length > 0) {
              const mealName = meal.items.length === 1 
                ? meal.items[0].name 
                : meal.items.map(item => item.name).join(', ');
              
              // Calculate nutritional info
              const totalNutrition = meal.items.reduce((acc, item) => ({
                calories: acc.calories + (meal.calories || 0) / meal.items.length,
                protein: acc.protein + (item.protein || 0),
                carbs: acc.carbs + (item.carbs || 0),
                fats: acc.fats + (item.fats || 0),
              }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
              
              mealsByType[mealType] = {
                name: mealName,
                mealType: mealType,
                nutritionalInfo: {
                  calories: Math.round(meal.calories || totalNutrition.calories),
                  protein: Math.round(totalNutrition.protein),
                  carbs: Math.round(totalNutrition.carbs),
                  fats: Math.round(totalNutrition.fats),
                },
                items: meal.items,
                chefName: defaultChef.name,
                chefAvatar: defaultChef.avatar,
              };
            }
          });

          weekMeals.push({
            day: weekDaysData[i]?.name || `Day ${i + 1}`,
            date: date,
            dateString: weekDaysData[i]?.dateString || date.toISOString().split('T')[0],
            mealsByType: mealsByType
          });
        }

        setWeeklyMeals(weekMeals);
        
        // Calculate stats from selected day
        if (weekMeals[selectedDay]) {
          calculateStats(weekMeals[selectedDay], weekMeals, aiPlan);
        }
      } else {
        // Fallback: Use orders if no AI plan
        await fetchMealPlanFromOrders();
      }
    } catch (err) {
      console.error('Error loading meal plan:', err);
      setError('Failed to load meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMealPlanFromOrders = async () => {
    try {
      const response = await api.get('/orders');
      
      if (response.data.success) {
        const paidOrders = response.data.data.filter(
          (order) => order.paymentStatus === 'paid' && order.status !== 'cancelled'
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekDaysData = getWeekDays();
        const weekMeals = [];
        
        for (let i = 0; i < 7; i++) {
          weekMeals.push({
            day: weekDaysData[i]?.name || `Day ${i + 1}`,
            date: weekDaysData[i]?.date || new Date(),
            dateString: weekDaysData[i]?.dateString || new Date().toISOString().split('T')[0],
            mealsByType: {
              breakfast: null,
              lunch: null,
              dinner: null,
              snack: null
            }
          });
        }

        paidOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt || order.deliveryStatus?.confirmed || new Date());
          orderDate.setHours(0, 0, 0, 0);
          
          const daysSinceOrder = Math.floor((orderDate - today) / (1000 * 60 * 60 * 24));
          
          const chefInfo = typeof order.chefId === 'object' && order.chefId ? {
            name: order.chefId?.userId?.name || 'Chef',
            avatar: order.chefId?.userId?.profile?.avatar || 
                    order.chefId?.coverImage ||
                    `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(order.chefId?.userId?.name || 'Chef')}`
          } : {
            name: 'Chef',
            avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef`
          };
          
          if (daysSinceOrder >= 0 && daysSinceOrder < 7) {
            order.items.forEach((item) => {
              const mealType = getMealTypeFromItem(item, 0);
              if (weekMeals[daysSinceOrder] && !weekMeals[daysSinceOrder].mealsByType[mealType]) {
                weekMeals[daysSinceOrder].mealsByType[mealType] = {
                  ...item,
                  mealType,
                  chefName: chefInfo.name,
                  chefAvatar: chefInfo.avatar,
                };
              }
            });
          }
        });

        setWeeklyMeals(weekMeals);
        if (weekMeals[selectedDay]) {
          calculateStats(weekMeals[selectedDay], weekMeals, null);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  };

  const getMealTypeFromItem = (item, dayIndex) => {
    const name = (item.name || '').toLowerCase();
    if (name.includes('breakfast') || name.includes('oatmeal') || name.includes('toast') || name.includes('eggs')) {
      return 'breakfast';
    } else if (name.includes('dinner') || name.includes('salmon') || name.includes('beef') || name.includes('chicken')) {
      return 'dinner';
    } else if (name.includes('snack') || name.includes('smoothie') || name.includes('yogurt')) {
      return 'snack';
    }
    if (dayIndex < 3) return 'breakfast';
    if (dayIndex < 5) return 'lunch';
    return 'dinner';
  };

  const calculateStats = (selectedDay, allDays, aiPlan) => {
    if (!selectedDay) return;

    const meals = Object.values(selectedDay.mealsByType).filter(Boolean);
    const totalCalories = meals.reduce((sum, meal) => 
      sum + (meal.nutritionalInfo?.calories || 0), 0
    );
    const totalProtein = meals.reduce((sum, meal) => 
      sum + (meal.nutritionalInfo?.protein || 0), 0
    );
    const totalCarbs = meals.reduce((sum, meal) => 
      sum + (meal.nutritionalInfo?.carbs || 0), 0
    );
    const totalFats = meals.reduce((sum, meal) => 
      sum + (meal.nutritionalInfo?.fats || 0), 0
    );
    
    // Count unique chefs
    const chefs = new Set();
    allDays.forEach(day => {
      Object.values(day.mealsByType).forEach(meal => {
        if (meal && meal.chefName) chefs.add(meal.chefName);
      });
    });

    setStats({
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFats: Math.round(totalFats),
      mealsPerDay: meals.length,
      chefsCount: chefs.size || 1
    });
  };

  const handleDayChange = (index) => {
    setSelectedDay(index);
    if (weeklyMeals[index]) {
      calculateStats(weeklyMeals[index], weeklyMeals, aiPlanData);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('MealWell - Your Meal Plan', 14, 20);
    
    const tableData = [];
    weeklyMeals.forEach((day, index) => {
      const meals = Object.values(day.mealsByType).filter(Boolean);
      meals.forEach(meal => {
        tableData.push([
          day.day,
          meal.type || meal.mealType || 'Meal',
          meal.name || 'Meal',
          `${meal.nutritionalInfo?.calories || 0} kcal`,
          `${meal.nutritionalInfo?.protein || 0}g`,
          meal.chefName || 'Chef'
        ]);
      });
    });

    doc.autoTable({
      head: [['Day', 'Type', 'Meal', 'Calories', 'Protein', 'Chef']],
      body: tableData,
      startY: 30,
    });

    doc.save('meal-plan.pdf');
  };

  const currentPlan = weeklyMeals[selectedDay] || weeklyMeals[0];
  const meals = currentPlan ? Object.entries(currentPlan.mealsByType)
    .filter(([_, meal]) => meal !== null)
    .map(([type, meal]) => ({ type, ...meal })) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadMealPlan}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (weeklyMeals.length === 0 || meals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Meal Plan Available</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active meal plans. Create one to get started!
            </p>
            <Link
              to="/create-diet-plan"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
            >
              Create Meal Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Your Meal Plan</h1>
            <p className="text-gray-600">
              {aiPlanData ? 'AI-Generated Personalized Plan' : 'Your personalized nutrition plan for this week'}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </motion.button>
            <Link
              to="/create-diet-plan"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Create New Plan
            </Link>
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
            <div className="text-3xl font-black mb-1">{stats.totalCalories || 0}</div>
            <div className="text-sm opacity-90">Daily Calories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <Heart className="w-8 h-8 mb-3 text-red-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalProtein || 0}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <Calendar className="w-8 h-8 mb-3 text-blue-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.mealsPerDay || 0}</div>
            <div className="text-sm text-gray-600">Meals/Day</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <ChefHat className="w-8 h-8 mb-3 text-purple-500" />
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.chefsCount || 0}</div>
            <div className="text-sm text-gray-600">Chefs Assigned</div>
          </motion.div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {getWeekDays().map((dayObj, index) => (
              <button
                key={dayObj.dateString}
                onClick={() => handleDayChange(index)}
                className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1 ${
                  selectedDay === index
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs opacity-80">{dayObj.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-lg">{dayObj.date.getDate()}</span>
                <span className="text-xs opacity-80">{dayObj.name.slice(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day's Meals */}
        {currentPlan && (
          <motion.div
            key={currentPlan.dateString}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-bold">{currentPlan.date.getDate()}</span>
                  <span className="text-xs">{currentPlan.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{currentPlan.day}</h2>
                  <p className="text-sm text-gray-500">
                    {meals.length} meal{meals.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
              </div>
            </div>

            {/* Meals Grid for Selected Day */}
            {meals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {meals.map((meal, mealIndex) => {
                  const nutritionalInfo = meal.nutritionalInfo || {};
                  
                  const getFoodIcon = (mealName) => {
                    const name = (mealName || '').toLowerCase();
                    if (name.includes('chicken') || name.includes('poultry')) return '🍗';
                    if (name.includes('fish') || name.includes('salmon') || name.includes('seafood')) return '🐟';
                    if (name.includes('beef') || name.includes('meat')) return '🥩';
                    if (name.includes('rice') || name.includes('biryani')) return '🍚';
                    if (name.includes('pasta') || name.includes('noodles')) return '🍝';
                    if (name.includes('pizza')) return '🍕';
                    if (name.includes('burger')) return '🍔';
                    if (name.includes('salad')) return '🥗';
                    if (name.includes('soup')) return '🍲';
                    if (name.includes('sandwich') || name.includes('wrap')) return '🥪';
                    if (name.includes('taco')) return '🌮';
                    if (name.includes('sushi')) return '🍣';
                    if (name.includes('curry')) return '🍛';
                    if (name.includes('bread') || name.includes('toast')) return '🍞';
                    if (name.includes('egg')) return '🥚';
                    if (name.includes('fruit')) return '🍎';
                    if (name.includes('smoothie') || name.includes('juice')) return '🥤';
                    if (name.includes('yogurt')) return '🥛';
                    if (name.includes('oatmeal') || name.includes('porridge')) return '🥣';
                    return '🍽️';
                  };

                  return (
                    <motion.div
                      key={`${currentPlan.dateString}-${meal.type || meal.mealType}-${mealIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: mealIndex * 0.05 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Food Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-4xl mb-3">
                          {getFoodIcon(meal.name)}
                        </div>
                        
                        {/* Meal Type Badge */}
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase mb-2">
                          {meal.type || meal.mealType}
                        </span>
                        
                        {/* Meal Name */}
                        <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2 min-h-[2.5rem]">
                          {meal.name || 'Meal'}
                        </h3>
                        
                        {/* Chef Info with Photo */}
                        <div className="flex items-center gap-2 mb-3">
                          {meal.chefAvatar ? (
                            <img
                              src={meal.chefAvatar}
                              alt={meal.chefName}
                              className="w-6 h-6 rounded-full object-cover border-2 border-emerald-200"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(meal.chefName || 'Chef')}`;
                              }}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                              {(meal.chefName || 'C')[0].toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs text-gray-600 font-medium">{meal.chefName || 'Chef'}</span>
                        </div>
                        
                        {/* Nutritional Info */}
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Calories</span>
                            <span className="font-bold text-orange-600">{nutritionalInfo.calories || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Protein</span>
                            <span className="font-bold text-blue-600">{nutritionalInfo.protein || 0}g</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Carbs</span>
                            <span className="font-bold text-green-600">{nutritionalInfo.carbs || 0}g</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Fats</span>
                            <span className="font-bold text-purple-600">{nutritionalInfo.fats || 0}g</span>
                          </div>
                        </div>
                        
                        {/* Time */}
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {meal.type === 'breakfast' || meal.mealType === 'breakfast' ? '8:00 AM' : 
                           meal.type === 'lunch' || meal.mealType === 'lunch' ? '1:00 PM' :
                           meal.type === 'dinner' || meal.mealType === 'dinner' ? '7:30 PM' : '4:00 PM'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No meals scheduled for {currentPlan.day}</p>
                <Link
                  to="/browse-chefs"
                  className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                >
                  Order Meals
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
