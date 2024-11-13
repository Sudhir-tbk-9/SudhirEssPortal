import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CalendarPicker from 'react-native-calendar-picker';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { ScrollView } from 'react-native';


const LeaveApplicationScreen: React.FC = () => {
  const [leaveType, setLeaveType] = useState<string>('Casual');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('Full Day');
  const [reason, setReason] = useState<string>('');
  const [approverName, setApproverName] = useState<string>('');
  const [applicationDate] = useState<string>(new Date().toDateString());
  const [totalDays, setTotalDays] = useState<number>(1);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const resetForm = () => {
    setLeaveType('Casual');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setShowDropdown(false);
    setReason('');
    setApproverName('');
    setTotalDays(1);
    setSelectedOption('Full Day');
  };

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [])
  );

  const handleApplyLeave = () => {
    if (!reason) {
      Alert.alert('Error', 'Reason is required!');
      return;
    }
    Alert.alert(
      'Leave Application Submitted',
      `Type: ${leaveType}\nDates: ${selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : 'N/A'}${selectedEndDate ? ` to ${format(selectedEndDate, 'yyyy-MM-dd')}` : ''}\nTotal Days: ${totalDays}\nReason: ${reason}\nApplication Date: ${applicationDate}\nApprover: ${approverName}`
    );
  };

  const onDateChange = (date: Date) => {
    // Check if only the start date is set or if the user is selecting a new date
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // If no start date is set or both dates are already set, reset both and start fresh
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // If the start date is set but end date is not, set the end date
      setSelectedEndDate(date);
    }
    // Recalculate total days whenever a date is changed
    calculateTotalDays();
  };


  const calculateTotalDays = () => {
    if (selectedStartDate && !selectedEndDate) {
      // Single date selected, only show dropdown if leave type is 'Casual'
      if (leaveType === 'Casual') {
        setShowDropdown(true);
        const days = (selectedOption === '1st Half' || selectedOption === '2nd Half') ? 0.5 : 1;
        setTotalDays(days);
      } else {
        setShowDropdown(false);
        setTotalDays(1); // Default to full day if not 'Casual'
      }
    } else if (selectedStartDate && selectedEndDate) {
      // Range of dates selected
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
  
      if (start.getTime() === end.getTime() && leaveType === 'Casual') {
        setShowDropdown(true);
        const days = (selectedOption === '1st Half' || selectedOption === '2nd Half') ? 0.5 : 1;
        setTotalDays(days);
      } else {
        setShowDropdown(false);
        const difference = end.getTime() - start.getTime();
        const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
        setTotalDays(days < 0 ? 0 : days);
      }
    } else {
      // No dates selected, default to zero
      setTotalDays(0);
      setShowDropdown(false);
    }
  };

  
  React.useEffect(() => {
    calculateTotalDays();
  }, [selectedStartDate, selectedEndDate, leaveType, selectedOption]);

  const handleConfirmDates = () => {
    setIsCalendarModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Apply for Leave</Text>
      <View style={styles.flexRow}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Application Date</Text>
          <Text style={styles.dateText}>{applicationDate}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Approver Name</Text>
          <TextInput style={styles.textInput} value={approverName} editable={false} />
        </View>
      </View>

      <Text style={styles.leaveTypeContainer}>Leave Type</Text>
      <View style={styles.radioButtonContainer}>
        {['Casual', 'Sick', 'Optional', 'Work from Home'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.radioButton,
              leaveType === type && styles.radioButtonSelected
            ]}
            onPress={() => {
              setLeaveType(type);
              setShowDropdown(type === 'Casual');
            }}
          >
            <Text style={styles.radioButtonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={() => setIsCalendarModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedStartDate ? `Selected Date: ${format(selectedStartDate, 'dd-MM-yyyy')}${selectedEndDate ? ` to ${format(selectedEndDate, 'dd-MM-yyyy')}` : ''}` : 'Select Dates'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isCalendarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCalendarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <CalendarPicker
              todayBackgroundColor={'gray'}
              minDate={new Date()}
              selectedDayTextStyle={{ color: 'white' }}
              selectedDayStyle={{ backgroundColor: 'black' }}
              onDateChange={onDateChange}
              allowRangeSelection={true}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
            />
            <TouchableOpacity onPress={handleConfirmDates} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDropdown && (
        <>
          <Text style={styles.label}>Leave Day Part</Text>
          <Picker
            selectedValue={selectedOption}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setSelectedOption(itemValue);
              setTotalDays(itemValue === 'Full Day' ? 1 : 0.5);
            }}
          >
            <Picker.Item label="Full Day" value="Full Day" />
            <Picker.Item label="1st Half" value="1st Half" />
            <Picker.Item label="2nd Half" value="2nd Half" />
          </Picker>
        </>
      )}

      <Text style={styles.label}>Reason for Leave *</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Provide a reason (mandatory)"
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity onPress={handleApplyLeave} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Leave Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom:68
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  leaveTypeContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00796b',
  },
  radioButtonText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: 'rgb(0, 41, 87)',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 25,
    marginBottom:25
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 0.48,
  },
  button: {
    backgroundColor: 'rgb(0, 41, 87)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '96%',
  },
  closeButton: {
    backgroundColor: 'rgb(0, 41, 87)',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LeaveApplicationScreen;

// import React, { useState, useCallback } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Modal } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import CalendarPicker from 'react-native-calendar-picker';
// import { useFocusEffect } from '@react-navigation/native';
// import { format } from 'date-fns';
// import { ScrollView } from 'react-native';


// const LeaveApplicationScreen: React.FC = () => {
//   const [leaveType, setLeaveType] = useState<string>('Casual');
//   const [showDropdown, setShowDropdown] = useState<boolean>(false);
//   const [selectedOption, setSelectedOption] = useState<string>('Full Day');
//   const [reason, setReason] = useState<string>('');
//   const [approverName, setApproverName] = useState<string>('');
//   const [applicationDate] = useState<string>(new Date().toDateString());
//   const [totalDays, setTotalDays] = useState<number>(1);
//   const [isCalendarModalVisible, setIsCalendarModalVisible] = useState<boolean>(false);
//   const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
//   const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

//   const resetForm = () => {
//     setLeaveType('Casual');
//     setSelectedStartDate(null);
//     setSelectedEndDate(null);
//     setShowDropdown(false);
//     setReason('');
//     setApproverName('');
//     setTotalDays(1);
//     setSelectedOption('Full Day');
//   };

//   useFocusEffect(
//     useCallback(() => {
//       resetForm();
//     }, [])
//   );

//   const handleApplyLeave = () => {
//     if (!reason) {
//       Alert.alert('Error', 'Reason is required!');
//       return;
//     }
//     Alert.alert(
//       'Leave Application Submitted',
//       `Type: ${leaveType}\nDates: ${selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : 'N/A'}${selectedEndDate ? ` to ${format(selectedEndDate, 'yyyy-MM-dd')}` : ''}\nTotal Days: ${totalDays}\nReason: ${reason}\nApplication Date: ${applicationDate}\nApprover: ${approverName}`
//     );
//   };

//   const onDateChange = (date: Date) => {
//     // Check if only the start date is set or if the user is selecting a new date
//     if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
//       // If no start date is set or both dates are already set, reset both and start fresh
//       setSelectedStartDate(date);
//       setSelectedEndDate(null);
//     } else {
//       // If the start date is set but end date is not, set the end date
//       setSelectedEndDate(date);
//     }
//     // Recalculate total days whenever a date is changed
//     calculateTotalDays();
//   };


//   const calculateTotalDays = () => {
//     if (selectedStartDate && !selectedEndDate) {
//       // Single date selected, only show dropdown if leave type is 'Casual'
//       if (leaveType === 'Casual') {
//         setShowDropdown(true);
//         const days = (selectedOption === '1st Half' || selectedOption === '2nd Half') ? 0.5 : 1;
//         setTotalDays(days);
//       } else {
//         setShowDropdown(false);
//         setTotalDays(1); // Default to full day if not 'Casual'
//       }
//     } else if (selectedStartDate && selectedEndDate) {
//       // Range of dates selected
//       const start = new Date(selectedStartDate);
//       const end = new Date(selectedEndDate);
  
//       if (start.getTime() === end.getTime() && leaveType === 'Casual') {
//         setShowDropdown(true);
//         const days = (selectedOption === '1st Half' || selectedOption === '2nd Half') ? 0.5 : 1;
//         setTotalDays(days);
//       } else {
//         setShowDropdown(false);
//         const difference = end.getTime() - start.getTime();
//         const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
//         setTotalDays(days < 0 ? 0 : days);
//       }
//     } else {
//       // No dates selected, default to zero
//       setTotalDays(0);
//       setShowDropdown(false);
//     }
//   };

  
//   React.useEffect(() => {
//     calculateTotalDays();
//   }, [selectedStartDate, selectedEndDate, leaveType, selectedOption]);

//   const handleConfirmDates = () => {
//     setIsCalendarModalVisible(false);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Apply for Leave</Text>
//       <View style={styles.flexRow}>
//         <View style={styles.rowItem}>
//           <Text style={styles.label}>Application Date</Text>
//           <Text style={styles.dateText}>{applicationDate}</Text>
//         </View>
//         <View style={styles.rowItem}>
//           <Text style={styles.label}>Approver Name</Text>
//           <TextInput style={styles.textInput} value={approverName} editable={false} />
//         </View>
//       </View>

//       <Text style={styles.leaveTypeContainer}>Leave Type</Text>
//       <View style={styles.radioButtonContainer}>
//         {['Casual', 'Sick', 'Optional', 'Work from Home'].map((type) => (
//           <TouchableOpacity
//             key={type}
//             style={[
//               styles.radioButton,
//               leaveType === type && styles.radioButtonSelected
//             ]}
//             onPress={() => {
//               setLeaveType(type);
//               setShowDropdown(type === 'Casual');
//             }}
//           >
//             <Text style={styles.radioButtonText}>{type}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity onPress={() => setIsCalendarModalVisible(true)} style={styles.button}>
//         <Text style={styles.buttonText}>
//           {selectedStartDate ? `Selected Date: ${format(selectedStartDate, 'dd-MM-yyyy')}${selectedEndDate ? ` to ${format(selectedEndDate, 'dd-MM-yyyy')}` : ''}` : 'Select Dates'}
//         </Text>
//       </TouchableOpacity>

//       <Modal
//         visible={isCalendarModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setIsCalendarModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.calendarContainer}>
//             <CalendarPicker
//               todayBackgroundColor={'gray'}
//               minDate={new Date()}
//               selectedDayTextStyle={{ color: 'white' }}
//               selectedDayStyle={{ backgroundColor: 'black' }}
//               onDateChange={onDateChange}
//               allowRangeSelection={true}
//               selectedStartDate={selectedStartDate}
//               selectedEndDate={selectedEndDate}
//             />
//             <TouchableOpacity onPress={handleConfirmDates} style={styles.closeButton}>
//               <Text style={styles.closeButtonText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {showDropdown && (
//         <>
//           <Text style={styles.label}>Leave Day Part</Text>
//           <Picker
//             selectedValue={selectedOption}
//             style={styles.picker}
//             onValueChange={(itemValue) => {
//               setSelectedOption(itemValue);
//               setTotalDays(itemValue === 'Full Day' ? 1 : 0.5);
//             }}
//           >
//             <Picker.Item label="Full Day" value="Full Day" />
//             <Picker.Item label="1st Half" value="1st Half" />
//             <Picker.Item label="2nd Half" value="2nd Half" />
//           </Picker>
//         </>
//       )}

//       <Text style={styles.label}>Reason for Leave *</Text>
//       <TextInput
//         style={styles.textInput}
//         placeholder="Provide a reason (mandatory)"
//         value={reason}
//         onChangeText={setReason}
//       />

//       <TouchableOpacity onPress={handleApplyLeave} style={styles.submitButton}>
//         <Text style={styles.submitButtonText}>Submit Leave Application</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     marginBottom:68
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 15,
//     marginBottom: 10,
//   },
//   leaveTypeContainer: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   radioButtonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   radioButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '48%',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   radioButtonSelected: {
//     backgroundColor: '#e0f7fa',
//     borderColor: '#00796b',
//   },
//   radioButtonText: {
//     fontSize: 16,
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   textInput: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },
//   submitButton: {
//     backgroundColor: 'rgb(0, 41, 87)',
//     paddingVertical: 15,
//     borderRadius: 8,
//     marginTop: 25,
//     marginBottom:25
//   },
//   submitButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   flexRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   rowItem: {
//     flex: 0.48,
//   },
//   button: {
//     backgroundColor: 'rgb(0, 41, 87)',
//     padding: 12,
//     borderRadius: 8,
//     marginVertical: 15,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
    
//   },
//   calendarContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 8,
//     width: '96%',
//   },
//   closeButton: {
//     backgroundColor: 'rgb(0, 41, 87)',
//     paddingVertical: 10,
//     marginTop: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default LeaveApplicationScreen;

