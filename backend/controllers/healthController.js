const HealthLog = require('../models/HealthLog');
const Customer = require('../models/Customer');

// @desc    Get health stats and insights
// @route   GET /api/health
// @access  Private (Customer)
exports.getHealthStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get health logs for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const logs = await HealthLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Get customer profile for targets
    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found'
      });
    }

    // Calculate stats
    const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : 78; // Fallback
    const previousWeight = logs.length > 1 ? logs[0].weight : currentWeight;
    const weightChange = ((currentWeight - previousWeight) / previousWeight) * 100;
    
    const avgCalories = logs.length > 0 
      ? Math.round(logs.reduce((acc, log) => acc + log.calories, 0) / logs.length) 
      : 2000;
      
    const avgProtein = logs.length > 0 
      ? Math.round(logs.reduce((acc, log) => acc + log.protein, 0) / logs.length) 
      : 120;

    const stats = [
      {
        label: 'Weight Progress',
        value: `${(currentWeight - previousWeight).toFixed(1)} kg`,
        change: `${weightChange.toFixed(1)}%`,
        trend: weightChange <= 0 ? 'down' : 'up',
        target: `Target: ${customer.weightGoal || 75} kg`, // Assuming field exists or fallback
        currentValue: currentWeight
      },
      {
        label: 'Avg Calories',
        value: avgCalories.toString(),
        change: '+5%', // Mock calculation or real comparison with prev week
        trend: 'up',
        target: `Goal: ${customer.calorieTarget || 2000} kcal`
      },
      {
        label: 'Protein Intake',
        value: `${avgProtein}g`,
        change: '+12%',
        trend: 'up',
        target: 'Goal: 120g'
      },
      {
        label: 'Heart Rate',
        value: logs.length > 0 ? `${logs[logs.length-1].heartRate} bpm` : '70 bpm',
        change: '-2 bpm',
        trend: 'down',
        target: 'Resting: Normal'
      }
    ];

    // Format weekly data for charts
    const weeklyData = logs.map(log => ({
      day: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: log.calories,
      weight: log.weight,
      protein: log.protein
    }));

    // Mock achievements for now (or store in DB later)
    const achievements = [
      { id: 1, title: '7 Day Streak', icon: '🔥', unlocked: true, date: 'Dec 20, 2025' },
      { id: 2, title: 'Lost 5kg', icon: '⚖️', unlocked: weightChange < -5, date: 'Dec 15, 2025' },
      { id: 3, title: 'Protein Master', icon: '💪', unlocked: avgProtein > 100, date: 'Dec 10, 2025' },
      { id: 4, title: '30 Day Streak', icon: '🏆', unlocked: false, date: 'In Progress' },
      { id: 5, title: 'Marathon Ready', icon: '🏃', unlocked: false, date: 'Locked' },
      { id: 6, title: 'Nutrition Pro', icon: '🎓', unlocked: false, date: 'Locked' }
    ];

    res.json({
      success: true,
      data: {
        stats,
        weeklyData,
        achievements,
        healthScore: 85 + Math.floor(Math.random() * 10) // Mock score
      }
    });

  } catch (error) {
    console.error('Get health stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
