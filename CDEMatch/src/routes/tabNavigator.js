import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../styles/colors";
import { createStackNavigator } from "@react-navigation/stack";

//import das telas que vao ser incluidas no toolbar
import DealListScreen from "../screens/deal/dealList";
import MemberProfileScreen from "../screens/member/memberProfile";
import MyProfileScreen from "../screens/member/myProfile";
import DealDetailsScreen from "../screens/deal/dealDetails";
import SuggestedDealsScreen from "../screens/deal/suggestedDeals";
import CreateDealScreen from "../screens/deal/createDeal";
import EditDealScreen from "../screens/deal/editDeal";

const DealStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SuggestionStack = createStackNavigator();
// const CreateDealStack = createStackNavigator();

const PlaceHolderScreen = () => (
  <View style={{ flex: 1, backgroundColor: "#0D1117" }}>
    <Text style={{ color: "white", padding: 50 }}>Em construção...</Text>
  </View>
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
      <Tab.Screen name="Add" component={CreateDealScreen} />
      <Tab.Screen name="Messages" component={SuggestionStackNavigation} />
      <Tab.Screen name="Profile" component={ProfileStackNavigation} />
    </Tab.Navigator>
  );
}

function DealStackNavigation() {
  return (
    <DealStack.Navigator screenOptions={{ headerShown: false }}>
      <DealStack.Screen name="DealList" component={DealListScreen} />
      <DealStack.Screen name="DealDetails" component={DealDetailsScreen} />
      <DealStack.Screen name="MemberProfile" component={MemberProfileScreen} />
      <DealStack.Screen name="EditDeal" component={EditDealScreen} />
    </DealStack.Navigator>
  );
}

function ProfileStackNavigation() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="MyProfile" component={MyProfileScreen} />
      <ProfileStack.Screen name="DealDetails" component={DealDetailsScreen} />
      <ProfileStack.Screen name="EditDeal" component={EditDealScreen} />
      <ProfileStack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
      />
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
      <SuggestionStack.Screen name="EditDeal" component={EditDealScreen} />
    </SuggestionStack.Navigator>
  );
}

// function CreateDealStackNavigation() {
//   return (
//     <CreateDealStack.Navigator screenOptions={{ headerShown: false }}>
//       <CreateDealStack.Screen name="CreateDeal" component={CreateDealScreen} />
//       <CreateDealStack.Screen
//         name="DealDetails"
//         component={DealDetailsScreen}
//       />
//     </CreateDealStack.Navigator>
//   );
// }
