import { React } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../styles/colors";

//import das telas que vao ser incluidas no toolbar
import DealListScreen from "../screens/deal/dealList";
import MemberProfileScreen from "../screens/member/memberProfile";
import MyProfileScreen from "../screens/member/myProfile";

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
      <Tab.Screen name="List" component={DealListScreen} />
      <Tab.Screen name="Add" component={PlaceHolderScreen} />
      <Tab.Screen name="Messages" component={PlaceHolderScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}
