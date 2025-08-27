import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const AddAttendanceModal = ({ isVisible, onClose, onSave }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showAttendanceStatusPicker, setShowAttendanceStatusPicker] =
    useState(false);

  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState('');

  // Log when modal visibility changes
  useEffect(() => {
    if (isVisible) {
      console.log('🟢 [AddAttendanceModal] Modal opened');
    } else {
      console.log('🔴 [AddAttendanceModal] Modal closed');
    }
  }, [isVisible]);

  const showCustomAlert = message => {
    console.log('🔔 [Alert] Showing alert:', message);
    setCustomAlertMessage(message);
    setCustomAlertVisible(true);
  };

  const hideCustomAlert = () => {
    console.log('🔕 [Alert] Dismissing alert');
    setCustomAlertVisible(false);
    setCustomAlertMessage('');
  };

  const resetForm = () => {
    console.log('🔄 [Form] Resetting form fields');
    setEmployeeId('');
    setEmployeeName('');
    setAttendanceStatus('');
    setAttendanceDate(new Date());
    setShowAttendanceStatusPicker(false);
  };

  const handleSave = async () => {
    console.log('🔍 [AddAttendanceModal] Starting handleSave...');

    const trimmedEmployeeId = employeeId.trim();
    const trimmedEmployeeName = employeeName.trim();
    const trimmedAttendanceStatus = attendanceStatus.trim();

    // Log input data for debugging
    console.log('📝 [Form Data] Validating input:', {
      employeeId: trimmedEmployeeId,
      employeeName: trimmedEmployeeName,
      attendanceStatus: trimmedAttendanceStatus,
      attendanceDate: attendanceDate.toISOString(),
    });

    if (
      !trimmedEmployeeId ||
      !trimmedEmployeeName ||
      !trimmedAttendanceStatus
    ) {
      console.warn('❌ [Validation] Missing required fields');
      showCustomAlert('Please fill all required fields.');
      return;
    }

    if (!['Check-In', 'Check-Out'].includes(trimmedAttendanceStatus)) {
      console.warn(
        '❌ [Validation] Invalid attendance status:',
        trimmedAttendanceStatus,
      );
      showCustomAlert(
        'Invalid Attendance Status: Must be "Check-In" or "Check-Out".',
      );
      return;
    }

    const attendanceType =
      trimmedAttendanceStatus === 'Check-In' ? 'checkin' : 'checkout';
    const apiUrl = `http://192.168.18.16:5000/api/attendance/${attendanceType}`;

    console.log(
      `📡 [API] Sending ${attendanceType.toUpperCase()} request to:`,
      apiUrl,
    );

    // Create FormData
    const formData = new FormData();
    formData.append('employeeId', trimmedEmployeeId);
    formData.append('attendanceType', attendanceType);

    // ✅ Safe logging: Manually log known fields (formData.entries() is NOT supported in React Native)
    console.log('📤 [FormData] Payload being sent:', {
      employeeId: trimmedEmployeeId,
      attendanceType,
    });

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10-second timeout
      });

      console.log('✅ [API Success] Response received:', {
        status: response.status,
        data: response.data,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('🎉 [Success] Attendance recorded successfully!');
        showCustomAlert(`Successfully ${attendanceType} recorded!`);
        onSave({
          employeeId: trimmedEmployeeId,
          employeeName: trimmedEmployeeName,
          attendanceStatus: trimmedAttendanceStatus,
          attendanceDate,
        });
        resetForm();
        onClose();
      } else {
        console.warn('⚠️ [API] Unexpected response status:', response.status);
        showCustomAlert('Failed to save attendance. Server error.');
      }
    } catch (error) {
      console.error('🚨 [API Error] Failed to submit attendance:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        url: apiUrl,
        status: error.response?.status,
        responseData: error.response?.data,
        request: error.request
          ? 'Request made but no response'
          : 'No request sent',
      });

      // User-friendly alerts
      if (error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED') {
        showCustomAlert(
          'Network unreachable. Check your connection or IP address.',
        );
      } else if (error.message.includes('timeout')) {
        showCustomAlert('Request timed out. Please try again.');
      } else {
        showCustomAlert('Network error. Please check connection or try again.');
      }
    }
  };

  const handleClose = () => {
    console.log('🚪 [Modal] Close button pressed');
    resetForm();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      {/* Background touch to close */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          {/* Inner content (don't close on inner touch) */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Attendance</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons
                    name="close-circle-outline"
                    size={width * 0.025}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Employee ID Input */}
              <TextInput
                style={styles.modalInput}
                placeholder="Employee ID (Internal)"
                placeholderTextColor="#A9A9A9"
                value={employeeId}
                onChangeText={text => {
                  console.log('✏️ [Input] Employee ID changed:', text);
                  setEmployeeId(text);
                }}
                keyboardType="default"
              />

              {/* Employee Name Input */}
              <TextInput
                style={styles.modalInput}
                placeholder="Employee Name"
                placeholderTextColor="#A9A9A9"
                value={employeeName}
                onChangeText={text => {
                  console.log('✏️ [Input] Employee Name changed:', text);
                  setEmployeeName(text);
                }}
              />

              {/* Attendance Status Picker */}
              <TouchableOpacity
                style={styles.modalInputTouchable}
                onPress={() =>
                  setShowAttendanceStatusPicker(!showAttendanceStatusPicker)
                }
              >
                <Text
                  style={
                    attendanceStatus
                      ? styles.modalInputText
                      : styles.modalInputPlaceholderText
                  }
                >
                  {attendanceStatus || 'Select Attendance Status'}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={width * 0.018}
                  color="#A9A9A9"
                />
              </TouchableOpacity>

              {showAttendanceStatusPicker && (
                <View style={styles.pickerOptionsContainer}>
                  <TouchableOpacity
                    style={styles.pickerOption}
                    onPress={() => {
                      console.log('🖱️ [Picker] Selected: Check-In');
                      setAttendanceStatus('Check-In');
                      setShowAttendanceStatusPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>Check-In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerOption}
                    onPress={() => {
                      console.log('🖱️ [Picker] Selected: Check-Out');
                      setAttendanceStatus('Check-Out');
                      setShowAttendanceStatusPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>Check-Out</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Date Picker Trigger */}
              <TouchableOpacity
                style={styles.modalInputTouchable}
                onPress={() => {
                  console.log('📅 [Date] Date picker opened');
                  setOpenDatePicker(true);
                }}
              >
                <Text style={styles.modalInputText}>
                  {moment(attendanceDate).format('MMM DD, YYYY')}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={width * 0.018}
                  color="#A9A9A9"
                />
              </TouchableOpacity>

              {/* Date Picker Modal */}
              <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={attendanceDate}
                onConfirm={date => {
                  console.log('✅ [Date] Date confirmed:', date.toISOString());
                  setOpenDatePicker(false);
                  setAttendanceDate(date);
                }}
                onCancel={() => {
                  console.log('❌ [Date] Date picker canceled');
                  setOpenDatePicker(false);
                }}
              />

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Custom Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={customAlertVisible}
        onRequestClose={hideCustomAlert}
      >
        <View style={styles.customAlertCenteredView}>
          <View style={styles.customAlertModalView}>
            <Text style={styles.customAlertModalText}>
              {customAlertMessage}
            </Text>
            <TouchableOpacity
              style={styles.customAlertCloseButton}
              onPress={hideCustomAlert}
            >
              <Text style={styles.customAlertCloseButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

// ✅ Styles remain unchanged
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: width * 0.6,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: width * 0.02,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  modalTitle: {
    color: '#fff',
    fontSize: width * 0.02,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#2A2D32',
    color: '#fff',
    fontSize: width * 0.018,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.015,
    borderRadius: 8,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  modalInputTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2D32',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.015,
    borderRadius: 8,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  modalInputText: {
    color: '#fff',
    fontSize: width * 0.018,
  },
  modalInputPlaceholderText: {
    color: '#A9A9A9',
    fontSize: width * 0.018,
  },
  pickerOptionsContainer: {
    backgroundColor: '#2A2D32',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    marginBottom: height * 0.015,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  pickerOptionText: {
    color: '#fff',
    fontSize: width * 0.018,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: height * 0.02,
  },
  closeButton: {
    backgroundColor: '#3C3C3C',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.12,
    borderRadius: 8,
    marginRight: width * 0.01,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: width * 0.016,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#A98C27',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: width * 0.016,
    fontWeight: '600',
  },
  customAlertCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  customAlertModalView: {
    margin: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  customAlertModalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: width * 0.02,
  },
  customAlertCloseButton: {
    backgroundColor: '#A98C27',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  customAlertCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddAttendanceModal;
