import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Progress from "react-native-progress";
 
export default function MyLeaveScreen() {
  const totalLeaves = 24;
  const usedLeaves = 14;
  const leaveBalance = totalLeaves - usedLeaves;
  const progressLB = leaveBalance / totalLeaves;
 
  const casualLeavesAllowed = totalLeaves/3;
  const sickLeavesAllowed = totalLeaves/3;
  const wfhAllowed = totalLeaves/3;
 
  const casualLeaves = 6;
  const sickLeaves = 3;
  const wfh = 5;
 
  const wfhBalance = wfhAllowed - wfh;
  const progressWfh = wfhBalance / wfhAllowed;
 
  const casualBalance = casualLeavesAllowed - casualLeaves;
  const progressCasual = casualBalance / casualLeavesAllowed;
 
  const sickBalance = sickLeavesAllowed - sickLeaves;
  const progressSick = sickBalance / sickLeavesAllowed;
 
  const [activeTab, setActiveTab] = useState("Approvals");
  const tabs = ["Approvals", "Leave History", "Approved", "Declined"]; // Hardcoded tabs
 
  const onTabPress = (tab) => {
    setActiveTab(tab);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      {/* Leave Totals Card */}
      <View style={styles.cardDiv}>
      <View style={styles.balanceCard}>
        <Progress.Circle
          size={125}
          progress={progressLB}
          showsText
          formatText={() => `${leaveBalance}`}
          textStyle={styles.progressText}
          color="#A020F0"
          unfilledColor="lavender"
          thickness={10}
        />
        <Text style={styles.balanceText}>Leave Balance</Text>
      </View>
      <View style={styles.marginTop}>
        <View style={styles.card}>
        
        </View>
      </View>
 
      {/* Leave Types Card */}
      <View style={styles.cardLeaveType}>
        {/* <Text style={styles.sectionTitle}>Leave Balance under each head</Text> */}
        <View style={styles.cardForLeaveType}>
          <View style={styles.leaveType}>
            <Progress.Circle
              size={60}
              progress={progressWfh}
              showsText
              formatText={() => `${wfhBalance}`}
              textStyle={styles.progressTextEH}
              color="green"
              unfilledColor="#90EE90"
              thickness={6}
              
            />
            <Text style={styles.leaveTypeText}>WFH</Text>
          </View>
          <View style={styles.leaveType}>
            <Progress.Circle
              size={60}
              progress={progressCasual}
              showsText
              formatText={() => `${casualBalance}`}
              textStyle={styles.progressTextEH}
              color="orange"
              unfilledColor="#FFDAB9"
              thickness={6}
            />
            <Text style={styles.leaveTypeText}>Casual / Sick</Text>
          </View>
          <View style={styles.leaveType}>
            <Progress.Circle
              size={60}
              progress={progressSick}
              showsText
              formatText={() => `${sickBalance}`}
              textStyle={styles.progressTextEH}
              color="maroon"
              unfilledColor="#D2B48C"
              thickness={6}
            />
            <Text style={styles.leaveTypeText}>Optional</Text>
          </View>
        </View>

        <View style={styles.cardForLeaveType2}>
          <View style={styles.leaveType}>
            <Progress.Circle
              size={60}
              progress={progressWfh}
              showsText
              formatText={() => `${wfhBalance}`}
              textStyle={styles.progressTextEH}
              color="#D81B60"
              unfilledColor="#FCE4EC"
              thickness={6}
            />
            <Text style={styles.leaveTypeText}>Paid</Text>
          </View>
         
          <View style={styles.leaveType}>
            <Progress.Circle
              size={60}
              progress={progressSick}
              showsText
              formatText={() => `${sickBalance}`}
              textStyle={styles.progressTextEH}
              color="#4FC3F7"
              unfilledColor="#E0F7FA"
              thickness={6}
            />
            <Text style={styles.leaveTypeText}>Unpaid</Text>
          </View>
        </View>
      </View>
      </View>
     
      {/* Tabs Section */}
      <View >
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsSection}
          renderItem={({ item }) => {
            const selected = activeTab === item;
            return (
              <TouchableOpacity
                onPress={() => onTabPress(item)}
                style={[styles.tabButton, selected && conditionalStyles.activeTab]}
              >
                <Text
                  style={
                    selected
                      ? conditionalStyles.activeTabText
                      : conditionalStyles.tabText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        {/* Conditionally Rendered Content */}
        <View style={conditionalStyles.contentSection}>
          {activeTab === "Approvals" && <Text>Approvals Content</Text>}
          {activeTab === "Leave History" && <Text>Leave History Content</Text>}
          {activeTab === "Approved" && <Text>Approved Content</Text>}
          {activeTab === "Declined" && <Text>Declined Content</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  cardDiv:{
    borderRadius: 8,
    justifyContent: "space-around",
  },
  balanceCard: {
    padding: 16,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    alignItems: "center",
    flexDirection: "column",
  },
  marginTop: {
    // marginTop: -20,
  },
  card: {
    padding: 10,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardForLeaveType: {
    // padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  cardForLeaveType2:{
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  cardLeaveType: {
    padding: 10,
    marginTop: -25,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  balanceText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  progressText: {
    fontSize: 44,
    fontWeight: "bold",
  },
  progressTextEH: {
    fontSize: 26,
    fontWeight: "bold",
  },
  totalItem: {
    alignItems: "center",
    marginBottom: 25,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Ensure circle
    backgroundColor: "#e6e6fa", // Lavender
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  totalText: {
    marginTop: 10,
    fontSize: 16,
  },
  leaveCount: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  leaveType: {
    alignItems: "center",
    padding: 8,
  },
  leaveTypeText: {
    fontSize: 14,
    paddingTop: 5,
    color: "#555",
  },
  tabsSection: {
    paddingBottom: 10,
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    // backgroundColor: "#f0f0f0",
    padding:2
  },
  progressCircle:{
        borderRadius:50,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        shadowColor: 'black',
        shadowRadius: 8,
        elevation: 4,
      },
});
 
const conditionalStyles = StyleSheet.create({
  activeTab: {
    borderBottomColor: "#007AFF", // Active tab underline color
    borderBottomWidth: 2, // Optional underline thickness
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF", // Active tab text color
  },
  contentSection: {
    padding: 16,
  },
});
 