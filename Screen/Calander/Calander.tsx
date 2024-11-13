import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper';
import { calendarservice } from '../../Services/Calendar/Calendar.service';

type Item = {
  name: string;
  height: number;
  punchInTime?: string;
  punchOutTime?: string;
  totalTime?: string;
};

const currentYear = new Date().getFullYear();
const minDate = `${currentYear}-01-01`;
const todayDate = new Date();
const maxDate = todayDate.toISOString().split('T')[0];

const Schedule: React.FC = () => {
  const [items, setItems] = useState<{ [key: string]: Item[] }>({});
  const [selectedDate, setSelectedDate] = useState<string>(maxDate);

  useEffect(() => {
    Icon.loadFont();
  }, []);

  const calculateTotalTime = useCallback((punchIn: string, punchOut: string) => {
    const [inHours, inMinutes] = punchIn.split(':').map(Number);
    const [outHours, outMinutes] = punchOut.split(':').map(Number);
    if (isNaN(inHours) || isNaN(inMinutes) || isNaN(outHours) || isNaN(outMinutes)) return '0.00';
    const totalHours = outHours - inHours;
    const totalMinutes = outMinutes - inMinutes;
    return (totalHours + totalMinutes / 60).toFixed(2);
  }, []);

  const loadItems = useCallback((day: any) => {
    setTimeout(() => {
      const newItems: { [key: string]: Item[] } = {};
      for (let i = -15; i <= 0; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime] && strTime >= minDate && strTime <= maxDate) {
          const isPresent = Math.random() > 0.5;
          newItems[strTime] = [{
            name: 'Date - ' + strTime,
            height: 0,
            punchInTime: isPresent ? '09:00 AM' : '',
            punchOutTime: isPresent ? '05:00 PM' : '',
            totalTime: isPresent ? calculateTotalTime('09:00 AM', '05:00 PM') : '',
          }];
        }
      }
      setItems((prevItems) => ({ ...prevItems, ...newItems }));
    }, 1000);
  }, [calculateTotalTime, items]);

  const renderItem = useCallback((item: Item) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Text style={item.punchInTime ? styles.presentText : styles.absentText}>
            {item.punchInTime ? item.name : 'Absent'}
          </Text>
          {item.punchInTime && (
            <View style={styles.row}>
              <View style={styles.iconWithText}>
                <Icon name="clock-in" size={24} color="rgb(0, 41, 87)" />
                <Text style={styles.timeText}>{item.punchInTime}</Text>
              </View>
              <View style={styles.iconWithText}>
                <Icon name="clock-out" size={24} color="rgb(0, 41, 87)" />
                <Text style={styles.timeText}>{item.punchOutTime}</Text>
              </View>
              <View style={styles.iconWithText}>
                <Icon name="clock" size={24} color="rgb(0, 41, 87)" />
                <Text style={styles.timeText}>{item.totalTime} hours</Text>
              </View>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  ), []);

  const handleDayPress = async (day: { dateString: string }) => {
    const formattedDate = formatDate(day.dateString);
    setSelectedDate(formattedDate);
    // try {
    //   const data = await calendarservice.CalendarGet(formattedDate, formatDate(todayDate.toISOString()));
    //   console.log('Retrieved Data:', data);
    // } catch (error) {
    //   console.error('Error fetching calendar data:', error instanceof Error ? error.message : error);
    // }
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={maxDate}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        minDate={minDate}
        maxDate={maxDate}
        
        theme={{
          agendaDayTextColor: 'rgb(0, 41, 87)',
          agendaDayNumColor: 'rgb(0, 41, 87)',
          agendaTodayColor: 'green',
          agendaKnobColor: 'rgb(0, 41, 87)',
          backgroundColor: '#f8f8f8',
          calendarBackground: 'white',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: 'rgb(0, 41, 87)',
          selectedDayTextColor: 'white',
          todayTextColor: 'white',
          dayTextColor: 'rgb(0, 41, 87)',
          textDisabledColor: '#d9e1e8',
          selectedDotColor: '#ffffff',
          arrowColor: 'rgb(0, 41, 87)',
          monthTextColor: 'rgb(0, 41, 87)',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
      />
    </View>
  );
};

const timeToString = (time: number) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${month}/${day}/${year}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom:68
  },
  card: {
    marginRight: 15,
    marginTop: 15,
    marginBottom: 25,
    backgroundColor: '#ffffff',
    
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  iconWithText: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 15,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 5,
  },
  presentText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  absentText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Schedule;



// import React, { useState, useCallback, useEffect } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { Agenda } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Card } from 'react-native-paper';
// import { calendarservice } from '../../Services/Calendar/Calendar.service';

// type Item = {
//   name: string;
//   height: number;
//   punchInTime?: string;
//   punchOutTime?: string;
//   totalTime?: string;
// };

// const currentYear = new Date().getFullYear();
// const minDate = `${currentYear}-01-01`;
// const todayDate = new Date();
// const maxDate = todayDate.toISOString().split('T')[0];

// const Schedule: React.FC = () => {
//   const [items, setItems] = useState<{ [key: string]: Item[] }>({});
//   const [selectedDate, setSelectedDate] = useState<string>(maxDate);

//   useEffect(() => {
//     Icon.loadFont();
//   }, []);

//   const calculateTotalTime = useCallback((punchIn: string, punchOut: string) => {
//     const [inHours, inMinutes] = punchIn.split(':').map(Number);
//     const [outHours, outMinutes] = punchOut.split(':').map(Number);
//     if (isNaN(inHours) || isNaN(inMinutes) || isNaN(outHours) || isNaN(outMinutes)) return '0.00';
//     const totalHours = outHours - inHours;
//     const totalMinutes = outMinutes - inMinutes;
//     return (totalHours + totalMinutes / 60).toFixed(2);
//   }, []);

//   const loadItems = useCallback((day: any) => {
//     setTimeout(() => {
//       const newItems: { [key: string]: Item[] } = {};
//       for (let i = -15; i <= 0; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = timeToString(time);
//         if (!items[strTime] && strTime >= minDate && strTime <= maxDate) {
//           const isPresent = Math.random() > 0.5;
//           newItems[strTime] = [{
//             name: 'Date - ' + strTime,
//             height: 0,
//             punchInTime: isPresent ? '09:00 AM' : '',
//             punchOutTime: isPresent ? '05:00 PM' : '',
//             totalTime: isPresent ? calculateTotalTime('09:00 AM', '05:00 PM') : '',
//           }];
//         }
//       }
//       setItems((prevItems) => ({ ...prevItems, ...newItems }));
//     }, 1000);
//   }, [calculateTotalTime, items]);

//   const renderItem = useCallback((item: Item) => (
//     <Card style={styles.card}>
//       <Card.Content>
//         <View style={styles.cardContent}>
//           <Text style={item.punchInTime ? styles.presentText : styles.absentText}>
//             {item.punchInTime ? item.name : 'Absent'}
//           </Text>
//           {item.punchInTime && (
//             <View style={styles.row}>
//               <View style={styles.iconWithText}>
//                 <Icon name="clock-in" size={24} color="rgb(0, 41, 87)" />
//                 <Text style={styles.timeText}>{item.punchInTime}</Text>
//               </View>
//               <View style={styles.iconWithText}>
//                 <Icon name="clock-out" size={24} color="rgb(0, 41, 87)" />
//                 <Text style={styles.timeText}>{item.punchOutTime}</Text>
//               </View>
//               <View style={styles.iconWithText}>
//                 <Icon name="clock" size={24} color="rgb(0, 41, 87)" />
//                 <Text style={styles.timeText}>{item.totalTime} hours</Text>
//               </View>
//             </View>
//           )}
//         </View>
//       </Card.Content>
//     </Card>
//   ), []);

//   const handleDayPress = async (day: { dateString: string }) => {
//     const formattedDate = formatDate(day.dateString);
//     setSelectedDate(formattedDate);
//     try {
//       const data = await calendarservice.CalendarGet(formattedDate, formatDate(todayDate.toISOString()));
//       console.log('Retrieved Data:', data);
//     } catch (error) {
//       console.error('Error fetching calendar data:', error instanceof Error ? error.message : error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Agenda
//         items={items}
//         loadItemsForMonth={loadItems}
//         selected={maxDate}
//         renderItem={renderItem}
//         onDayPress={handleDayPress}
//         minDate={minDate}
//         maxDate={maxDate}
        
//         theme={{
//           agendaDayTextColor: 'rgb(0, 41, 87)',
//           agendaDayNumColor: 'rgb(0, 41, 87)',
//           agendaTodayColor: 'green',
//           agendaKnobColor: 'rgb(0, 41, 87)',
//           backgroundColor: '#f8f8f8',
//           calendarBackground: 'white',
//           textSectionTitleColor: '#b6c1cd',
//           selectedDayBackgroundColor: 'rgb(0, 41, 87)',
//           selectedDayTextColor: 'white',
//           todayTextColor: 'white',
//           dayTextColor: 'rgb(0, 41, 87)',
//           textDisabledColor: '#d9e1e8',
//           selectedDotColor: '#ffffff',
//           arrowColor: 'rgb(0, 41, 87)',
//           monthTextColor: 'rgb(0, 41, 87)',
//           textDayFontWeight: '500',
//           textMonthFontWeight: 'bold',
//           textDayHeaderFontWeight: 'bold',
//         }}
//       />
//     </View>
//   );
// };

// const timeToString = (time: number) => {
//   const date = new Date(time);
//   return date.toISOString().split('T')[0];
// };

// const formatDate = (dateString: string) => {
//   const [year, month, day] = dateString.split('-');
//   return `${month}/${day}/${year}`;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   card: {
//     marginRight: 15,
//     marginTop: 15,
//     marginBottom: 15,
//     backgroundColor: '#ffffff',
    
//   },
//   cardContent: {
//     flexDirection: 'column',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   iconWithText: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   timeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000000',
//     marginTop: 5,
//   },
//   presentText: {
//     color: 'black',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   absentText: {
//     color: 'red',
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default Schedule;

