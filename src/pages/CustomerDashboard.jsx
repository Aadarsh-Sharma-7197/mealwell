import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Clock, Star, ChefHat, Bell, Settings, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Meals This Week', value: '12', icon: Package, colorClass: 'bg-emerald-100', iconColorClass: 'text-emerald-600' },
    { label: 'Calories Today', value: '1,850', icon: Heart, colorClass: 'bg-red-100', iconColorClass: 'text-red-600' },
    { label: 'Streak Days', value: '23', icon: TrendingUp, colorClass: 'bg-blue-100', iconColorClass: 'text-blue-600' },
    { label: 'Active Plan', value: 'Monthly', icon: Star, colorClass: 'bg-yellow-100', iconColorClass: 'text-yellow-600' }
  ];

  const upcomingMeals = [
    { time: '12:30 PM', name: 'Grilled Chicken Salad', chef: 'Sarah Kumar', status: 'preparing', calories: 450 },
    { time: '7:00 PM', name: 'Quinoa Buddha Bowl', chef: 'Raj Patel', status: 'scheduled', calories: 520 },
    { time: 'Tomorrow 8:00 AM', name: 'Protein Smoothie Bowl', chef: 'Priya Sharma', status: 'scheduled', calories: 380 }
  ];

  const weekProgress = [
    { day: 'Mon', completed: true, calories: 1800 },
    { day: 'Tue', completed: true, calories: 1850 },
    { day: 'Wed', completed: true, calories: 1900 },
    { day: 'Thu', completed: false, calories: 0 },
    { day: 'Fri', completed: false, calories: 0 },
    { day: 'Sat', completed: false, calories: 0 },
    { day: 'Sun', completed: false, calories: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome back, Alex!</h1>
            <p className="text-gray-600">Here's your nutrition overview for today</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link to="/settings" className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all border border-gray-200">
              <Bell className="w-5 h-5 text-gray-600" />
            </Link>
            <Link to="/settings" className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all border border-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
            <Link to="/profile" className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow hover:shadow-md transition-all">
              <User className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.colorClass} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColorClass}`} />
                </div>
                <span className="text-xs text-gray-500 font-medium">Today</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Upcoming Meals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Meals</h2>
                <Link to="/meal-plan" className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingMeals.map((meal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{meal.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          meal.status === 'preparing' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {meal.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {meal.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChefHat className="w-4 h-4" />
                          {meal.chef}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>
                    <Link 
                      to="/order-tracking"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all opacity-0 group-hover:opacity-100"
                    >
                      Track
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Progress</h2>
              <div className="grid grid-cols-7 gap-3">
                {weekProgress.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className={`text-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      day.completed 
                        ? 'bg-emerald-50 border-emerald-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-2">{day.day}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      day.completed ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}>
                      {day.completed && <span className="text-white text-lg">✓</span>}
                    </div>
                    <div className="text-xs text-gray-500">{day.calories || '-'}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Goal */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4">Today's Goal</h3>
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/30"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.72)}`}
                      className="text-white"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-3xl font-black">72%</div>
                    <div className="text-xs opacity-80">Complete</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">1,850 / 2,500</div>
                  <div className="text-sm opacity-90">Calories consumed</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/meal-plan"
                  className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  View Meal Plan
                </Link>
                <Link
                  to="/browse-chefs"
                  className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-5 h-5" />
                  Browse Chefs
                </Link>
                <Link
                  to="/health-insights"
                  className="w-full p-4 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Health Insights
                </Link>
                <Link
                  to="/order-tracking"
                  className="w-full p-4 bg-orange-50 text-orange-700 rounded-xl font-semibold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Track Orders
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {['🔥', '💪', '⭐'].map((badge, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl cursor-pointer shadow-md hover:shadow-lg transition-all"
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
