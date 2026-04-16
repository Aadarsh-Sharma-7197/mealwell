const dotenv = require("dotenv");
const mongoose = require('mongoose');
const User = require('./models/User');
const DietPlan = require('./models/DietPlan');
dotenv.config()
const MONGO_URI = process.env.MONGO_URI;

const verifyPlans = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find().select('name email _id createdAt');
    console.log(`\n=== USERS (${users.length}) ===`);
    for (const u of users) {
        console.log(`User: ${u.name} (${u.email})`);
        console.log(`ID: ${u._id}`);
        console.log(`Joined: ${u.createdAt}`);
        // Check for plan
        const p = await DietPlan.findOne({ userId: u._id });
        if (p) console.log(`✅ HAS PLAN: ${p._id}`);
        else console.log(`❌ NO PLAN`);
        console.log('---');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
};

verifyPlans();
