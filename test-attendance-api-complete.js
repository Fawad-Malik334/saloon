const axios = require('axios');

const BASE_URL = 'https://e0c20009c203.ngrok-free.app/api';

async function testAttendanceAPIComplete() {
  console.log('🧪 Testing Attendance API Endpoints & Authentication...\n');

  try {
    // Test 1: Check if attendance endpoints exist
    console.log('1️⃣ Testing Attendance Endpoints Existence...');

    const endpoints = [
      '/attendance/checkin',
      '/attendance/checkout',
      '/attendance/all',
      '/admin/attendance/all',
      '/admin/attendance/combined',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ ${endpoint} - Exists (401 Unauthorized - Expected)`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${endpoint} - Not Found (404)`);
        } else {
          console.log(`⚠️ ${endpoint} - Error: ${error.response?.status}`);
        }
      }
    }

    // Test 2: Test manager authentication flow
    console.log('\n2️⃣ Testing Manager Authentication Flow...');

    try {
      // First, try to get a manager token by face login
      console.log('📡 Attempting manager face login...');

      const faceLoginResponse = await axios.post(
        `${BASE_URL}/manager/face-login`,
        {
          managerId: 'test_manager_id',
          name: 'Test Manager',
          faceVerified: true,
        },
      );

      if (faceLoginResponse.data && faceLoginResponse.data.token) {
        const managerToken = faceLoginResponse.data.token;
        console.log(
          '✅ Got manager token:',
          managerToken.substring(0, 20) + '...',
        );

        // Test attendance endpoints with manager token
        console.log('\n📡 Testing attendance endpoints with manager token...');

        try {
          const attendanceResponse = await axios.get(
            `${BASE_URL}/attendance/all`,
            {
              headers: {
                Authorization: `Bearer ${managerToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          console.log(
            '✅ /attendance/all with manager token - Success:',
            attendanceResponse.status,
          );
        } catch (error) {
          console.log(
            '❌ /attendance/all with manager token - Failed:',
            error.response?.status,
            error.response?.data?.message,
          );
        }

        try {
          const formData = new FormData();
          formData.append('employeeId', 'EMP001');

          const checkinResponse = await axios.post(
            `${BASE_URL}/attendance/checkin`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${managerToken}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log(
            '✅ /attendance/checkin with manager token - Success:',
            checkinResponse.status,
          );
        } catch (error) {
          console.log(
            '❌ /attendance/checkin with manager token - Failed:',
            error.response?.status,
            error.response?.data?.message,
          );
        }
      } else {
        console.log('❌ Could not get manager token from face login');
      }
    } catch (error) {
      console.log(
        '❌ Manager face login failed:',
        error.response?.status,
        error.response?.data?.message,
      );
    }

    // Test 3: Test admin authentication flow
    console.log('\n3️⃣ Testing Admin Authentication Flow...');

    try {
      const adminLoginResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'admin@test.com',
        password: 'password123',
      });

      if (adminLoginResponse.data && adminLoginResponse.data.token) {
        const adminToken = adminLoginResponse.data.token;
        console.log('✅ Got admin token:', adminToken.substring(0, 20) + '...');

        // Test admin attendance endpoints
        try {
          const adminAttendanceResponse = await axios.get(
            `${BASE_URL}/admin/attendance/all`,
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          console.log(
            '✅ /admin/attendance/all with admin token - Success:',
            adminAttendanceResponse.status,
          );
        } catch (error) {
          console.log(
            '❌ /admin/attendance/all with admin token - Failed:',
            error.response?.status,
            error.response?.data?.message,
          );
        }
      } else {
        console.log('❌ Could not get admin token');
      }
    } catch (error) {
      console.log(
        '❌ Admin login failed:',
        error.response?.status,
        error.response?.data?.message,
      );
    }

    // Test 4: Check authentication middleware
    console.log('\n4️⃣ Testing Authentication Middleware...');

    try {
      const response = await axios.get(`${BASE_URL}/attendance/all`, {
        headers: {
          Authorization: 'Bearer invalid_token',
          'Content-Type': 'application/json',
        },
      });
      console.log('⚠️ Unexpected success with invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ Authentication middleware working - Invalid token rejected',
        );
      } else {
        console.log(
          '❌ Authentication middleware issue:',
          error.response?.status,
        );
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAttendanceAPIComplete();
