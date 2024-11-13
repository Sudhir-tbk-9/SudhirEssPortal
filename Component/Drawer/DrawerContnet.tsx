import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";

export const CustomDrawerContent = (props: any) => {
  const [submenuVisible, setSubmenuVisible] = useState({
    attendance: false,
    myLeave: false,
  });

  const toggleSubmenu = (menu: string) => {
    setSubmenuVisible((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsGAgOHc7MixFJidTH-Ng1Z_y-iq_w82rGIt93WsTFMRTsmwZtuCgTgAh1KE5uDMzOjPk&usqp=CAU",
          }}
          style={styles.logo}
        />
      </View>

      <TouchableOpacity
        style={styles.submenuButton}
        onPress={() => toggleSubmenu("attendance")}
      >
        <MaterialIcons name="access-time" size={24} color="#555" style={styles.iconStyle} />
        <Text style={styles.submenuButtonText}>Attendance</Text>
        <MaterialIcons
          name={submenuVisible.attendance ? "expand-less" : "expand-more"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {submenuVisible.attendance && (
        <View style={styles.submenuContainer}>
          <TouchableOpacity
            style={styles.submenuItem}
            onPress={() => props.navigation.navigate("Punch")}
          >
            <MaterialIcons name="fingerprint" size={20} color="#333" style={styles.subsectionIcon} />
            <Text style={styles.submenuItemText}>Punch IN/OUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submenuItem}
            onPress={() => props.navigation.navigate("Calander")}
          >
            <MaterialIcons name="calendar-today" size={20} color="#333" style={styles.subsectionIcon} />
            <Text style={styles.submenuItemText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.submenuButton}
        onPress={() => props.navigation.navigate("MyLeaveScreen")}
      >
        <MaterialIcons name="assignment" size={24} color="#555" style={styles.iconStyle} />
        <Text style={styles.submenuButtonText}>My Leaves</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submenuButton}
        onPress={() => props.navigation.navigate("Profile")}
      >
        <MaterialIcons name="person" size={24} color="#555" style={styles.iconStyle} />
        <Text style={styles.submenuButtonText}>User Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submenuButton}
        onPress={() => props.navigation.navigate("Timesheet")}
      >
        <MaterialIcons name="keyboard" size={24} color="#555" style={styles.iconStyle} />
        <Text style={styles.submenuButtonText}>Timesheet</Text>
      </TouchableOpacity>


    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: "#f8f9fa",
  },
  logoContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  submenuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#d0d0d0",
  },
  submenuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  submenuContainer: {
    paddingLeft: 40,
    paddingVertical: 10,
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  submenuItemText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  iconStyle: {
    marginRight: 10,
  },
  subsectionIcon: {
    marginRight: 5,
  },
});

export default CustomDrawerContent;
