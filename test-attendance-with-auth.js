const axios = require('axios');

const BASE_URL = 'https://e0c20009c203.ngrok-free.app/api';

async function testAttendanceWithAuth() {
  console.log('🧪 Testing Attendance Endpoints with Authentication...\n');

  try {
    // Test 1: Employee Attendance API with auth
    console.log(
      '1️⃣ Testing Employee Attendance API (/attendance/all) with auth...',
    );
    try {
      // First, let's try to get a token by logging in
      const loginResponse = await axios.post(`${BASE_URL}/manager/login`, {
        email: 'manager@test.com',
        password: 'password123',
      });

      if (loginResponse.data && loginResponse.data.token) {
        const token = loginResponse.data.token;
        console.log('✅ Got manager token:', token.substring(0, 20) + '...');

        const employeeResponse = await axios.get(`${BASE_URL}/attendance/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(
          '✅ Employee attendance API call successful:',
          employeeResponse.status,
        );
        console.log(
          '📊 Employee attendance records:',
          employeeResponse.data?.length || 0,
        );
      } else {
        console.log('❌ Could not get authentication token');
      }
    } catch (error) {
      console.log(
        '❌ Employee attendance API call failed:',
        error.response?.status,
        error.response?.data?.message,
      );
    }

    // Test 2: Admin Attendance API with auth
    console.log(
      '\n2️⃣ Testing Admin Attendance API (/admin/attendance/all) with auth...',
    );
    try {
      // First, let's try to get an admin token by logging in
      const adminLoginResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'admin@test.com',
        password: 'password123',
      });

      if (adminLoginResponse.data && adminLoginResponse.data.token) {
        const adminToken = adminLoginResponse.data.token;
        console.log('✅ Got admin token:', adminToken.substring(0, 20) + '...');

        const adminResponse = await axios.get(
          `${BASE_URL}/admin/attendance/all`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(
          '✅ Admin attendance API call successful:',
          adminResponse.status,
        );
        console.log(
          '📊 Admin attendance records:',
          adminResponse.data?.length || 0,
        );
      } else {
        console.log('❌ Could not get admin authentication token');
      }
    } catch (error) {
      console.log(
        '❌ Admin attendance API call failed:',
        error.response?.status,
        error.response?.data?.message,
      );
    }

    // Test 3: Combined Attendance API with auth
    console.log(
      '\n3️⃣ Testing Combined Attendance API (/admin/attendance/combined) with auth...',
    );
    try {
      // Use the same admin token from above
      const adminLoginResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'admin@test.com',
        password: 'password123',
      });

      if (adminLoginResponse.data && adminLoginResponse.data.token) {
        const adminToken = adminLoginResponse.data.token;

        const combinedResponse = await axios.get(
          `${BASE_URL}/admin/attendance/combined`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(
          '✅ Combined attendance API call successful:',
          combinedResponse.status,
        );
        console.log(
          '📊 Combined attendance records:',
          combinedResponse.data?.length || 0,
        );
      } else {
        console.log(
          '❌ Could not get admin authentication token for combined API',
        );
      }
    } catch (error) {
      console.log(
        '❌ Combined attendance API call failed:',
        error.response?.status,
        error.response?.data?.message,
      );
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAttendanceWithAuth();
