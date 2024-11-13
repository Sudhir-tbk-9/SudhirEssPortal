
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { punchService } from '../../Services/Punch/Punch.service';

const { width, height } = Dimensions.get('window');

const scaleFont = (size :any) => {
  const scale = width / 375; 
  return Math.round(size * scale);
};

const scaleSize = (size :any) => {
  const scale = width / 375; 
  return Math.round(size * scale);
};

interface ClockButtonProps {
  time: string;
  date: string;
  type: 'in' | 'out';
  onPress: () => void;
  isLoading: boolean;
}

const ClockButton: React.FC<ClockButtonProps> = ({ time, date, type, onPress, isLoading }) => (
  <View >
    <LinearGradient
      colors={type === 'in' ? ['#3481ed', '#c087e6'] : ['#98309c', '#d93473']}
      style={styles.gradientButton}
    >
      <TouchableOpacity onPress={onPress} style={styles.button} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
            <MaterialIcons name='touch-app' size={scaleSize(50)} color="white"  />
            <Text style={styles.buttonText}>{type === 'in' ? 'CLOCK IN' : 'CLOCK OUT'}</Text>
          </>
        )}
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const PunchScreen: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState('');
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [totalTime, setTotalTime] = useState<string | null>(null);
  const [clockInDate, setClockInDate] = useState<Date | null>(null);
  const [isClockInLoading, setIsClockInLoading] = useState(false);
  const [isClockOutLoading, setIsClockOutLoading] = useState(false);

 


  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) + ' - ' + now.toLocaleString('en-US', { weekday: 'long' })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showLocationAlert();
      return false;
    }
    return true;
  };

  const showLocationAlert = () => {
    Alert.alert(
      'Location Disabled',
      'Please enable location services to proceed.',
      [
        {
          text: 'No Thanks',
          onPress: () => console.log('User chose not to enable location'),
          style: 'cancel',
        },
        {
          text: 'Turn On',
          onPress: async () => {
            await Location.requestForegroundPermissionsAsync();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  const handleClockIn = async () => {
    setIsClockInLoading(true);
    const location = await getLocation();
    
    if (location) {
      const now = new Date();
      setClockOutTime(null);
      setTotalTime(null);
      setClockInDate(now);
      
      try {
        const response = await punchService.PunchInApi(location);
        
        if (response.message === 'Already Puched In!') {
          Alert.alert('Info', response.message);
        } else {
          setClockInTime(now.toLocaleTimeString());
          Alert.alert('Success', response.message);
        }
      } catch (error) {
        console.error('Punch In Error:', error);
        Alert.alert('Error', 'An error occurred while clocking in.');
      }
    }
    
    setIsClockInLoading(false);
  };
  

  const handleClockOut = async () => {
   
    setIsClockOutLoading(true);
    const location = await getLocation();
    if (location) {
      const now = new Date();
      setClockOutTime(now.toLocaleTimeString());
      if (clockInDate) {
        const timeDiff = Math.abs(now.getTime() - clockInDate.getTime());
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        setTotalTime(`${hours}h ${minutes}m`);
      }
      try {
       const response= await punchService.PunchOutApi(location); 
        Alert.alert('Success', response.message);
      } catch (error) {
        // console.error('Punch Out Error:', error);
        Alert.alert('Error', 'An error occurred while clocking out.');
      }
    }
    setIsClockOutLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.liveTime}>{currentTime}</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
          <ClockButton
            time={clockInTime || "09:10 AM"}
            date="March 19, 2024 - Friday"
            type="in"
            onPress={handleClockIn}
            isLoading={isClockInLoading}
          />
        </View>

        <View style={styles.card}>
          <ClockButton
            time={clockOutTime || "03:15 PM"}
            date="March 19, 2024 - Friday"
            type="out"
            onPress={handleClockOut}
            isLoading={isClockOutLoading}
          />
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Feather name="clock" size={scaleSize(20)} color="rgb(0, 41, 87)" />
              <Text style={{ marginTop: 5 }}>{clockInTime || 'Punch In'}</Text>
              <Text style={styles.footerText}>Clock In</Text>
            </View>
            <View style={styles.footerItem}>
              <Feather name="clock" size={scaleSize(20)} color="rgb(0, 41, 87)" />
              <Text style={{ marginTop: 5 }}>{clockOutTime || 'Punch Out'}</Text>
              <Text style={styles.footerText}>Clock Out</Text>
            </View>
            <View style={styles.footerItem}>
              <Feather name="bar-chart-2" size={scaleSize(20)} color="rgb(0, 41, 87)" />
              <Text style={{ marginTop: 5 }}>{totalTime || '0h 0m'}</Text>
              <Text style={styles.footerText}>Totals</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgb(0, 41, 87)',
    backgroundColor:'lightgrey' ,
    // backgroundColor: '#133E87',
    padding: scaleSize(13),
    alignItems: 'center',
    paddingBottom: scaleSize(65) ,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    
  },
  card: {
    backgroundColor: '#FFFFFF',
    // backgroundColor: '#CBDCEB',
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    padding: scaleSize(15),
    width: '100%',
    marginBottom: scaleSize(10),
    flexGrow: 1,
    minHeight: scaleSize(100),
    justifyContent: 'center',
  },
  liveTime: {
    fontSize: scaleFont(36),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(0, 41, 87)',
  },
  dateText: {
    fontSize: scaleFont(16),
    textAlign: 'center',
    color: 'rgb(0, 41, 87)',
    marginBottom: scaleSize(20),
  },
  buttonText: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  gradientButton: {
    width: scaleSize(170),
    height: scaleSize(170),
    borderRadius: scaleSize(85),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleSize(30),
  },
  footerItem: {
    alignItems: 'center',
    width: '33%',
  },
  footerText: {
    fontSize: scaleFont(12),
    color: 'rgb(0, 41, 87)',
    marginTop: scaleSize(4),
    fontWeight:'bold'
  },
});

export default PunchScreen;
