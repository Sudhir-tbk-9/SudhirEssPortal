import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from '../BottomNav/BottomNav'; 
import CustomDrawerContent from './DrawerContnet'; 
import { View } from 'react-native';
import BottomTabNavLeave from '../BottomNav/BottomNavForLeave';
import BottomNavForProfile from '../BottomNav/BottomNavForProfile';
import Profile from '../../Screen/Profile/Profile';
import LeaveApplicationScreen from '../../Screen/MyLeave/LeaveApplicationScreen';
import MyLeaveScreen from '../../Screen/MyLeave/MyLeaveScreen';
import Timesheet from '../../Screen/Timesheet/Timesheet';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <View style={{ flex: 1 }}> 
      <Drawer.Navigator 
        initialRouteName='Attendance'

        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen  name="Attendance" component={BottomTabNavigator} /> 
        <Drawer.Screen  name="MyLeaveScreen" component={BottomTabNavLeave} /> 
        <Drawer.Screen  name="Profile" component={Profile} /> 
        {/* <Drawer.Screen  name="Profile" component={BottomNavForProfile} />  */}
        <Drawer.Screen name="Timesheet" component={Timesheet} />
      </Drawer.Navigator>
    </View>
  );
}

export default DrawerNavigator;
