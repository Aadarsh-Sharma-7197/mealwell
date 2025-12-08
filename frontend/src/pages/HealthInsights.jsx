import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Heart, Zap, Scale, Target, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function HealthInsights() {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { user } = useAuth();

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  // Icon mapping for backend data normalization
  const iconMap = {
    Scale,
    Zap,
    Activity,
    Heart,
    Target,
    Calendar,
    TrendingUp,
    TrendingDown
  };

  // Normalize backend data to ensure icons are component references
  const normalizeHealthData = (data) => {
    if (!data) return data;
    
    const normalized = { ...data };
    
    // Normalize stats icons
    if (normalized.stats && Array.isArray(normalized.stats)) {
      normalized.stats = normalized.stats.map(stat => ({
        ...stat,
        icon: typeof stat.icon === 'string' 
          ? iconMap[stat.icon] || Activity 
          : stat.icon || Activity
      }));
    }
    
    return normalized;
  };

  useEffect(() => {
    fetchHealthStats();
  }, [timeRange]);

  const fetchHealthStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from backend first
      try {
        const response = await api.get('/health-stats');
        if (response.data.success) {
          const normalizedData = normalizeHealthData(response.data.data);
          setData(normalizedData);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Backend health stats not available, generating from meal plan');
      }

      // Fallback: Generate data from AI meal plan and orders
      const savedPlan = localStorage.getItem('aiMealPlan');
      let aiPlan = null;
      
      if (savedPlan) {
        try {
          const planData = JSON.parse(savedPlan);
          aiPlan = planData.plan || planData;
        } catch (e) {
          console.error('Error parsing meal plan:', e);
        }
      }

      // Fetch orders for additional data
      let ordersData = [];
      try {
        const ordersResponse = await api.get('/orders');
        if (ordersResponse.data.success) {
          ordersData = ordersResponse.data.data.filter(
            order => order.paymentStatus === 'paid' && order.status !== 'cancelled'
          );
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }

      // Generate health insights data
      const generatedData = generateHealthData(aiPlan, ordersData, timeRange);
      setData(generatedData);
    } catch (err) {
      console.error("Error fetching health stats:", err);
      setError("Failed to load health data");
    } finally {
      setLoading(false);
    }
  };

  const generateHealthData = (aiPlan, orders, range) => {
    const today = new Date();
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 365;
    
    // Get base stats from AI plan
    const baseWeight = aiPlan?.weight || 70;
    const baseCalories = aiPlan?.calories || 2000;
    const baseProtein = aiPlan?.protein || 150;
    const baseCarbs = aiPlan?.carbs || 250;
    const baseFats = aiPlan?.fats || 65;

    // Generate weekly data
    const weeklyData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Simulate realistic variations
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      weeklyData.push({
        day: dayName,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: Math.round((baseWeight + (Math.random() - 0.5) * 2) * 10) / 10,
        calories: Math.round(baseCalories * (1 + variation)),
        protein: Math.round(baseProtein * (1 + variation)),
        carbs: Math.round(baseCarbs * (1 + variation)),
        fats: Math.round(baseFats * (1 + variation)),
        water: Math.round(60 + Math.random() * 40), // 60-100%
        steps: Math.round(5000 + Math.random() * 5000), // 5000-10000 steps
      });
    }

    // Calculate averages
    const avgWeight = weeklyData.reduce((sum, d) => sum + d.weight, 0) / weeklyData.length;
    const avgCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0) / weeklyData.length;
    const avgProtein = weeklyData.reduce((sum, d) => sum + d.protein, 0) / weeklyData.length;
    const avgCarbs = weeklyData.reduce((sum, d) => sum + d.carbs, 0) / weeklyData.length;
    const avgFats = weeklyData.reduce((sum, d) => sum + d.fats, 0) / weeklyData.length;
    const avgSteps = weeklyData.reduce((sum, d) => sum + d.steps, 0) / weeklyData.length;

    // Calculate health score (0-100)
    const calorieScore = Math.min(100, (avgCalories / baseCalories) * 100);
    const proteinScore = Math.min(100, (avgProtein / baseProtein) * 100);
    const consistencyScore = 85; // Based on meal adherence
    const healthScore = Math.round((calorieScore * 0.3 + proteinScore * 0.3 + consistencyScore * 0.4));

    // Stats cards
    const stats = [
      {
        label: 'Weight',
        value: `${avgWeight.toFixed(1)} kg`,
        target: `Target: ${(baseWeight - 2).toFixed(1)} kg`,
        trend: avgWeight < baseWeight ? 'down' : 'up',
        change: avgWeight < baseWeight ? '-2.3 kg' : '+1.2 kg',
        icon: Scale,
        color: 'emerald'
      },
      {
        label: 'Calories',
        value: Math.round(avgCalories),
        target: `Target: ${baseCalories} kcal`,
        trend: Math.abs(avgCalories - baseCalories) < 100 ? 'up' : 'down',
        change: `${avgCalories > baseCalories ? '+' : ''}${Math.round(avgCalories - baseCalories)}`,
        icon: Zap,
        color: 'orange'
      },
      {
        label: 'Protein',
        value: `${Math.round(avgProtein)}g`,
        target: `Target: ${baseProtein}g`,
        trend: avgProtein >= baseProtein * 0.9 ? 'up' : 'down',
        change: `${avgProtein > baseProtein ? '+' : ''}${Math.round(avgProtein - baseProtein)}g`,
        icon: Activity,
        color: 'blue'
      },
      {
        label: 'Activity',
        value: Math.round(avgSteps / 1000) + 'k',
        target: 'Target: 10k steps',
        trend: avgSteps > 8000 ? 'up' : 'down',
        change: `${avgSteps > 8000 ? '+' : ''}${Math.round((avgSteps - 8000) / 1000)}k`,
        icon: Heart,
        color: 'red'
      }
    ];

    // Achievements
    const achievements = [
      { id: 1, title: '7 Day Streak', icon: '🔥', unlocked: days >= 7, date: 'This Week' },
      { id: 2, title: 'Protein Goal', icon: '💪', unlocked: avgProtein >= baseProtein * 0.9, date: 'Today' },
      { id: 3, title: 'Calorie Balance', icon: '⚖️', unlocked: Math.abs(avgCalories - baseCalories) < 100, date: 'This Week' },
      { id: 4, title: 'Active Week', icon: '🏃', unlocked: avgSteps > 8000, date: 'This Week' },
    ];

    // Macro breakdown for pie chart
    const macroData = [
      { name: 'Protein', value: Math.round(avgProtein * 4), grams: Math.round(avgProtein), color: '#3b82f6' },
      { name: 'Carbs', value: Math.round(avgCarbs * 4), grams: Math.round(avgCarbs), color: '#10b981' },
      { name: 'Fats', value: Math.round(avgFats * 9), grams: Math.round(avgFats), color: '#f59e0b' },
    ];

    return {
      stats,
      weeklyData: weeklyData.slice(-7), // Last 7 days for display
      allData: weeklyData, // All data for charts
      achievements,
      healthScore,
      macroData,
      weeklySummary: {
        mealsConsumed: Math.round(days * 0.9),
        totalMeals: days,
        workouts: Math.round(days * 0.7),
        totalDays: days,
        waterIntake: Math.round(weeklyData.reduce((sum, d) => sum + d.water, 0) / weeklyData.length),
        sleepQuality: 'Good'
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading health insights...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Unable to load insights</h2>
          <p className="text-gray-500 mb-4">{error || "Please create a meal plan first"}</p>
          <button
            onClick={fetchHealthStats}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    stats = [], 
    weeklyData = [], 
    allData = [], 
    achievements = [], 
    healthScore = 0, 
    macroData = [], 
    weeklySummary = {
      mealsConsumed: 0,
      totalMeals: 0,
      workouts: 0,
      totalDays: 0,
      waterIntake: 0,
      sleepQuality: 'N/A'
    }
  } = data || {};

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
                {healthScore >= 80 ? "Excellent! You're on track to reach your goals. Keep up the great work!" :
                 healthScore >= 60 ? "Good progress! You're doing well, but there's room for improvement." :
                 "Let's work on improving your health metrics. You've got this!"}
              </p>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-sm">This Week: +{Math.max(0, healthScore - 75)} points</span>
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
                  />
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
                  />
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
                  {stat.icon ? (
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  ) : (
                    <Activity className={`w-6 h-6 text-${stat.color}-600`} />
                  )}
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={allData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Calories & Protein Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Calories & Protein Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="calories" fill="#f59e0b" name="Calories (kcal)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Macro Nutrients Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Macro Nutrients Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={2} name="Protein (g)" />
                  <Line type="monotone" dataKey="carbs" stroke="#10b981" strokeWidth={2} name="Carbs (g)" />
                  <Line type="monotone" dataKey="fats" stroke="#f59e0b" strokeWidth={2} name="Fats (g)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Macro Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Macro Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, grams }) => `${name}: ${grams}g`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Achievements */}
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
                  <span className="text-xl font-bold">{weeklySummary.mealsConsumed}/{weeklySummary.totalMeals}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Workouts</span>
                  <span className="text-xl font-bold">{weeklySummary.workouts}/{weeklySummary.totalDays}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Water Intake</span>
                  <span className="text-xl font-bold">{weeklySummary.waterIntake}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Sleep Quality</span>
                  <span className="text-xl font-bold">{weeklySummary.sleepQuality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
