// src/screens/AdminPanel/modals/AddServiceModal.js

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Helper function to get image source
const getServiceImageSource = image => {
  if (typeof image === 'string' && image.startsWith('http')) {
    return { uri: image };
  } else if (typeof image === 'string') {
    return { uri: image };
  } else if (typeof image === 'number') {
    return image;
  }
  return null;
};

const AddServiceModal = ({ visible, onClose, onSave, initialServiceData }) => {
  // State for main service details
  const [serviceName, setServiceName] = useState('');
  const [serviceImage, setServiceImage] = useState(null);
  const [subServices, setSubServices] = useState([]);

  // State for current sub-service being added/edited
  const [currentSubServiceId, setCurrentSubServiceId] = useState(null);
  const [currentSubServiceName, setCurrentSubServiceName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentSubServiceImage, setCurrentSubServiceImage] = useState(null);

  // Ref to track if data has been initialized
  const isInitialDataLoaded = useRef(false);

  // Counter for generating unique IDs
  const [idCounter, setIdCounter] = useState(0);

  // Helper function to generate truly unique IDs
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const counter = idCounter;
    setIdCounter(prev => prev + 1);
    return `sub_${timestamp}_${random}_${counter}`;
  };

  // Helper to reset current sub-service input fields
  const resetCurrentSubServiceFields = () => {
    setCurrentSubServiceId(null);
    setCurrentSubServiceName('');
    setCurrentPrice('');
    setCurrentTime('');
    setCurrentDescription('');
    setCurrentSubServiceImage(null);
  };

  // Effect to handle modal visibility and initial data loading
  useEffect(() => {
    console.log(
      'AddServiceModal useEffect triggered. Visible:',
      visible,
      'initialServiceData:',
      initialServiceData?.id,
    );

    if (visible) {
      isInitialDataLoaded.current = false;

      if (initialServiceData) {
        // EDIT MODE: Pre-fill with existing data
        console.log('EDIT MODE: Pre-filling with:', initialServiceData);
        setServiceName(
          initialServiceData.serviceName || initialServiceData.title || '',
        );
        setServiceImage(
          initialServiceData.serviceImage || initialServiceData.image || null,
        );
        setSubServices(initialServiceData.subServices || []);
      } else {
        // ADD MODE: Clear all fields
        console.log('ADD MODE: Clearing all fields');
        setServiceName('');
        setServiceImage(null);
        setSubServices([]);
      }
      resetCurrentSubServiceFields();
      isInitialDataLoaded.current = true;
    } else {
      // Modal hidden - reset all states
      console.log('Modal hidden, resetting states');
      setServiceName('');
      setServiceImage(null);
      setSubServices([]);
      resetCurrentSubServiceFields();
      isInitialDataLoaded.current = false;
    }
  }, [visible, initialServiceData]);

  // Function to handle picking an image
  const pickImage = type => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (type === 'service') {
          console.log('Selected service image URI:', asset.uri);
          setServiceImage(asset.uri);
        } else {
          console.log('Selected sub-service image URI:', asset.uri);
          setCurrentSubServiceImage(asset.uri);
        }
      }
    });
  };

  // Function to add a new sub-service or update an existing one
  const handleAddOrUpdateSubService = () => {
    console.log('=== handleAddOrUpdateSubService called ===');
    console.log('Current values:', {
      name: currentSubServiceName,
      price: currentPrice,
      time: currentTime,
      description: currentDescription,
      image: currentSubServiceImage,
      id: currentSubServiceId,
    });

    if (
      !currentSubServiceName.trim() ||
      !currentPrice.trim() ||
      !currentTime.trim()
    ) {
      Alert.alert(
        'Missing Info',
        'Please fill in Sub Service Name, Price, and Time.',
      );
      return;
    }

    const newOrUpdatedSubService = {
      id: currentSubServiceId || generateUniqueId(),
      name: currentSubServiceName.trim(), // Backend expects 'name'
      price: parseFloat(currentPrice.trim()) || 0, // Convert to number
      time: currentTime.trim(),
      description: currentDescription.trim(),
      image: currentSubServiceImage, // Backend expects 'image'
    };

    console.log('New/Updated sub-service object:', newOrUpdatedSubService);

    let updatedSubServices;
    if (currentSubServiceId) {
      // Update existing sub-service
      console.log(
        'Updating existing sub-service with ID:',
        currentSubServiceId,
      );
      updatedSubServices = subServices.map(sub =>
        sub.id === currentSubServiceId ? newOrUpdatedSubService : sub,
      );
      Alert.alert('Success', 'Sub-service updated successfully!');
    } else {
      // Add new sub-service
      console.log('Adding new sub-service');
      updatedSubServices = [...subServices, newOrUpdatedSubService];
      Alert.alert('Success', 'Sub-service added successfully!');
    }

    console.log('Updated subServices array:', updatedSubServices);
    setSubServices(updatedSubServices);
    resetCurrentSubServiceFields();
  };

  // Function to load a sub-service into the input fields for editing
  const handleEditSubService = sub => {
    console.log('Editing sub-service:', sub);
    setCurrentSubServiceId(sub.id);
    setCurrentSubServiceName(sub.name || sub.subServiceName || '');
    setCurrentPrice(sub.price ? sub.price.toString() : '');
    setCurrentTime(sub.time || '');
    setCurrentDescription(sub.description || '');
    setCurrentSubServiceImage(sub.image || sub.subServiceImage || null);
  };

  // Function to delete a sub-service
  const handleDeleteSubService = id => {
    console.log('=== Deleting sub-service with ID:', id);
    console.log(
      'Current sub-services before deletion:',
      subServices.map(sub => ({ id: sub.id, name: sub.name })),
    );

    Alert.alert(
      'Delete Sub-service',
      'Are you sure you want to delete this sub-service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedSubServices = subServices.filter(sub => sub.id !== id);
            console.log(
              'Sub-services after deletion:',
              updatedSubServices.map(sub => ({ id: sub.id, name: sub.name })),
            );

            setSubServices(updatedSubServices);
            Alert.alert('Success', 'Sub-service deleted successfully!');
            if (currentSubServiceId === id) {
              resetCurrentSubServiceFields();
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  // Function to save the main service
  const handleSave = () => {
    console.log('=== handleSave called ===');

    // Validation
    if (!serviceName.trim()) {
      Alert.alert('Missing Info', 'Please fill in Service Name.');
      return;
    }

    if (!serviceImage) {
      Alert.alert('Missing Info', 'Please select a Service Image.');
      return;
    }

    // Check for unsaved sub-service changes
    if (
      currentSubServiceName.trim() ||
      currentPrice.trim() ||
      currentTime.trim() ||
      currentDescription.trim() ||
      currentSubServiceImage !== null
    ) {
      Alert.alert(
        'Unsaved Sub-service Changes',
        'You have unsaved changes in the sub-service input fields. Please "Add/Update Current Sub Service" or clear the fields before saving the main service.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (subServices.length === 0) {
      Alert.alert('Missing Info', 'Please add at least one sub-service.');
      return;
    }

    let serviceToSave = {};
    let isFormData = false;

    // Check if service image is a new local URI
    const isNewImageSelected =
      typeof serviceImage === 'string' && !serviceImage.startsWith('http');

    if (isNewImageSelected) {
      // Use FormData for new image upload
      console.log('Creating FormData for new image upload');
      const formData = new FormData();
      formData.append('title', serviceName.trim()); // Backend expects 'title'

      // Process sub-services for FormData
      const processedSubServices = subServices.map((sub, index) => {
        const processedSub = {
          name: sub.name || sub.subServiceName,
          price: parseFloat(sub.price) || 0,
          time: sub.time,
          description: sub.description,
          image: sub.image || sub.subServiceImage,
        };

        // Add new sub-service images to FormData
        if (
          sub.image &&
          typeof sub.image === 'string' &&
          !sub.image.startsWith('http')
        ) {
          formData.append(`subServiceImage${index}`, {
            uri: sub.image,
            name: `subservice_image_${index}_${Date.now()}.jpg`,
            type: 'image/jpeg',
          });
        }

        return processedSub;
      });

      formData.append('subServices', JSON.stringify(processedSubServices));
      formData.append(
        'isHiddenFromEmployee',
        initialServiceData?.isHiddenFromEmployee || false,
      );

      // Add main service image
      formData.append('image', {
        uri: serviceImage,
        name: `service_image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      serviceToSave = formData;
      isFormData = true;
    } else {
      // Use JSON for existing images
      console.log('Creating JSON payload for existing images');
      const processedSubServices = subServices.map(sub => ({
        name: sub.name || sub.subServiceName,
        price: parseFloat(sub.price) || 0,
        time: sub.time,
        description: sub.description,
        image: sub.image || sub.subServiceImage,
      }));

      serviceToSave = {
        id: initialServiceData?.id,
        title: serviceName.trim(), // Backend expects 'title'
        image: serviceImage,
        subServices: processedSubServices,
        isHiddenFromEmployee: initialServiceData?.isHiddenFromEmployee || false,
      };
      isFormData = false;
    }

    console.log(
      'Final serviceToSave (isFormData:',
      isFormData,
      '):',
      serviceToSave,
    );

    // Validate serviceToSave
    if (!serviceToSave) {
      console.error('serviceToSave is undefined or null');
      Alert.alert('Error', 'Failed to prepare service data. Please try again.');
      return;
    }

    // Debug logging
    if (isFormData && serviceToSave instanceof FormData) {
      console.log('FormData contents:');
      try {
        for (let [key, value] of serviceToSave.entries()) {
          console.log(`${key}:`, value);
        }
      } catch (error) {
        console.log('Error logging FormData:', error);
      }
    } else {
      console.log('JSON data:', JSON.stringify(serviceToSave, null, 2));
    }

    onSave(serviceToSave);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              resetCurrentSubServiceFields();
              onClose();
            }}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.heading}>
              {initialServiceData ? 'Edit Service' : 'Add New Service'}
            </Text>

            {/* Service Details Section */}
            <Text style={styles.label}>Service Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Service Name"
              placeholderTextColor="#999"
              value={serviceName}
              onChangeText={setServiceName}
            />

            <TouchableOpacity
              style={styles.imageBox}
              onPress={() => pickImage('service')}
            >
              {serviceImage ? (
                <Image
                  source={getServiceImageSource(serviceImage)}
                  style={styles.image}
                />
              ) : (
                <>
                  <Icon
                    name="file-image"
                    size={40}
                    color="#999"
                    style={styles.dragDropIcon}
                  />
                  <Text style={styles.imageText}>
                    Drag & drop files or browse files
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Sub Service Details Section */}
            <Text style={styles.label}>Sub Service Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Sub Service Name"
              placeholderTextColor="#999"
              value={currentSubServiceName}
              onChangeText={setCurrentSubServiceName}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#999"
              value={currentPrice}
              onChangeText={setCurrentPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              placeholderTextColor="#999"
              value={currentTime}
              onChangeText={setCurrentTime}
            />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Description"
              placeholderTextColor="#999"
              value={currentDescription}
              onChangeText={setCurrentDescription}
              multiline
            />

            <TouchableOpacity
              style={styles.imageBox}
              onPress={() => pickImage('sub')}
            >
              {currentSubServiceImage ? (
                <Image
                  source={getServiceImageSource(currentSubServiceImage)}
                  style={styles.image}
                />
              ) : (
                <>
                  <Icon
                    name="file-image"
                    size={40}
                    color="#999"
                    style={styles.dragDropIcon}
                  />
                  <Text style={styles.imageText}>
                    Drag & drop files or browse files
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Add/Update Sub Service Button */}
            <TouchableOpacity
              style={styles.subServiceButton}
              onPress={handleAddOrUpdateSubService}
            >
              <Ionicons
                name={currentSubServiceId ? 'save-outline' : 'add'}
                size={20}
                color="#fff"
              />
              <Text style={styles.subServiceButtonText}>
                {currentSubServiceId
                  ? 'Update Current Sub Service'
                  : 'Add New Sub Service'}
              </Text>
            </TouchableOpacity>

            {/* Clear Fields Button */}
            {(currentSubServiceName.trim() ||
              currentPrice.trim() ||
              currentTime.trim() ||
              currentDescription.trim() ||
              currentSubServiceImage) && (
              <TouchableOpacity
                style={[
                  styles.subServiceButton,
                  { backgroundColor: '#666', marginTop: 5 },
                ]}
                onPress={resetCurrentSubServiceFields}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.subServiceButtonText}>Clear Fields</Text>
              </TouchableOpacity>
            )}

            {/* Debug Section */}
            <View style={styles.debugSection}>
              <Text style={styles.debugText}>
                Current Sub-services: {subServices.length}
              </Text>
              {subServices.length > 0 && (
                <Text style={styles.debugText}>
                  Last added:{' '}
                  {subServices[subServices.length - 1]?.name || 'Unknown'}
                </Text>
              )}
              {subServices.length > 0 && (
                <Text style={styles.debugText}>
                  IDs:{' '}
                  {subServices
                    .map(sub => sub.id?.substring(0, 10) + '...')
                    .join(', ')}
                </Text>
              )}
            </View>

            {/* List of existing sub-services */}
            {subServices.map((sub, index) => {
              console.log('Rendering sub-service:', sub);
              return (
                <View key={sub.id || index} style={styles.subServiceItem}>
                  <View style={styles.subServiceTextContainer}>
                    <Text style={styles.subServiceItemText}>
                      {sub.name || sub.subServiceName || 'Unnamed Service'} - $
                      {sub.price || '0'} - {sub.time || 'N/A'}
                    </Text>
                    {sub.description ? (
                      <Text style={styles.subServiceDescriptionText}>
                        {sub.description}
                      </Text>
                    ) : null}
                  </View>
                  {sub.image || sub.subServiceImage ? (
                    <Image
                      source={getServiceImageSource(
                        sub.image || sub.subServiceImage,
                      )}
                      style={styles.subServicePreviewImage}
                    />
                  ) : null}
                  <View style={styles.subServiceActions}>
                    <TouchableOpacity onPress={() => handleEditSubService(sub)}>
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#A98C27"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteSubService(sub.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF6347"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  resetCurrentSubServiceFields();
                  onClose();
                }}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {initialServiceData ? 'Update Service' : 'Save Service'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddServiceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '60%', // Adjusted from 60% for better responsiveness if needed
    maxWidth: 500, // Max width for larger screens
    borderWidth: 1,
    borderColor: '#000000ff',
    borderRadius: 10,
    backgroundColor: '#1E2021',
    padding: 20,
    maxHeight: '90%',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  scroll: {
    paddingBottom: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  imageBox: {
    backgroundColor: '#2c2c2c',
    height: 150,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  dragDropIcon: {
    marginBottom: 10,
  },
  imageText: {
    color: '#999',
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  subServiceButton: {
    backgroundColor: '#A98C27',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  subServiceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  subServiceItem: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#444',
    marginTop: 10,
  },
  subServiceTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  subServiceItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subServiceDescriptionText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  subServicePreviewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 10,
    resizeMode: 'cover',
  },
  subServiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  saveButton: {
    backgroundColor: '#A98C27',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#000', // Adjusted for better contrast
    fontWeight: 'bold',
  },
  debugSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
