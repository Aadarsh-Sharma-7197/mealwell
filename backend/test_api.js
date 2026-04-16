const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const TEST_USER = {
  name: 'Persistence Test User',
  email: `test_persist_${Date.now()}@test.com`,
  password: 'password123',
  phone: '1234567890',
  userType: 'customer'
};

const runTest = async () => {
  try {
    console.log('1️⃣ Registering User...', TEST_USER.email);
    const regRes = await axios.post(`${API_URL}/auth/register`, TEST_USER);
    const token = regRes.data.token;
    console.log('✅ Registered & Logged In. Token received.');

    console.log('2️⃣ Saving Plan...');
    const dummyPlan = { 
        calories: 2000, 
        days: [{ day: 1, meals: { breakfast: { items: [{ name: "Test Egg" }] } } }] 
    };
    
    await axios.post(
      `${API_URL}/ai/save-plan`, 
      { plan: dummyPlan },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Plan Save Request Sent.');

    console.log('3️⃣ Fetching Plan...');
    const fetchRes = await axios.get(
      `${API_URL}/ai/my-plan`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (fetchRes.data.success && fetchRes.data.plan.calories === 2000) {
        console.log('✅ Plan Fetched Successfully!');
        console.log('   Calories:', fetchRes.data.plan.calories);
    } else {
        console.log('❌ Plan Fetch Failed or Mismatched.');
        console.log(fetchRes.data);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
  }
};

runTest();
