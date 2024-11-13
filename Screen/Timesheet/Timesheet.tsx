import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Timesheet() {
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedProject, setAssignedProject] = useState('No Project');
  const [projectInput, setProjectInput] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isBillable, setIsBillable] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrEditTask = () => {
    // Validation for mandatory fields
    if (!taskTitle || !hours || !description) {
      Alert.alert('Error', 'Please fill out all mandatory fields: Task Title, Hours, and Description.');
      return;
    }

    const newTask = {
      taskTitle,
      assignedProject: projectInput || assignedProject,
      hours,
      minutes,
      isBillable,
      description,
      date: date.toDateString(),
    };

    if (isEditing) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = newTask;
      setTasks(updatedTasks);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    clearForm();
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTaskTitle(taskToEdit.taskTitle);
    setAssignedProject(taskToEdit.assignedProject);
    setHours(taskToEdit.hours);
    setMinutes(taskToEdit.minutes);
    setIsBillable(taskToEdit.isBillable);
    setDescription(taskToEdit.description);
    setDate(new Date(taskToEdit.date)); // Keep the date of the task being edited
    setIsEditing(true);
    setEditIndex(index);
  };

  const clearForm = () => {
    setTaskTitle('');
    setAssignedProject('No Project');
    setProjectInput('');
    setHours(0);
    setMinutes(0);
    setIsBillable(false);
    setDescription('');
    // Do not reset date to current date
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && selectedDate <= new Date()) {
      setDate(selectedDate); // Allow user to select the date
    }
  };

  // Handle project input changes
  const handleProjectInputChange = (input) => {
    setProjectInput(input);
    if (input === '') {
      setAssignedProject('No Project'); // Set to 'No Project' if input is empty
    }
  };

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => task.date === date.toDateString());

  return (
    <ScrollView style={{ padding: 20 }} contentContainerStyle={{ flexGrow: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Fill Your Timesheet</Text>

      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
        <Text>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}  // Disable future dates
          onChange={onChangeDate}
        />
      )}

      {/* Task Title Input (Mandatory) */}
      <TextInput
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
        style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
      />

      {/* Project Input and Picker */}
      <TextInput
        placeholder="Enter project name"
        value={projectInput}
        onChangeText={handleProjectInputChange}
        style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
      />
      <Picker
        selectedValue={assignedProject}
        onValueChange={(value) => {
          setAssignedProject(value);
          if (value === 'No Project') {
            setProjectInput(''); // Clear input if "No Project" selected
          }
        }}
        style={{ borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
      >
        <Picker.Item label="No Project" value="No Project" />
        {/* Add more items dynamically */}
      </Picker>

      {/* Hours and Minutes Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text>Hours (Mandatory)</Text>
          <Picker selectedValue={hours} onValueChange={(value) => setHours(value)} style={{ borderWidth: 1, borderRadius: 5 }}>
            {[...Array(24).keys()].map((hour) => (
              <Picker.Item key={hour} label={`${hour}`} value={hour} />
            ))}
          </Picker>
        </View>

        <View style={{ flex: 1 }}>
          <Text>Minutes</Text>
          <Picker selectedValue={minutes} onValueChange={(value) => setMinutes(value)} style={{ borderWidth: 1, borderRadius: 5 }}>
            {[...Array(60).keys()].map((minute) => (
              <Picker.Item key={minute} label={`${minute}`} value={minute} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Billable Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text>Billable</Text>
        <Switch value={isBillable} onValueChange={setIsBillable} style={{ marginLeft: 10 }} />
      </View>

      {/* Description Input (Mandatory) */}
      <TextInput
        placeholder="Description (Mandatory)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10, height: 100 }}
      />

      {/* Add/Edit Task Button */}
      <Button color="rgb(0, 41, 87)" title={isEditing ? "Edit Task" : "Add Task"} onPress={handleAddOrEditTask} />

      {/* Render Tasks for Selected Date */}
      <View style={{ marginTop: 20 }}>
        {tasksForSelectedDate.length === 0 ? (
          <Text>No tasks for this date</Text>
        ) : (
          tasksForSelectedDate.map((task, index) => (
            <View key={index} style={{ marginTop: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>Task: {task.taskTitle}</Text>
              <Text>Project: {task.assignedProject}</Text>
              <Text>Date: {task.date}</Text>
              <Text>Time: {task.hours} hrs {task.minutes} mins</Text>
              <Text>Billable: {task.isBillable ? 'Yes' : 'No'}</Text>
              <Text>Description: {task.description}</Text>
              <Button color="rgb(0, 41, 87)" title="Edit" onPress={() => handleEditTask(index)} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// import { Picker } from '@react-native-picker/picker';
// import React, { useState } from 'react';
// import { View, Text, TextInput, Switch, Button, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function Timesheet() {
//   const [taskTitle, setTaskTitle] = useState('');
//   const [assignedProject, setAssignedProject] = useState('No Project');
//   const [projectInput, setProjectInput] = useState('');
//   const [hours, setHours] = useState(0);
//   const [minutes, setMinutes] = useState(0);
//   const [isBillable, setIsBillable] = useState(false);
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);

//   const handleAddOrEditTask = () => {
//     // Validation for mandatory fields
//     if (!taskTitle || !hours || !description) {
//       Alert.alert('Error', 'Please fill out all mandatory fields: Task Title, Hours, and Description.');
//       return;
//     }

//     const newTask = {
//       taskTitle,
//       assignedProject: projectInput || assignedProject,
//       hours,
//       minutes,
//       isBillable,
//       description,
//       date: date.toDateString(),
//     };

//     if (isEditing) {
//       const updatedTasks = [...tasks];
//       updatedTasks[editIndex] = newTask;
//       setTasks(updatedTasks);
//       setIsEditing(false);
//       setEditIndex(null);
//     } else {
//       setTasks([...tasks, newTask]);
//     }

//     clearForm();
//   };

//   const handleEditTask = (index) => {
//     const taskToEdit = tasks[index];
//     setTaskTitle(taskToEdit.taskTitle);
//     setAssignedProject(taskToEdit.assignedProject);
//     setHours(taskToEdit.hours);
//     setMinutes(taskToEdit.minutes);
//     setIsBillable(taskToEdit.isBillable);
//     setDescription(taskToEdit.description);
//     setDate(new Date(taskToEdit.date)); // Keep the date of the task being edited
//     setIsEditing(true);
//     setEditIndex(index);
//   };

//   const clearForm = () => {
//     setTaskTitle('');
//     setAssignedProject('No Project');
//     setProjectInput('');
//     setHours(0);
//     setMinutes(0);
//     setIsBillable(false);
//     setDescription('');
//     // Do not reset date to current date
//   };

//   const onChangeDate = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate && selectedDate <= new Date()) {
//       setDate(selectedDate); // Allow user to select the date
//     }
//   };

//   // Handle project input changes
//   const handleProjectInputChange = (input) => {
//     setProjectInput(input);
//     if (input === '') {
//       setAssignedProject('No Project'); // Set to 'No Project' if input is empty
//     }
//   };

//   // Filter tasks for the selected date
//   const tasksForSelectedDate = tasks.filter(task => task.date === date.toDateString());

//   return (
//     <ScrollView style={{ padding: 20 }} contentContainerStyle={{ flexGrow: 1 }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Fill Your Timesheet</Text>

//       {/* Date Picker */}
//       <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
//         <Text>Select Date: {date.toDateString()}</Text>
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           maximumDate={new Date()}  // Disable future dates
//           onChange={onChangeDate}
//         />
//       )}

//       {/* Task Title Input (Mandatory) */}
//       <TextInput
//         placeholder="Task Title"
//         value={taskTitle}
//         onChangeText={setTaskTitle}
//         style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
//       />

//       {/* Project Input and Picker */}
//       <TextInput
//         placeholder="Enter project name"
//         value={projectInput}
//         onChangeText={handleProjectInputChange}
//         style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10 }}
//       />
//       <Picker
//         selectedValue={assignedProject}
//         onValueChange={(value) => {
//           setAssignedProject(value);
//           if (value === 'No Project') {
//             setProjectInput(''); // Clear input if "No Project" selected
//           }
//         }}
//         style={{ borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
//       >
//         <Picker.Item label="No Project" value="No Project" />
//         {/* Add more items dynamically */}
//       </Picker>

//       {/* Hours and Minutes Row */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
//         <View style={{ flex: 1, marginRight: 10 }}>
//           <Text>Hours (Mandatory)</Text>
//           <Picker selectedValue={hours} onValueChange={(value) => setHours(value)} style={{ borderWidth: 1, borderRadius: 5 }}>
//             {[...Array(24).keys()].map((hour) => (
//               <Picker.Item key={hour} label={`${hour}`} value={hour} />
//             ))}
//           </Picker>
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text>Minutes</Text>
//           <Picker selectedValue={minutes} onValueChange={(value) => setMinutes(value)} style={{ borderWidth: 1, borderRadius: 5 }}>
//             {[...Array(60).keys()].map((minute) => (
//               <Picker.Item key={minute} label={`${minute}`} value={minute} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       {/* Billable Switch */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
//         <Text>Billable</Text>
//         <Switch value={isBillable} onValueChange={setIsBillable} style={{ marginLeft: 10 }} />
//       </View>

//       {/* Description Input (Mandatory) */}
//       <TextInput
//         placeholder="Description (Mandatory)"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//         style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginVertical: 10, height: 100 }}
//       />

//       {/* Add/Edit Task Button */}
//       <Button color="rgb(0, 41, 87)" title={isEditing ? "Edit Task" : "Add Task"} onPress={handleAddOrEditTask} />

//       {/* Render Tasks for Selected Date */}
//       <View style={{ marginTop: 20 }}>
//         {tasksForSelectedDate.length === 0 ? (
//           <Text>No tasks for this date</Text>
//         ) : (
//           tasksForSelectedDate.map((task, index) => (
//             <View key={index} style={{ marginTop: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}>
//               <Text style={{ fontWeight: 'bold' }}>Task: {task.taskTitle}</Text>
//               <Text>Project: {task.assignedProject}</Text>
//               <Text>Date: {task.date}</Text>
//               <Text>Time: {task.hours} hrs {task.minutes} mins</Text>
//               <Text>Billable: {task.isBillable ? 'Yes' : 'No'}</Text>
//               <Text>Description: {task.description}</Text>
//               <Button color="rgb(0, 41, 87)" title="Edit" onPress={() => handleEditTask(index)} />
//             </View>
//           ))
//         )}
//       </View>
//     </ScrollView>
//   );
// }

