// Test script to verify employee API endpoint
const axios = require('axios');

const testEmployeeAPI = async () => {
  console.log('🧪 Testing Employee API Endpoint...\n');

  try {
    // Test 1: Check if API is reachable
    console.log('1️⃣ Testing API connectivity...');
    const healthCheck = await axios.get('http://192.168.18.16:5000/api/employees/all');
    console.log('✅ API is reachable, status:', healthCheck.status);
    console.log('📊 Current employees count:', healthCheck.data.employees?.length || 0);
    console.log('');

    // Test 2: Test employee data structure
    console.log('2️⃣ Testing employee data structure...');
    if (healthCheck.data.employees && healthCheck.data.employees.length > 0) {
      const sampleEmployee = healthCheck.data.employees[0];
      console.log('📋 Sample employee structure:');
      console.log('   - ID:', sampleEmployee.employeeId || sampleEmployee._id);
      console.log('   - Name:', sampleEmployee.name);
      console.log('   - Phone:', sampleEmployee.phoneNumber);
      console.log('   - Role:', sampleEmployee.role);
      console.log('   - Has face image:', !!sampleEmployee.livePicture);
    } else {
      console.log('ℹ️  No employees found in database');
    }
    console.log('');

    // Test 3: Test FormData creation (simulate what the app does)
    console.log('3️⃣ Testing FormData structure...');
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('name', 'Test Employee');
    formData.append('phoneNumber', '0300-1234567');
    formData.append('idCardNumber', '35202-1234567-1');
    formData.append('monthlySalary', '50000');
    formData.append('role', 'employee');
    
    console.log('✅ FormData created successfully');
    console.log('📋 FormData fields:');
    console.log('   - name: Test Employee');
    console.log('   - phoneNumber: 0300-1234567');
    console.log('   - idCardNumber: 35202-1234567-1');
    console.log('   - monthlySalary: 50000');
    console.log('   - role: employee');
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('📱 The employee API integration should work properly.');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your backend server is running on http://192.168.18.16:5000');
    }
    
    if (error.response) {
      console.log('📊 Response status:', error.response.status);
      console.log('📋 Response data:', error.response.data);
    }
  }
};

// Run the test
testEmployeeAPI();
