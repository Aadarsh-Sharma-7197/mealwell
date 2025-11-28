import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Heart, Zap, Scale, Target, Calendar } from 'lucide-react';

export default function HealthInsights() {
  const [timeRange, setTimeRange] = useState('week');

  const stats = [
    {
      label: 'Weight Progress',
      value: '-3.2 kg',
      change: '-4.2%',
      trend: 'down',
      icon: Scale,
      color: 'emerald',
      target: 'Target: 75 kg'
    },
    {
      label: 'Avg Calories',
      value: '1,850',
      change: '+5%',
      trend: 'up',
      icon: Zap,
      color: 'orange',
      target: 'Goal: 2,000 kcal'
    },
    {
      label: 'Protein Intake',
      value: '125g',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
      target: 'Goal: 120g'
    },
    {
      label: 'Heart Rate',
      value: '68 bpm',
      change: '-3 bpm',
      trend: 'down',
      icon: Heart,
      color: 'red',
      target: 'Resting: Normal'
    }
  ];

  const weeklyData = [
    { day: 'Mon', calories: 1800, weight: 78.5, protein: 115 },
    { day: 'Tue', calories: 1850, weight: 78.3, protein: 120 },
    { day: 'Wed', calories: 1900, weight: 78.0, protein: 125 },
    { day: 'Thu', calories: 1820, weight: 77.8, protein: 118 },
    { day: 'Fri', calories: 1880, weight: 77.5, protein: 128 },
    { day: 'Sat', calories: 1950, weight: 77.2, protein: 130 },
    { day: 'Sun', calories: 1900, weight: 77.0, protein: 125 }
  ];

  const achievements = [
    { id: 1, title: '7 Day Streak', icon: '🔥', unlocked: true, date: 'Dec 20, 2025' },
    { id: 2, title: 'Lost 5kg', icon: '⚖️', unlocked: true, date: 'Dec 15, 2025' },
    { id: 3, title: 'Protein Master', icon: '💪', unlocked: true, date: 'Dec 10, 2025' },
    { id: 4, title: '30 Day Streak', icon: '🏆', unlocked: false, date: 'In Progress' },
    { id: 5, title: 'Marathon Ready', icon: '🏃', unlocked: false, date: 'Locked' },
    { id: 6, title: 'Nutrition Pro', icon: '🎓', unlocked: false, date: 'Locked' }
  ];

  const healthScore = 87;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Health Insights</h1>
            <p className="text-gray-600">Track your progress and achieve your goals</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {['week', 'month', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all capitalize ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Health Score Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-2xl mb-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2 opacity-90">Your Health Score</h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-7xl font-black">{healthScore}</span>
                <span className="text-3xl opacity-80">/100</span>
              </div>
              <p className="text-lg opacity-90 mb-6">
                Excellent! You're on track to reach your goals. Keep up the great work!
              </p>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-sm">This Week: +5 points</span>
                </div>
              </div>
            </div>
            
            {/* Circular Progress */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    className="text-white/30"
                  ></circle>
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - healthScore / 100)}`}
                    className="text-white"
                    strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-emerald-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.target}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Progress Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weight Progress</h3>
              <div className="flex items-end justify-between h-64 gap-2">
                {weeklyData.map((data, i) => {
                  const maxWeight = Math.max(...weeklyData.map(d => d.weight));
                  const minWeight = Math.min(...weeklyData.map(d => d.weight));
                  const height = ((data.weight - minWeight) / (maxWeight - minWeight)) * 100;
                  
                  return (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-bold text-gray-500">{data.weight}kg</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-xl min-h-[20%] hover:from-emerald-600 hover:to-green-500 transition-all cursor-pointer relative group"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {data.weight}kg
                        </div>
                      </motion.div>
                      <div className="text-xs font-semibold text-gray-600">{data.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calories & Protein Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Calories & Protein Intake</h3>
              <div className="flex items-end justify-between h-64 gap-2">
                {weeklyData.map((data, i) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1 flex-grow justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.calories / 2000) * 100}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="w-full bg-gradient-to-t from-orange-400 to-red-400 rounded-t-lg hover:from-orange-500 hover:to-red-500 transition-all cursor-pointer"
                        title={`${data.calories} kcal`}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.protein / 150) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.05 }}
                        className="w-full bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t-lg hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer"
                        title={`${data.protein}g protein`}
                      />
                    </div>
                    <div className="text-xs font-semibold text-gray-600">{data.day}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded" />
                  <span className="text-sm text-gray-600">Calories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded" />
                  <span className="text-sm text-gray-600">Protein</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: achievement.unlocked ? 1.05 : 1, rotate: achievement.unlocked ? 5 : 0 }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg cursor-pointer'
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="text-xs font-bold text-gray-900 mb-1">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.date}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4">This Week Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Meals Consumed</span>
                  <span className="text-xl font-bold">28/28</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Workouts</span>
                  <span className="text-xl font-bold">5/7</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Water Intake</span>
                  <span className="text-xl font-bold">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Sleep Quality</span>
                  <span className="text-xl font-bold">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
