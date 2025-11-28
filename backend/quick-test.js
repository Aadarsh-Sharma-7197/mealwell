const axios = require('axios');

async function quickTest() {
  console.log('🧪 Testing MealWell Backend...\n');
  
  try {
    // Test 1: Root
    console.log('1. Testing root endpoint...');
    const root = await axios.get('http://localhost:5000');
    console.log('✅ Root working:', root.data.message);
    
    // Test 2: Health
    console.log('\n2. Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health working:', health.data.status);
    
    // Test 3: Register
    console.log('\n3. Testing registration...');
    const registerData = {
      name: 'Aadarsh Sharma',
      email: `test${Date.now()}@test.com`,
      phone: `98765${Math.floor(Math.random() * 100000)}`,
      password: 'Test1234',
      userType: 'customer'
    };
    
    const register = await axios.post('http://localhost:5000/api/auth/register', registerData);
    console.log('✅ Registration working!');
    console.log('   User:', register.data.user.name);
    console.log('   Token:', register.data.token.substring(0, 30) + '...');
    
    // Test 4: Login
    console.log('\n4. Testing login...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login working!');
    
    // Test 5: Protected Route
    console.log('\n5. Testing protected route...');
    const me = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${login.data.token}` }
    });
    console.log('✅ Protected route working!');
    console.log('   User:', me.data.user.name);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED!');
    console.log('🎉 Backend is fully working!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.log('\n❌ TEST FAILED!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else if (error.request) {
      console.log('Cannot connect to server!');
      console.log('Make sure server is running on http://localhost:5000');
    } else {
      console.log('Error:', error.message);
    }
  }
}

quickTest();
