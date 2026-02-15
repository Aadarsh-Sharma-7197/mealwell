const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust path to reach backend .env
const Plan = require('../models/Plan');

const ensurePlans = async () => {
  try {
    console.log('--- Connecting to MongoDB ---');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mealwell');
    console.log('✅ Connected');

    const quarterlyPlan = {
      planId: 'quarterly',
      name: 'Quarterly Elite',
      description: 'Commit to a lifestyle change',
      price: 20999,
      originalPrice: 26999,
      discount: 22,
      totalMeals: 180,
      durationDays: 90,
      features: [
        'All Meals',
        'Dietitian Consultation',
        'Premium Support',
        'Exclusive Menu',
      ],
      isActive: true
    };

    const existingPlan = await Plan.findOne({ planId: 'quarterly' });
    
    if (existingPlan) {
      console.log('ℹ️ Quarterly plan already exists. Updating...');
      Object.assign(existingPlan, quarterlyPlan);
      await existingPlan.save();
      console.log('✅ Quarterly plan updated.');
    } else {
      console.log('ℹ️ Quarterly plan not found. Creating...');
      await Plan.create(quarterlyPlan);
      console.log('✅ Quarterly plan created.');
    }

    // Also verify weekly and monthly just in case
    const otherPlans = [
        {
            planId: "weekly",
            name: "Weekly Starter",
            description: "Perfect for trying out MealWell",
            price: 1999,
            totalMeals: 14,
            durationDays: 7,
            features: ["2 Meals/Day", "Basic Customization", "Weekend Support"],
        },
        {
            planId: "monthly",
            name: "Monthly Pro",
            description: "Most popular for consistent healthy eating",
            price: 7499,
            originalPrice: 8999,
            discount: 15,
            totalMeals: 60,
            durationDays: 30,
            features: [
            "2 Meals/Day",
            "Full Customization",
            "Priority Support",
            "Free Delivery",
            ],
        }
    ];

    for (const p of otherPlans) {
        const exist = await Plan.findOne({ planId: p.planId });
        if (!exist) {
            await Plan.create(p);
            console.log(`✅ Created missing plan: ${p.name}`);
        }
    }

    console.log('--- Done ---');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

ensurePlans();
