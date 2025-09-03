const AsyncStorage = require('@react-native-async-storage/async-storage');

async function checkCurrentTokenStatus() {
  console.log('🔍 Checking Current Token Status...\n');

  try {
    // Check manager auth
    const managerAuth = await AsyncStorage.getItem('managerAuth');
    console.log('📱 Manager Auth Status:');
    if (managerAuth) {
      const parsedManager = JSON.parse(managerAuth);
      console.log('   ✅ managerAuth found');
      console.log('   - Has Token:', !!parsedManager.token);
      console.log(
        '   - Token Type:',
        parsedManager.token
          ? parsedManager.token.startsWith('eyJ')
            ? 'JWT'
            : 'Face Auth'
          : 'None',
      );
      console.log('   - Has Manager:', !!parsedManager.manager);
      console.log('   - Is Authenticated:', parsedManager.isAuthenticated);
      console.log(
        '   - Token Preview:',
        parsedManager.token
          ? parsedManager.token.substring(0, 30) + '...'
          : 'None',
      );
    } else {
      console.log('   ❌ managerAuth not found');
    }

    // Check admin auth
    const adminAuth = await AsyncStorage.getItem('adminAuth');
    console.log('\n📱 Admin Auth Status:');
    if (adminAuth) {
      const parsedAdmin = JSON.parse(adminAuth);
      console.log('   ✅ adminAuth found');
      console.log('   - Has Token:', !!parsedAdmin.token);
      console.log(
        '   - Token Type:',
        parsedAdmin.token
          ? parsedAdmin.token.startsWith('eyJ')
            ? 'JWT'
            : 'Face Auth'
          : 'None',
      );
      console.log('   - Has Admin:', !!parsedAdmin.admin);
      console.log('   - Is Authenticated:', parsedAdmin.isAuthenticated);
      console.log(
        '   - Token Preview:',
        parsedAdmin.token ? parsedAdmin.token.substring(0, 30) + '...' : 'None',
      );
    } else {
      console.log('   ❌ adminAuth not found');
    }

    // Check general auth token
    const authToken = await AsyncStorage.getItem('authToken');
    console.log('\n📱 General Auth Token Status:');
    if (authToken) {
      console.log('   ✅ authToken found');
      console.log('   - Token Preview:', authToken.substring(0, 30) + '...');
    } else {
      console.log('   ❌ authToken not found');
    }

    console.log('\n🎯 Analysis:');
    if (managerAuth) {
      const parsedManager = JSON.parse(managerAuth);
      if (parsedManager.token && parsedManager.isAuthenticated) {
        console.log('   ✅ Manager authentication appears valid');
        console.log('   ✅ Attendance should work with current token');
      } else {
        console.log('   ❌ Manager authentication incomplete');
        console.log('   ❌ Need to login again via face recognition');
      }
    } else {
      console.log('   ❌ No manager authentication found');
      console.log('   ❌ Need to login via face recognition');
    }
  } catch (error) {
    console.error('❌ Error checking token status:', error);
  }
}

// Run the check
checkCurrentTokenStatus();
