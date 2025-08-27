import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const { width, height } = Dimensions.get('window');

const ManagerFaceRecognitionScreen = ({ navigation }) => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const [status, setStatus] = useState('Initializing camera...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);

  const cameraRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const device = frontDevice ?? backDevice ?? null;

  // Alert Modal
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(null);

  const showCustomAlert = (message, action = null) => {
    setAlertMessage(message);
    setAlertAction(() => action);
    setShowAlertModal(true);
  };

  const hideCustomAlert = () => {
    setShowAlertModal(false);
    setAlertMessage('');
    if (alertAction) {
      alertAction();
      setAlertAction(null);
    }
  };

  // Camera permission check
  useEffect(() => {
    const ensurePermission = async () => {
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          setStatus('Camera permission denied.');
          showCustomAlert(
            'Camera permission is required for face recognition. Please enable it in your app settings.',
            () => Linking.openSettings(),
          );
        }
      }
    };
    ensurePermission();
  }, [hasPermission, requestPermission]);

  // Camera initialized
  const handleCameraInitialized = () => {
    setCameraInitialized(true);
    setStatus('Camera ready. Keep your face centered.');
  };

  // Get first registered manager from backend
  const getRegisteredManager = async () => {
    console.log(
      '🔍 Fetching employees from:',
      'http://192.168.18.16:5000/api/employees/all',
    );
    const response = await axios.get(
      'http://192.168.18.16:5000/api/employees/all',
    );
    console.log('✅ EMPLOYEES API RESPONSE:', response.data);

    // Try multiple possible keys
    let allEmployees = [];
    if (Array.isArray(response.data)) {
      allEmployees = response.data;
      console.log('✅ Using response.data directly (array)');
    } else if (Array.isArray(response.data.data)) {
      allEmployees = response.data.data;
      console.log('✅ Using response.data.data (array)');
    } else if (Array.isArray(response.data.employees)) {
      allEmployees = response.data.employees;
      console.log('✅ Using response.data.employees (array)');
    }

    if (!Array.isArray(allEmployees)) {
      console.error('❌ API did not return an array of employees');
      throw new Error('API did not return an array of employees');
    }

    console.log('✅ Total employees found:', allEmployees.length);

    const managers = allEmployees.filter(
      emp => emp.role?.toLowerCase() === 'manager' && emp.livePicture,
    );

    console.log('✅ Managers with face images found:', managers.length);
    if (managers.length > 0) {
      console.log('✅ First manager:', managers[0].name);
    }

    return managers.length > 0 ? managers[0] : null;
  };

  // Compare faces using backend API
  const compareFaces = async (sourceImagePath, targetImageUrl) => {
    const formData = new FormData();
    formData.append('sourceImage', {
      uri: 'file://' + sourceImagePath,
      type: 'image/jpeg',
      name: 'source.jpg',
    });
    formData.append('targetImageUrl', targetImageUrl);

    const response = await axios.post(
      'http://192.168.18.16:5000/api/employees/compare-faces',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data; // { match: true/false, confidence: number }
  };

  // Start recognition
  const startFaceRecognitionProcess = async () => {
    if (!cameraInitialized || !cameraRef.current) {
      setStatus('Camera not ready.');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);
    setStatus('Capturing photo...');

    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      setStatus('Fetching manager data...');
      const manager = await getRegisteredManager();
      if (!manager) {
        throw new Error(
          'No registered manager found. Please register one in Admin Panel.',
        );
      }

      setStatus('Comparing faces...');
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      const result = await compareFaces(photo.path, manager.livePicture);

      if (result.match && result.confidence >= 80) {
        showCustomAlert(
          `Welcome ${manager.name}! Confidence: ${result.confidence.toFixed(
            1,
          )}%`,
          () =>
            navigation.navigate('ManagerHomeScreen', {
              authenticatedManager: manager,
              authenticationConfidence: result.confidence,
            }),
        );
      } else {
        throw new Error('Face not recognized or confidence too low.');
      }
    } catch (error) {
      console.error('Manager authentication failed:', error);
      showCustomAlert(error.message);
    } finally {
      setIsProcessing(false);
      progressAnim.setValue(0);
    }
  };

  // UI
  if (!hasPermission || !device) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.statusText}>{status}</Text>
        <TouchableOpacity
          style={styles.cancelRecognitionButton}
          onPress={() => requestPermission()}
        >
          <Text style={styles.cancelRecognitionButtonText}>
            Grant Permission
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelRecognitionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelRecognitionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Manager Face Authentication</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons
              name="close-circle-outline"
              size={width * 0.05}
              color="#A9A9A9"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={true}
            photo={true}
            onInitialized={handleCameraInitialized}
          />
          <View style={styles.faceOutline}></View>
        </View>

        <Text style={styles.statusText}>{status}</Text>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <TouchableOpacity
          style={styles.startRecognitionButton}
          onPress={startFaceRecognitionProcess}
          disabled={!cameraInitialized || isProcessing}
        >
          <Text style={styles.startRecognitionButtonText}>
            {isProcessing ? 'Processing...' : 'Authenticate Manager'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertModal}
        onRequestClose={hideCustomAlert}
      >
        <View style={styles.alertCenteredView}>
          <View style={styles.alertModalView}>
            <Text style={styles.alertModalText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.alertCloseButton}
              onPress={hideCustomAlert}
            >
              <Text style={styles.alertCloseButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#1F1F1F',
    borderRadius: 15,
    padding: width * 0.03,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: { fontSize: width * 0.025, fontWeight: 'bold', color: '#fff' },
  closeButton: { padding: 5 },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  faceOutline: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#fff',
    borderStyle: 'dashed',
  },
  statusText: {
    fontSize: width * 0.018,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '80%',
    height: 8,
    backgroundColor: '#2A2D32',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBarFill: { height: '100%', backgroundColor: '#A98C27' },
  startRecognitionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%',
    alignItems: 'center',
  },
  startRecognitionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.018,
  },
  cancelRecognitionButton: {
    backgroundColor: '#2A2D32',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelRecognitionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.018,
  },
  alertCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertModalView: {
    margin: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertModalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: width * 0.02,
  },
  alertCloseButton: {
    backgroundColor: '#A98C27',
    borderRadius: 5,
    padding: 10,
  },
  alertCloseButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ManagerFaceRecognitionScreen;
