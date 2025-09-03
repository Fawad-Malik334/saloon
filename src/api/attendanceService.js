import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import { getAuthToken, getAdminToken } from '../utils/authUtils';

// Employee Attendance APIs
export const employeeCheckIn = async (employeeId, imageUri) => {
  try {
    console.log('🔍 [EmployeeCheckIn] Starting authentication...');

    // Get manager token directly from AsyncStorage (same as other screens)
    let token = null;
    try {
      const managerAuthData = await AsyncStorage.getItem('managerAuth');
      console.log(
        '🔍 [EmployeeCheckIn] Manager auth data:',
        managerAuthData ? 'Found' : 'Not found',
      );

      if (managerAuthData) {
        const parsedData = JSON.parse(managerAuthData);
        console.log('🔍 [EmployeeCheckIn] Parsed manager auth data:', {
          hasToken: !!parsedData.token,
          tokenType: parsedData.token
            ? parsedData.token.startsWith('eyJ')
              ? 'JWT'
              : 'Face Auth'
            : 'None',
          hasManager: !!parsedData.manager,
          isAuthenticated: parsedData.isAuthenticated,
        });

        token = parsedData.token;
        console.log(
          '🔍 [EmployeeCheckIn] Manager token found:',
          token ? token.substring(0, 20) + '...' : 'null',
        );
      }
    } catch (error) {
      console.error(
        '❌ [EmployeeCheckIn] Failed to read manager token:',
        error,
      );
    }

    if (!token) {
      console.error(
        '❌ [EmployeeCheckIn] No manager authentication token found',
      );
      throw new Error(
        'No manager authentication token found. Please login again.',
      );
    }

    console.log(
      '✅ [EmployeeCheckIn] Using manager token:',
      token.substring(0, 20) + '...',
    );

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'checkin.jpg',
      });
    }

    const response = await axios.post(
      `${BASE_URL}/attendance/checkin`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Employee Check-In Error:', error);
    throw error;
  }
};

export const employeeCheckOut = async (employeeId, imageUri) => {
  try {
    console.log('🔍 [EmployeeCheckOut] Starting authentication...');

    // Get manager token directly from AsyncStorage (same as other screens)
    let token = null;
    try {
      const managerAuthData = await AsyncStorage.getItem('managerAuth');
      console.log(
        '🔍 [EmployeeCheckOut] Manager auth data:',
        managerAuthData ? 'Found' : 'Not found',
      );

      if (managerAuthData) {
        const parsedData = JSON.parse(managerAuthData);
        console.log('🔍 [EmployeeCheckOut] Parsed manager auth data:', {
          hasToken: !!parsedData.token,
          tokenType: parsedData.token
            ? parsedData.token.startsWith('eyJ')
              ? 'JWT'
              : 'Face Auth'
            : 'None',
          hasManager: !!parsedData.manager,
          isAuthenticated: parsedData.isAuthenticated,
        });

        token = parsedData.token;
        console.log(
          '🔍 [EmployeeCheckOut] Manager token found:',
          token ? token.substring(0, 20) + '...' : 'null',
        );
      }
    } catch (error) {
      console.error(
        '❌ [EmployeeCheckOut] Failed to read manager token:',
        error,
      );
    }

    if (!token) {
      console.error(
        '❌ [EmployeeCheckOut] No manager authentication token found',
      );
      throw new Error(
        'No manager authentication token found. Please login again.',
      );
    }

    console.log(
      '✅ [EmployeeCheckOut] Using manager token:',
      token.substring(0, 20) + '...',
    );

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'checkout.jpg',
      });
    }

    const response = await axios.post(
      `${BASE_URL}/attendance/checkout`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Employee Check-Out Error:', error);
    throw error;
  }
};

// Get All Employee Attendance Records
export const getAllEmployeeAttendance = async () => {
  try {
    console.log('🔍 [GetAllEmployeeAttendance] Starting authentication...');

    // Get manager token directly from AsyncStorage (same as other screens)
    let token = null;
    try {
      const managerAuthData = await AsyncStorage.getItem('managerAuth');
      console.log(
        '🔍 [GetAllEmployeeAttendance] Manager auth data:',
        managerAuthData ? 'Found' : 'Not found',
      );

      if (managerAuthData) {
        const parsedData = JSON.parse(managerAuthData);
        console.log('🔍 [GetAllEmployeeAttendance] Parsed manager auth data:', {
          hasToken: !!parsedData.token,
          tokenType: parsedData.token
            ? parsedData.token.startsWith('eyJ')
              ? 'JWT'
              : 'Face Auth'
            : 'None',
          hasManager: !!parsedData.manager,
          isAuthenticated: parsedData.isAuthenticated,
        });

        token = parsedData.token;
        console.log(
          '🔍 [GetAllEmployeeAttendance] Manager token found:',
          token ? token.substring(0, 20) + '...' : 'null',
        );
      }
    } catch (error) {
      console.error(
        '❌ [GetAllEmployeeAttendance] Failed to read manager token:',
        error,
      );
    }

    if (!token) {
      console.error(
        '❌ [GetAllEmployeeAttendance] No manager authentication token found',
      );
      throw new Error(
        'No manager authentication token found. Please login again.',
      );
    }

    console.log(
      '✅ [GetAllEmployeeAttendance] Using manager token:',
      token.substring(0, 20) + '...',
    );

    const response = await axios.get(`${BASE_URL}/attendance/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get All Employee Attendance Error:', error);
    throw error;
  }
};

// Admin Attendance APIs
export const adminCheckIn = async (adminId, imageUri) => {
  try {
    console.log('🔍 [AdminCheckIn] Starting authentication...');

    // Get admin token directly from AsyncStorage (same as other admin screens)
    let token = null;
    try {
      const adminAuthData = await AsyncStorage.getItem('adminAuth');
      console.log(
        '🔍 [AdminCheckIn] Admin auth data:',
        adminAuthData ? 'Found' : 'Not found',
      );

      if (adminAuthData) {
        const parsedData = JSON.parse(adminAuthData);
        console.log('🔍 [AdminCheckIn] Parsed admin auth data:', {
          hasToken: !!parsedData.token,
          tokenType: parsedData.token
            ? parsedData.token.startsWith('eyJ')
              ? 'JWT'
              : 'Face Auth'
            : 'None',
          hasAdmin: !!parsedData.admin,
          isAuthenticated: parsedData.isAuthenticated,
        });

        token = parsedData.token;
        console.log(
          '🔍 [AdminCheckIn] Admin token found:',
          token ? token.substring(0, 20) + '...' : 'null',
        );
      }
    } catch (error) {
      console.error('❌ [AdminCheckIn] Failed to read admin token:', error);
    }

    if (!token) {
      console.error('❌ [AdminCheckIn] No admin authentication token found');
      throw new Error(
        'No admin authentication token found. Please login again.',
      );
    }

    console.log(
      '✅ [AdminCheckIn] Using admin token:',
      token.substring(0, 20) + '...',
    );

    const formData = new FormData();
    formData.append('adminId', adminId);
    formData.append('attendanceType', 'checkin');

    console.log('📤 [AdminCheckIn] FormData details:', {
      adminId,
      attendanceType: 'checkin',
      imageUri: imageUri ? 'Present' : 'Not provided',
    });

    if (imageUri) {
      console.log('📤 [AdminCheckIn] Adding image to FormData:', imageUri);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'admin_checkin.jpg',
      });
      console.log('✅ [AdminCheckIn] Image added to FormData successfully');
    } else {
      console.log('⚠️ [AdminCheckIn] No image provided');
    }

    console.log(
      '📡 [AdminCheckIn] Sending request to:',
      `${BASE_URL}/admin/attendance`,
    );
    console.log('📡 [AdminCheckIn] Request headers:', {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.substring(0, 20)}...`,
    });

    const response = await axios.post(
      `${BASE_URL}/admin/attendance`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000, // 15 second timeout for image upload
      },
    );

    console.log('✅ [AdminCheckIn] Response received:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ [AdminCheckIn] Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 400) {
      const responseMessage = error.response?.data?.message || '';
      if (
        responseMessage.includes('file') ||
        responseMessage.includes('upload')
      ) {
        throw new Error('File upload error. Please try again.');
      } else {
        throw new Error(
          responseMessage || 'Invalid request. Please check your details.',
        );
      }
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error(
        'Network connection failed. Please check your internet connection.',
      );
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else {
      throw error;
    }
  }
};

export const adminCheckOut = async (adminId, imageUri) => {
  try {
    console.log('🔍 [AdminCheckOut] Starting authentication...');

    // Get admin token directly from AsyncStorage (same as other admin screens)
    let token = null;
    try {
      const adminAuthData = await AsyncStorage.getItem('adminAuth');
      console.log(
        '🔍 [AdminCheckOut] Admin auth data:',
        adminAuthData ? 'Found' : 'Not found',
      );

      if (adminAuthData) {
        const parsedData = JSON.parse(adminAuthData);
        console.log('🔍 [AdminCheckOut] Parsed admin auth data:', {
          hasToken: !!parsedData.token,
          tokenType: parsedData.token
            ? parsedData.token.startsWith('eyJ')
              ? 'JWT'
              : 'Face Auth'
            : 'None',
          hasAdmin: !!parsedData.admin,
          isAuthenticated: parsedData.isAuthenticated,
        });

        token = parsedData.token;
        console.log(
          '🔍 [AdminCheckOut] Admin token found:',
          token ? token.substring(0, 20) + '...' : 'null',
        );
      }
    } catch (error) {
      console.error('❌ [AdminCheckOut] Failed to read admin token:', error);
    }

    if (!token) {
      console.error('❌ [AdminCheckOut] No admin authentication token found');
      throw new Error(
        'No admin authentication token found. Please login again.',
      );
    }

    console.log(
      '✅ [AdminCheckOut] Using admin token:',
      token.substring(0, 20) + '...',
    );

    const formData = new FormData();
    formData.append('adminId', adminId);
    formData.append('attendanceType', 'checkout');

    console.log('📤 [AdminCheckOut] FormData details:', {
      adminId,
      attendanceType: 'checkout',
      imageUri: imageUri ? 'Present' : 'Not provided',
    });

    if (imageUri) {
      console.log('📤 [AdminCheckOut] Adding image to FormData:', imageUri);
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'admin_checkout.jpg',
      });
      console.log('✅ [AdminCheckOut] Image added to FormData successfully');
    } else {
      console.log('⚠️ [AdminCheckOut] No image provided');
    }

    console.log(
      '📡 [AdminCheckOut] Sending request to:',
      `${BASE_URL}/admin/attendance`,
    );
    console.log('📡 [AdminCheckOut] Request headers:', {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token.substring(0, 20)}...`,
    });

    const response = await axios.post(
      `${BASE_URL}/admin/attendance`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000, // 15 second timeout for image upload
      },
    );

    console.log('✅ [AdminCheckOut] Response received:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ [AdminCheckOut] Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 400) {
      const responseMessage = error.response?.data?.message || '';
      if (
        responseMessage.includes('file') ||
        responseMessage.includes('upload')
      ) {
        throw new Error('File upload error. Please try again.');
      } else {
        throw new Error(
          responseMessage || 'Invalid request. Please check your details.',
        );
      }
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error(
        'Network connection failed. Please check your internet connection.',
      );
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else {
      throw error;
    }
  }
};

// Get All Admin Attendance Records
export const getAllAdminAttendance = async () => {
  try {
    const token = await getAdminToken();
    if (!token) {
      throw new Error('No admin authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/admin/attendance/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get All Admin Attendance Error:', error);
    throw error;
  }
};

// Get Combined Attendance Records (Admin + Employee)
export const getCombinedAttendance = async () => {
  try {
    const token = await getAdminToken();
    if (!token) {
      throw new Error('No admin authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/admin/attendance/combined`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Get Combined Attendance Error:', error);
    throw error;
  }
};

// Manual Attendance Request
export const submitManualAttendanceRequest = async requestData => {
  try {
    const response = await axios.post(
      `${BASE_URL}/attendance/manual-request`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Manual Attendance Request Error:', error);
    throw error;
  }
};

// Get Pending Manual Requests
export const getPendingManualRequests = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${BASE_URL}/attendance/pending-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Get Pending Manual Requests Error:', error);
    throw error;
  }
};

// Approve/Decline Manual Request
export const approveDeclineManualRequest = async (requestId, action) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(
      `${BASE_URL}/attendance/approve-request/${requestId}`,
      {
        action: action, // 'approve' or 'decline'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Approve/Decline Manual Request Error:', error);
    throw error;
  }
};

// Mark Absent Employees
export const markAbsentEmployees = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${BASE_URL}/attendance/mark-absent`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Mark Absent Employees Error:', error);
    throw error;
  }
};
