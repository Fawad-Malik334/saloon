// src/screens/admin/ClientsScreen/ClientsScreen.jsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../../../../context/UserContext';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

// AddClientModal ko rakhein, baaki View/Delete modal abhi ke liye hata dete hain
import AddClientModal from './modals/AddClientModal';
import DeleteClientModal from './modals/DeleteClientModal';

const { width, height } = Dimensions.get('window');

const userProfileImagePlaceholder = require('../../../../assets/images/foundation.jpeg');

// Hardcoded client data for now
const allClientsData = [
  {
    _id: '1',
    clientId: 'CLT001',
    name: 'John Doe',
    phoneNumber: '+1234567890',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    clientId: 'CLT002',
    name: 'Jane Smith',
    phoneNumber: '+1234567891',
    createdAt: '2024-01-16T14:20:00Z',
  },
  {
    _id: '3',
    clientId: 'CLT003',
    name: 'Mike Johnson',
    phoneNumber: '+1234567892',
    createdAt: '2024-01-17T09:15:00Z',
  },
  {
    _id: '4',
    clientId: 'CLT004',
    name: 'Sarah Wilson',
    phoneNumber: '+1234567893',
    createdAt: '2024-01-18T16:45:00Z',
  },
  {
    _id: '5',
    clientId: 'CLT005',
    name: 'David Brown',
    phoneNumber: '+1234567894',
    createdAt: '2024-01-19T11:30:00Z',
  },
];

const ClientsScreen = () => {
  const { userName, salonName } = useUser();
  const navigation = useNavigation();

  // State management
  const [searchText, setSearchText] = useState('');
  const [clientsData, setClientsData] = useState(allClientsData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFilterDate, setSelectedFilterDate] = useState(null);

  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
  const [isDeleteClientModalVisible, setIsDeleteClientModalVisible] =
    useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Load clients data (using hardcoded data)
  const loadClients = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setClientsData(allClientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Error', 'Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search clients (local search)
  const handleSearch = async text => {
    setSearchText(text);
    if (text.trim().length > 2) {
      const filtered = allClientsData.filter(
        client =>
          client.name?.toLowerCase().includes(text.toLowerCase()) ||
          client.clientId?.toLowerCase().includes(text.toLowerCase()) ||
          client.phoneNumber?.toLowerCase().includes(text.toLowerCase()),
      );
      setClientsData(filtered);
    } else if (text.trim().length === 0) {
      // Reload all clients when search is cleared
      setClientsData(allClientsData);
    }
  };

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Filter clients based on search and date
  const filteredClients = useMemo(() => {
    let currentData = [...clientsData];

    if (searchText) {
      currentData = currentData.filter(
        client =>
          client.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          client.clientId?.toLowerCase().includes(searchText.toLowerCase()) ||
          client.phoneNumber?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (selectedFilterDate) {
      const formattedSelectedDate =
        moment(selectedFilterDate).format('YYYY-MM-DD');
      currentData = currentData.filter(client => {
        const clientDate = moment(client.createdAt).format('YYYY-MM-DD');
        return clientDate === formattedSelectedDate;
      });
    }

    return currentData;
  }, [clientsData, searchText, selectedFilterDate]);

  // Function to generate the next sequential Client ID
  const generateNextClientId = () => {
    let maxIdNumber = 0;
    clientsData.forEach(client => {
      const match = client.clientId?.match(/^CLT(\d+)$/);
      if (match && match[1]) {
        const idNumber = parseInt(match[1], 10);
        if (!isNaN(idNumber) && idNumber > maxIdNumber) {
          maxIdNumber = idNumber;
        }
      }
    });

    const nextIdNumber = maxIdNumber + 1;
    const nextFormattedId = `CLT${String(nextIdNumber).padStart(3, '0')}`;
    return nextFormattedId;
  };

  const handleOpenAddClientModal = () => {
    setIsAddClientModalVisible(true);
  };

  const handleCloseAddClientModal = () => {
    setIsAddClientModalVisible(false);
  };

  const handleSaveNewClient = async clientDataFromModal => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newClient = {
        _id: Date.now().toString(),
        clientId: generateNextClientId(),
        name: clientDataFromModal.name,
        phoneNumber: clientDataFromModal.phoneNumber,
        createdAt: new Date().toISOString(),
      };

      setClientsData(prev => [...prev, newClient]);
      Alert.alert('Success', 'Client added successfully!');
      handleCloseAddClientModal();
    } catch (error) {
      console.error('Error adding client:', error);
      Alert.alert('Error', 'Failed to add client. Please try again.');
    }
  };

  // Handle view client history
  const handleViewClientHistory = client => {
    navigation.navigate('ClientHistory', { client });
  };

  const handleOpenDeleteClientModal = client => {
    setSelectedClient(client);
    setIsDeleteClientModalVisible(true);
  };

  const handleCloseDeleteClientModal = () => {
    setIsDeleteClientModalVisible(false);
    setSelectedClient(null);
  };

  const handleDeleteClientConfirm = async () => {
    if (selectedClient) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setClientsData(prev =>
          prev.filter(client => client._id !== selectedClient._id),
        );
        Alert.alert(
          'Success',
          `Client ${selectedClient.name} deleted successfully.`,
        );
      } catch (error) {
        console.error('Error deleting client:', error);
        Alert.alert('Error', 'Failed to delete client. Please try again.');
      }
    }
    handleCloseDeleteClientModal();
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (date) {
      setSelectedFilterDate(date);
    } else {
      setSelectedFilterDate(null);
    }
  };

  const handleOpenDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleClearDateFilter = () => {
    setSelectedFilterDate(null);
  };

  const renderClientItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? '#2E2E2E' : '#1F1F1F' },
      ]}
    >
      <Text style={styles.clientIdCell}>{item.clientId}</Text>
      <Text style={styles.clientNameCell}>{item.name}</Text>
      <Text style={styles.clientPhoneCell}>{item.phoneNumber}</Text>
      <Text style={styles.clientComingDateCell}>
        {moment(item.createdAt).format('MMM DD, YYYY')}
      </Text>
      <View style={styles.clientActionCell}>
        <TouchableOpacity
          onPress={() => handleViewClientHistory(item)}
          style={styles.actionButton}
        >
          <Ionicons name="eye-outline" size={width * 0.018} color="#A9A9A9" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOpenDeleteClientModal(item)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={width * 0.018} color="#ff5555" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A98C27" />
        <Text style={styles.loadingText}>Loading clients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.userName}>{userName || 'Guest'}</Text>
          </View>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search anything"
              placeholderTextColor="#A9A9A9"
              onChangeText={handleSearch}
              value={searchText}
            />
            <Ionicons
              name="search"
              size={width * 0.027}
              color="#A9A9A9"
              style={styles.searchIcon}
            />
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={width * 0.041}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons
              name="alarm"
              size={width * 0.041}
              color="#fff"
            />
          </TouchableOpacity>
          <Image
            source={userProfileImagePlaceholder}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.contentArea}>
        <Text style={styles.screenTitle}>Clients</Text>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={handleOpenDatePicker}
          >
            <Ionicons
              name="calendar-outline"
              size={width * 0.02}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.datePickerButtonText}>
              {selectedFilterDate
                ? moment(selectedFilterDate).format('MMM DD, YYYY')
                : 'Select Date'}
            </Text>
            {selectedFilterDate && (
              <TouchableOpacity
                onPress={handleClearDateFilter}
                style={{ marginLeft: 5 }}
              >
                <Ionicons
                  name="close-circle"
                  size={width * 0.018}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addClientButton}
            onPress={handleOpenAddClientModal}
          >
            <Ionicons
              name="add-circle-outline"
              size={width * 0.02}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addClientButtonText}>
              Add Direct New Client
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.clientIdHeader}>Client ID</Text>
            <Text style={styles.clientNameHeader}>Name</Text>
            <Text style={styles.clientPhoneHeader}>Phone Number</Text>
            <Text style={styles.clientComingDateHeader}>Last Visit</Text>
            <Text style={styles.clientActionHeader}>Action</Text>
          </View>

          <FlatList
            data={filteredClients}
            renderItem={renderClientItem}
            keyExtractor={item => item._id}
            style={styles.table}
            ListEmptyComponent={() => (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No clients found.</Text>
              </View>
            )}
          />
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedFilterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      <AddClientModal
        isVisible={isAddClientModalVisible}
        onClose={handleCloseAddClientModal}
        onSave={handleSaveNewClient}
      />

      <DeleteClientModal
        isVisible={isDeleteClientModalVisible}
        onClose={handleCloseDeleteClientModal}
        onDeleteConfirm={handleDeleteClientConfirm}
        clientDetails={selectedClient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: width * 0.02,
    paddingTop: height * 0.03,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
    marginBottom: height * 0.02,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: width * 0.0001,
  },
  userInfo: {
    marginRight: width * 0.16,
  },
  greeting: {
    fontSize: width * 0.019,
    color: '#A9A9A9',
  },
  userName: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2D32',
    borderRadius: 10,
    paddingHorizontal: width * 0.002,
    flex: 1,
    height: height * 0.04,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  searchIcon: {
    marginRight: width * 0.01,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.021,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.01,
  },
  notificationButton: {
    backgroundColor: '#2A2D32',
    borderRadius: 9,
    padding: width * 0.000001,
    marginRight: width * 0.015,
    height: width * 0.058,
    width: width * 0.058,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.058,
    height: width * 0.058,
    borderRadius: (width * 0.058) / 2,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: width * 0.005,
  },
  screenTitle: {
    color: '#fff',
    fontSize: width * 0.029,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: height * -0.02,
    marginBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
    paddingBottom: height * 0.03,
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A98C27',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
    marginLeft: width * 0.01,
  },
  addClientButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2D32',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  datePickerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.015,
    backgroundColor: '#2B2B2B',
    paddingHorizontal: width * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3C',
  },
  clientIdHeader: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
    textAlign: 'left',
  },
  clientNameHeader: {
    flex: 1.5,
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
    textAlign: 'left',
  },
  clientPhoneHeader: {
    flex: 1.5,
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
    textAlign: 'left',
  },
  clientComingDateHeader: {
    flex: 1.2,
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
    textAlign: 'left',
  },
  clientActionHeader: {
    flex: 0.8,
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.014,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.01,
    alignItems: 'center',
  },
  clientIdCell: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.013,
    textAlign: 'left',
  },
  clientNameCell: {
    flex: 1.5,
    color: '#fff',
    fontSize: width * 0.013,
    textAlign: 'left',
  },
  clientPhoneCell: {
    flex: 1.5,
    color: '#fff',
    fontSize: width * 0.013,
    textAlign: 'left',
  },
  clientComingDateCell: {
    flex: 1.2,
    color: '#fff',
    fontSize: width * 0.013,
    textAlign: 'left',
  },
  clientActionCell: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    padding: width * 0.005,
  },
  table: {
    flex: 1,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: '#A9A9A9',
    fontSize: width * 0.02,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  loadingText: {
    color: '#A9A9A9',
    fontSize: width * 0.02,
    marginTop: 10,
  },
});

export default ClientsScreen;
