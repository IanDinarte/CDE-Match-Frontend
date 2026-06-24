import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../styles/colors";
import { createStackNavigator } from "@react-navigation/stack";

import EditMemberScreen from "../screens/member/editMember";
import MemberProfileScreen from "../screens/member/memberProfile";
import MemberListScreen from "../screens/member/memberList";

import DealListScreen from "../screens/deal/dealList";
import DealDetailsScreen from "../screens/deal/dealDetails";
// import MatchesListScreen from "../deprecated/matchesList";
import SuggestedDealsScreen from "../screens/deal/suggestedDeals";
import CreateDealScreen from "../screens/deal/createDeal";
import EditDealScreen from "../screens/deal/editDeal";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileStack = createStackNavigator();
const DealStack = createStackNavigator();
const SuggestionStack = createStackNavigator();
const MemberStack = createStackNavigator();
// const MatchesStack = createStackNavigator();

const PlaceHolderScreen = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <Text style={{ color: "white", padding: 50 }}>Em construção...</Text>
  </SafeAreaView>
);

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      style={globalStyles.tabNavigator}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: globalStyles.tabNavigator,
        tabBarLabelVisibilityMode: "unlabeled",
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.gray,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          //definir icones
          switch (route.name) {
            case "List":
              iconName = focused ? "list" : "list-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Add":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Messages":
              iconName = focused ? "mail" : "mail-outline";
              break;
            case "Profile":
              iconName = focused ? "person-circle" : "person-circle-outline";
              break;
            default:
              iconName = focused ? "" : "list-outline";
              break;
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen name="List" component={DealStackNavigation} />
      <Tab.Screen name="Messages" component={SuggestionStackNavigation} />
      <Tab.Screen name="Add" component={CreateDealScreen} />
      <Tab.Screen name="Search" component={MemberStackNavigation} />
      <Tab.Screen name="Profile" component={ProfileStackNavigation} />
    </Tab.Navigator>
  );
}

function DealStackNavigation() {
  return (
    <DealStack.Navigator screenOptions={{ headerShown: false }}>
      <DealStack.Screen name="DealList" component={DealListScreen} />
      <DealStack.Screen name="DealDetails" component={DealDetailsScreen} />
      <DealStack.Screen name="EditDeal" component={EditDealScreen} />
      <DealStack.Screen name="MemberProfile" component={MemberProfileScreen} />
      <DealStack.Screen name="EditMember" component={EditMemberScreen} />
    </DealStack.Navigator>
  );
}

function MemberStackNavigation() {
  return (
    <MemberStack.Navigator screenOptions={{ headerShown: false }}>
      <MemberStack.Screen name="MemberList" component={MemberListScreen} />
      <MemberStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
      />
      <MemberStack.Screen name="EditMember" component={EditMemberScreen} />
      <MemberStack.Screen name="DealDetails" component={DealDetailsScreen} />
      <MemberStack.Screen name="EditDeal" component={EditDealScreen} />
    </MemberStack.Navigator>
  );
}

function ProfileStackNavigation() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
      />
      <ProfileStack.Screen name="EditMember" component={EditMemberScreen} />
      <ProfileStack.Screen name="DealDetails" component={DealDetailsScreen} />
      <ProfileStack.Screen name="EditDeal" component={EditDealScreen} />
    </ProfileStack.Navigator>
  );
}

function SuggestionStackNavigation() {
  return (
    <SuggestionStack.Navigator screenOptions={{ headerShown: false }}>
      <SuggestionStack.Screen
        name="SuggestedDeals"
        component={SuggestedDealsScreen}
      />
      <SuggestionStack.Screen
        name="DealDetails"
        component={DealDetailsScreen}
      />
      <SuggestionStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
      />
      <SuggestionStack.Screen name="EditMember" component={EditMemberScreen} />
    </SuggestionStack.Navigator>
  );
}
