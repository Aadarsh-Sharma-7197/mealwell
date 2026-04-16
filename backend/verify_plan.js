const mongoose = require('mongoose');
const User = require('./models/User');
const DietPlan = require('./models/DietPlan');

const MONGO_URI = 'mongodb+srv://aadarshsharma7197_db_user:rOf3vSwHHwdJCM1Z@mealwell-cluster.0tz6gn1.mongodb.net/mealwell?retryWrites=true&w=majority&appName=mealwell-cluster';

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
