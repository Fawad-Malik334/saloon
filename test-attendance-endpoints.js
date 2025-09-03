const axios = require('axios');

const BASE_URL = 'https://e0c20009c203.ngrok-free.app/api';

async function testAttendanceEndpoints() {
  console.log('🧪 Testing Attendance Endpoints...\n');

  try {
    // Test 1: Employee Attendance API
    console.log('1️⃣ Testing Employee Attendance API (/attendance/all)...');
    try {
      const employeeResponse = await axios.get(`${BASE_URL}/attendance/all`);
      console.log('✅ Employee attendance API call successful:', employeeResponse.status);
      console.log('📊 Employee attendance records:', employeeResponse.data?.length || 0);
      if (employeeResponse.data && employeeResponse.data.length > 0) {
        console.log('📋 Sample employee record:', {
          employeeId: employeeResponse.data[0].employeeId,
          employeeName: employeeResponse.data[0].employeeName,
          date: employeeResponse.data[0].date,
          checkInTime: employeeResponse.data[0].checkInTime,
          checkOutTime: employeeResponse.data[0].checkOutTime
        });
      }
    } catch (error) {
      console.log('❌ Employee attendance API call failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 2: Admin Attendance API
    console.log('\n2️⃣ Testing Admin Attendance API (/admin/attendance/all)...');
    try {
      const adminResponse = await axios.get(`${BASE_URL}/admin/attendance/all`);
      console.log('✅ Admin attendance API call successful:', adminResponse.status);
      console.log('📊 Admin attendance records:', adminResponse.data?.length || 0);
      if (adminResponse.data && adminResponse.data.length > 0) {
        console.log('📋 Sample admin record:', {
          adminId: adminResponse.data[0].adminId,
          adminName: adminResponse.data[0].adminName,
          date: adminResponse.data[0].date,
          checkInTime: adminResponse.data[0].checkInTime,
          checkOutTime: adminResponse.data[0].checkOutTime
        });
      }
    } catch (error) {
      console.log('❌ Admin attendance API call failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 3: Combined Attendance API
    console.log('\n3️⃣ Testing Combined Attendance API (/admin/attendance/combined)...');
    try {
      const combinedResponse = await axios.get(`${BASE_URL}/admin/attendance/combined`);
      console.log('✅ Combined attendance API call successful:', combinedResponse.status);
      console.log('📊 Combined attendance records:', combinedResponse.data?.length || 0);
      if (combinedResponse.data && combinedResponse.data.length > 0) {
        console.log('📋 Sample combined record:', {
          id: combinedResponse.data[0]._id,
          name: combinedResponse.data[0].adminName || combinedResponse.data[0].employeeName,
          date: combinedResponse.data[0].date,
          checkInTime: combinedResponse.data[0].checkInTime,
          checkOutTime: combinedResponse.data[0].checkOutTime
        });
      }
    } catch (error) {
      console.log('❌ Combined attendance API call failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 4: Check if endpoints are accessible without auth
    console.log('\n4️⃣ Testing endpoints without authentication...');
    console.log('📡 This will show if endpoints require authentication');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAttendanceEndpoints();
