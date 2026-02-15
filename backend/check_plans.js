
const axios = require('axios');

async function checkPlans() {
  try {
    const response = await axios.get('http://localhost:5000/api/plans');
    console.log('Plans:', response.data.data.map(p => p.planId));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPlans();
