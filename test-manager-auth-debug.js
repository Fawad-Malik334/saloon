const axios = require('axios');

const BASE_URL = 'https://e0c20009c203.ngrok-free.app/api';

async function testManagerAuth() {
  console.log('🧪 Testing Manager Authentication...\n');

  try {
    // Test 1: Check if manager login endpoint exists
    console.log('1️⃣ Testing Manager Login Endpoint...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/manager/login`, {
        email: 'manager@test.com',
        password: 'password123',
      });

      console.log('✅ Manager login successful:', loginResponse.status);
      console.log('📋 Response data:', loginResponse.data);

      if (loginResponse.data && loginResponse.data.token) {
        const token = loginResponse.data.token;
        console.log('✅ Got manager token:', token.substring(0, 20) + '...');

        // Test 2: Test attendance endpoint with manager token
        console.log('\n2️⃣ Testing Attendance Endpoint with Manager Token...');
        try {
          const attendanceResponse = await axios.get(
            `${BASE_URL}/attendance/all`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );

          console.log(
            '✅ Attendance API call successful:',
            attendanceResponse.status,
          );
          console.log(
            '📊 Attendance records:',
            attendanceResponse.data?.length || 0,
          );
        } catch (attendanceError) {
          console.log(
            '❌ Attendance API call failed:',
            attendanceError.response?.status,
            attendanceError.response?.data?.message,
          );
        }

        // Test 3: Test employee check-in with manager token
        console.log('\n3️⃣ Testing Employee Check-In with Manager Token...');
        try {
          const formData = new FormData();
          formData.append('employeeId', 'EMP001');
          formData.append('image', {
            uri: 'test.jpg',
            type: 'image/jpeg',
            name: 'test.jpg',
          });

          const checkinResponse = await axios.post(
            `${BASE_URL}/attendance/checkin`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          console.log(
            '✅ Employee check-in successful:',
            checkinResponse.status,
          );
        } catch (checkinError) {
          console.log(
            '❌ Employee check-in failed:',
            checkinError.response?.status,
            checkinError.response?.data?.message,
          );
        }
      }
    } catch (loginError) {
      console.log(
        '❌ Manager login failed:',
        loginError.response?.status,
        loginError.response?.data?.message,
      );
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testManagerAuth();
