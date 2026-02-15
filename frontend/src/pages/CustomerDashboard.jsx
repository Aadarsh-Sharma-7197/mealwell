import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Heart,
  Clock,
  Star,
  ChefHat,
  Bell,
  Settings,
  User,
  Package,
  Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [weeklyDishes, setWeeklyDishes] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [aiMealPlan, setAiMealPlan] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUpcomingMeals();
    fetchWeeklyDishes();
    // Load AI meal plan from localStorage if available
    const savedPlan = localStorage.getItem('aiMealPlan');
    if (savedPlan) {
      try {
        const planData = JSON.parse(savedPlan);
        // Check if plan belongs to current user
        if (planData.userId && user && planData.userId !== user._id) {
          setAiMealPlan(null);
          return;
        }

        // Handle both old format (just plan) and new format (plan + selectedMealTypes)
        if (planData.plan) {
          setAiMealPlan(planData);
        } else {
          // Old format - wrap it
          setAiMealPlan({
            plan: planData,
            selectedMealTypes: ["breakfast", "lunch", "dinner"],
            mealsPerDay: 3
          });
        }
      } catch (e) {
        console.error('Error parsing saved meal plan:', e);
      }
    }
  }, [user]);

  const fetchUpcomingMeals = async () => {
    try {
      const response = await api.get("/orders");

      if (response.data.success) {
        // Filter for active orders (not delivered or cancelled)
        const activeOrders = response.data.data.filter(
          (order) => !["delivered", "cancelled"].includes(order.status)
        );

        // Calculate total calories for today
        const todayCalories = activeOrders.reduce((acc, order) => {
          const orderCalories = order.items.reduce(
            (sum, item) => sum + (item.nutritionalInfo?.calories || 0),
            0
          );
          return acc + orderCalories;
        }, 0);
        setTotalCalories(todayCalories);

        // Transform to display format
        const formattedMeals = activeOrders.map((order) => ({
          id: order._id,
          name: order.items[0]?.name || "Meal",
          chef: order.chefId?.userId?.name || "Chef",
          status: order.status,
          time: new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          calories: order.items.reduce(
            (sum, item) => sum + (item.nutritionalInfo?.calories || 0),
            0
          ),
        }));

        setUpcomingMeals(formattedMeals);
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeFromItem = (item, dayIndex) => {
    // Try to infer meal type from item name or use default
    const name = (item.name || '').toLowerCase();
    if (name.includes('breakfast') || name.includes('oatmeal') || name.includes('toast') || name.includes('eggs')) {
      return 'breakfast';
    } else if (name.includes('dinner') || name.includes('salmon') || name.includes('beef') || name.includes('chicken')) {
      return 'dinner';
    } else if (name.includes('snack') || name.includes('smoothie') || name.includes('yogurt')) {
      return 'snack';
    }
    // Default distribution: breakfast (0-2), lunch (3-4), dinner (5-6)
    if (dayIndex < 3) return 'breakfast';
    if (dayIndex < 5) return 'lunch';
    return 'dinner';
  };

  const fetchWeeklyDishes = async () => {
    try {
      // Get AI meal plan data from localStorage
      const savedPlan = localStorage.getItem('aiMealPlan');
      let aiPlanData = null;
      let selectedMealTypes = ["breakfast", "lunch", "dinner"];
      let planStats = null;
      
      if (savedPlan) {
        try {
          const planData = JSON.parse(savedPlan);
          
          // Check if plan belongs to current user
          if (planData.userId && user && planData.userId !== user._id) {
            aiPlanData = null;
          } else if (planData.plan) {
            aiPlanData = planData.plan;
            selectedMealTypes = planData.selectedMealTypes || selectedMealTypes;
            planStats = {
              calories: aiPlanData.calories,
              protein: aiPlanData.protein,
              carbs: aiPlanData.carbs,
              fats: aiPlanData.fats,
              bmi: aiPlanData.bmi,
              bmr: aiPlanData.bmr,
              tdee: aiPlanData.tdee,
              tips: aiPlanData.tips || []
            };
          } else {
            // Old format
            aiPlanData = planData;
            planStats = {
              calories: aiPlanData.calories,
              protein: aiPlanData.protein,
              carbs: aiPlanData.carbs,
              fats: aiPlanData.fats,
              bmi: aiPlanData.bmi,
              bmr: aiPlanData.bmr,
              tdee: aiPlanData.tdee,
              tips: aiPlanData.tips || []
            };
          }
        } catch (e) {
          console.error('Error parsing AI meal plan:', e);
        }
      }

      // Create a map for 7 days starting from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekDays = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        weekDays.push({
          date: new Date(date),
          dateString: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          dishes: [],
          mealsByType: {}
        });
      }

      // If AI plan exists, use it as primary source
      if (aiPlanData && aiPlanData.days && aiPlanData.days.length > 0) {
        // Get paid orders for chef information
        const response = await api.get("/orders");
        const paidOrders = response.data.success 
          ? response.data.data.filter((order) => order.paymentStatus === "paid")
          : [];
        
        // Create a map of order dates to chef info
        const orderChefMap = new Map();
        paidOrders.forEach((order) => {
          const orderDate = new Date(order.createdAt || order.deliveryStatus?.confirmed || new Date());
          orderDate.setHours(0, 0, 0, 0);
          const daysSinceOrder = Math.floor((orderDate - today) / (1000 * 60 * 60 * 24));
          if (daysSinceOrder >= 0 && daysSinceOrder < 7) {
            const chefInfo = typeof order.chefId === 'object' && order.chefId ? {
              name: order.chefId?.userId?.name || "Chef",
              avatar: order.chefId?.userId?.profile?.avatar || 
                      order.chefId?.coverImage ||
                      `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(order.chefId?.userId?.name || "Chef")}`
            } : { name: "Chef", avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef` };
            orderChefMap.set(daysSinceOrder, chefInfo);
          }
        });

        // Helper function to get food icon
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
          if (name.includes('breakfast')) return '🥣';
          if (name.includes('lunch')) return '🥗';
          if (name.includes('dinner')) return '🍱';
          return '🍽️';
        };

        // Populate weekDays with AI meal plan data
        aiPlanData.days.forEach((dayData, dayIndex) => {
          if (dayIndex < 7 && weekDays[dayIndex]) {
            const day = weekDays[dayIndex];
            const dayMeals = dayData.meals || {};
            
            // Get chef info for this day (if available from orders)
            const chefInfo = orderChefMap.get(dayIndex) || {
              name: "Chef",
              avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef`
            };
            
            // Process each meal type from selectedMealTypes
            selectedMealTypes.forEach((mealType) => {
              const meal = dayMeals[mealType];
              if (meal && meal.items && meal.items.length > 0) {
                // Combine all items in the meal into a single name or show first item
                const mealName = meal.items.length === 1 
                  ? meal.items[0].name 
                  : meal.items.map(item => item.name).join(', ');
                
                // Calculate total nutritional info from all items
                const totalNutrition = meal.items.reduce((acc, item) => ({
                  calories: acc.calories + (meal.calories || 0) / meal.items.length,
                  protein: acc.protein + (item.protein || 0),
                  carbs: acc.carbs + (item.carbs || 0),
                  fats: acc.fats + (item.fats || 0),
                }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
                
                day.mealsByType[mealType] = {
                  name: mealName,
                  mealType: mealType,
                  nutritionalInfo: {
                    calories: Math.round(meal.calories || totalNutrition.calories),
                    protein: Math.round(totalNutrition.protein),
                    carbs: Math.round(totalNutrition.carbs),
                    fats: Math.round(totalNutrition.fats),
                  },
                  items: meal.items, // Store all items
                  chefName: chefInfo.name,
                  chefAvatar: chefInfo.avatar,
                  foodIcon: getFoodIcon(mealName),
                  orderStatus: "confirmed", // Default status for AI plan meals
                };
              }
            });
            
            // Convert mealsByType to dishes array for display
            day.dishes = Object.values(day.mealsByType).filter(meal => meal !== null);
          }
        });
        
        // Store plan stats for display
        if (planStats) {
          weekDays.planStats = planStats;
        }
        
        setWeeklyDishes(weekDays);
      } else {
        // Fallback: Use orders if no AI plan exists
        try {
          const response = await api.get("/orders");
          if (response.data.success) {
            const paidOrders = response.data.data.filter(
              (order) => order.paymentStatus === "paid"
            );
            
            // Simple fallback - just add orders to dishes
            paidOrders.forEach((order) => {
              const orderDate = new Date(order.createdAt || new Date());
              orderDate.setHours(0, 0, 0, 0);
              const daysSinceOrder = Math.floor((orderDate - today) / (1000 * 60 * 60 * 24));
              
              if (daysSinceOrder >= 0 && daysSinceOrder < 7) {
                const chefInfo = typeof order.chefId === 'object' && order.chefId ? {
                  name: order.chefId?.userId?.name || "Chef",
                  avatar: order.chefId?.userId?.profile?.avatar || 
                          order.chefId?.coverImage ||
                          `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(order.chefId?.userId?.name || "Chef")}`
                } : { name: "Chef", avatar: `https://ui-avatars.com/api/?background=10b981&color=fff&name=Chef` };
                
                order.items.forEach((item) => {
                  weekDays[daysSinceOrder].dishes.push({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    type: item.type,
                    nutritionalInfo: item.nutritionalInfo,
                    orderId: order._id,
                    chefName: chefInfo.name,
                    chefAvatar: chefInfo.avatar,
                    orderStatus: order.status,
                    foodIcon: getFoodIcon(item.name),
                  });
                });
              }
            });
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
        
        setWeeklyDishes(weekDays);
      }
    } catch (err) {
      console.error("Error fetching weekly dishes:", err);
    }
  };

  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: new Date(date),
        dateString: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  };

  const handleDayChange = (index) => {
    setSelectedDay(index);
  };

  const currentDay = weeklyDishes[selectedDay] || weeklyDishes[0];

  const stats = [
    {
      label: "Meals This Week",
      value: upcomingMeals.length.toString(),
      icon: Package,
      colorClass: "bg-emerald-100",
      iconColorClass: "text-emerald-600",
    },
    {
      label: "Calories Today",
      value: totalCalories > 0 ? totalCalories.toString() : "0",
      icon: Heart,
      colorClass: "bg-red-100",
      iconColorClass: "text-red-600",
    },
    {
      label: "Streak Days",
      value: "0",
      icon: TrendingUp,
      colorClass: "bg-blue-100",
      iconColorClass: "text-blue-600",
    },
    {
      label: "Weight Goal",
      value: "0",
      icon: User,
      colorClass: "bg-purple-100",
      iconColorClass: "text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your meal plan overview for today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link
              to="/settings"
              className="p-2 text-gray-400 hover:text-gray-600 transition"
            >
              <Settings className="w-6 h-6" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
              {user?.profile?.avatar ? (
                <img
                  src={user.profile.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.colorClass}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColorClass}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* 7-Day Meal Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  7-Day Meal Plan
                </h2>
                <div className="flex gap-2">
                  <Link
                    to="/payment-history"
                    className="text-emerald-600 font-medium hover:text-emerald-700 text-sm flex items-center gap-1"
                  >
                    <Receipt className="w-4 h-4" />
                    Payments
                  </Link>
                  <Link
                    to="/order-tracking"
                    className="text-emerald-600 font-medium hover:text-emerald-700 text-sm"
                  >
                    Track Orders
                  </Link>
                </div>
              </div>

              {/* Day Selector */}
              {weeklyDishes.length > 0 && (
                <div className="mb-6 bg-gray-50 rounded-xl p-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {getWeekDays().map((dayObj, index) => (
                      <button
                        key={dayObj.dateString}
                        onClick={() => handleDayChange(index)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap flex flex-col items-center gap-1 min-w-[70px] ${
                          selectedDay === index
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs opacity-80">{dayObj.month}</span>
                        <span className="text-lg">{dayObj.dayNumber}</span>
                        <span className="text-xs opacity-80">{dayObj.dayName.slice(0, 3)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Day's Meals */}
              {weeklyDishes.length > 0 && currentDay ? (
                <motion.div
                  key={currentDay.dateString}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Day Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-bold">{currentDay.dayNumber}</span>
                      <span className="text-xs">{currentDay.month}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{currentDay.dayName}</h3>
                      <p className="text-sm text-gray-500">
                        {currentDay.dishes.length} meal{currentDay.dishes.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                  </div>

                  {/* Meals List - Organized by Meal Type */}
                  {currentDay.dishes && currentDay.dishes.length > 0 ? (
                    // Sort dishes by meal type order (breakfast, lunch, dinner, snack)
                    currentDay.dishes
                      .sort((a, b) => {
                        const order = ['breakfast', 'lunch', 'dinner', 'snack', 'snacks'];
                        const aIndex = order.indexOf(a.mealType || '');
                        const bIndex = order.indexOf(b.mealType || '');
                        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
                      })
                      .map((dish, dishIndex) => (
                      <div
                        key={`${dish.mealType}-${dishIndex}`}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                      >
                        {/* Food Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                          {dish.foodIcon || '🍽️'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                              {dish.mealType}
                            </span>
                            {dish.orderStatus && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  dish.orderStatus === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : dish.orderStatus === "out_for_delivery"
                                    ? "bg-blue-100 text-blue-700"
                                    : dish.orderStatus === "confirmed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {dish.orderStatus?.replace(/_/g, " ") || "scheduled"}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-bold text-gray-900 mb-2">
                            {dish.name}
                          </h4>
                          
                          {/* Show all items if multiple */}
                          {dish.items && dish.items.length > 1 && (
                            <div className="mb-2 text-sm text-gray-600">
                              <span className="font-medium">Includes: </span>
                              {dish.items.map((item, idx) => (
                                <span key={idx}>
                                  {item.name}
                                  {idx < dish.items.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            {/* Chef Photo and Name */}
                            {dish.chefName && (
                              <div className="flex items-center gap-2">
                                {dish.chefAvatar ? (
                                  <img
                                    src={dish.chefAvatar}
                                    alt={dish.chefName}
                                    className="w-5 h-5 rounded-full object-cover border-2 border-emerald-200"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(dish.chefName || "Chef")}`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                                    {(dish.chefName || 'C')[0].toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">by {dish.chefName}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Nutritional Info */}
                          {dish.nutritionalInfo && (
                            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200">
                              {dish.nutritionalInfo.calories > 0 && (
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Calories</div>
                                  <div className="font-bold text-orange-600">{Math.round(dish.nutritionalInfo.calories)}</div>
                                </div>
                              )}
                              {dish.nutritionalInfo.protein > 0 && (
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Protein</div>
                                  <div className="font-bold text-blue-600">{Math.round(dish.nutritionalInfo.protein)}g</div>
                                </div>
                              )}
                              {dish.nutritionalInfo.carbs > 0 && (
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Carbs</div>
                                  <div className="font-bold text-green-600">{Math.round(dish.nutritionalInfo.carbs)}g</div>
                                </div>
                              )}
                              {dish.nutritionalInfo.fats > 0 && (
                                <div className="text-center">
                                  <div className="text-xs text-gray-500">Fats</div>
                                  <div className="font-bold text-purple-600">{Math.round(dish.nutritionalInfo.fats)}g</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No meals scheduled for {currentDay.dayName}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No meal plan scheduled for the week.</p>
                  <Link
                    to="/browse-chefs"
                    className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Order Now
                  </Link>
                </div>
              )}
            </div>

            {/* Today's Meals (Quick View) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Meals
                </h2>
                <Link
                  to="/meal-plan"
                  className="text-emerald-600 font-medium hover:text-emerald-700 text-sm"
                >
                  View Full Plan
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingMeals.length > 0 ? (
                  upcomingMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-emerald-100 hover:shadow-sm transition bg-gray-50"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex-shrink-0 flex items-center justify-center text-3xl">
                        {(() => {
                          const name = (meal.name || '').toLowerCase();
                          if (name.includes('chicken')) return '🍗';
                          if (name.includes('fish') || name.includes('salmon')) return '🐟';
                          if (name.includes('beef')) return '🥩';
                          if (name.includes('rice')) return '🍚';
                          if (name.includes('pasta')) return '🍝';
                          if (name.includes('salad')) return '🥗';
                          return '🍽️';
                        })()}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-bold text-gray-900">{meal.name}</h3>
                        <p className="text-sm text-gray-500">
                          by Chef {meal.chef} • {meal.calories} kcal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {meal.time}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            meal.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : meal.status === "out_for_delivery"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {meal.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No meals scheduled for today.</p>
                    <Link
                      to="/browse-chefs"
                      className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Order Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/browse-chefs"
                  className="p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex flex-col items-center text-center gap-2"
                >
                  <ChefHat className="w-6 h-6" />
                  <span className="font-medium text-sm">Find Chef</span>
                </Link>
                <Link
                  to="/create-diet-plan"
                  className="p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex flex-col items-center text-center gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  <span className="font-medium text-sm">Diet Plan</span>
                </Link>
                <Link
                  to="/order-tracking"
                  className="p-4 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition flex flex-col items-center text-center gap-2"
                >
                  <Package className="w-6 h-6" />
                  <span className="font-medium text-sm">Track Order</span>
                </Link>
                <Link
                  to="/payment-history"
                  className="p-4 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex flex-col items-center text-center gap-2"
                >
                  <Receipt className="w-6 h-6" />
                  <span className="font-medium text-sm">Payments</span>
                </Link>
                <Link
                  to="/meal-plan"
                  className="p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex flex-col items-center text-center gap-2"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="font-medium text-sm">Meal Plan</span>
                </Link>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Star
                    className="w-6 h-6 text-yellow-300"
                    fill="currentColor"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Daily Tip</h3>
                  <p className="text-emerald-50 text-sm leading-relaxed">
                    Drinking water before meals can help you feel fuller and aid
                    in digestion. Aim for a glass 30 mins before eating!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
