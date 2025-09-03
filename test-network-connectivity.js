const axios = require('axios');

const BASE_URL = 'https://e0c20009c203.ngrok-free.app/api';

async function testNetworkConnectivity() {
  console.log('🌐 Testing Network Connectivity...\n');

  try {
    // Test 1: Health endpoint
    console.log('1️⃣ Testing Health Endpoint...');
    try {
      const healthResponse = await axios.get(
        `${BASE_URL.replace('/api', '')}/health`,
        {
          timeout: 5000,
        },
      );
      console.log('✅ Health endpoint accessible:', healthResponse.status);
      console.log('✅ Response:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health endpoint failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend server not running');
      } else if (error.code === 'ENOTFOUND') {
        console.log('❌ Ngrok tunnel not accessible');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('❌ Request timed out');
      }
    }

    // Test 2: API base endpoint
    console.log('\n2️⃣ Testing API Base Endpoint...');
    try {
      const apiResponse = await axios.get(`${BASE_URL}`, {
        timeout: 5000,
      });
      console.log('✅ API base accessible:', apiResponse.status);
    } catch (error) {
      console.log('❌ API base failed:', error.message);
    }

    // Test 3: Attendance endpoint (without auth)
    console.log('\n3️⃣ Testing Attendance Endpoint...');
    try {
      const attendanceResponse = await axios.get(`${BASE_URL}/attendance/all`, {
        timeout: 5000,
      });
      console.log(
        '✅ Attendance endpoint accessible:',
        attendanceResponse.status,
      );
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ Attendance endpoint exists (401 Unauthorized - Expected)',
        );
      } else {
        console.log('❌ Attendance endpoint failed:', error.message);
      }
    }

    // Test 4: Manager face login endpoint
    console.log('\n4️⃣ Testing Manager Face Login Endpoint...');
    try {
      const faceLoginResponse = await axios.post(
        `${BASE_URL}/manager/face-login`,
        {
          managerId: 'test',
          name: 'test',
          faceVerified: true,
        },
        {
          timeout: 5000,
        },
      );
      console.log(
        '✅ Manager face login accessible:',
        faceLoginResponse.status,
      );
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(
          '✅ Manager face login exists (400 Bad Request - Expected)',
        );
      } else {
        console.log('❌ Manager face login failed:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎯 Network Status:');
  console.log('   - Check if backend server is running');
  console.log('   - Check if ngrok tunnel is active');
  console.log('   - Check if internet connection is stable');
  console.log('   - Check if BASE_URL is correct');
}

// Run the test
testNetworkConnectivity();
