import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./src/services/navigationRef.js";

// importar screens da app
import LoginScreen from "./src/screens/loginScreen.js";
import TabNavigator from "./src/routes/tabNavigator.js";
import ForgotPassScreen from "./src/screens/forgotPass.js";
import ResetPasswordScreen from "./src/screens/resetPass.js";
import { colors } from "./src/styles/colors.js";

const Stack = createStackNavigator();

const linkingConfig = {
  prefixes: ["https://vanytime.pt/cdematch/", "cdematch://"],
  config: {
    path: "cdematch",
    screens: {
      Login: "",
      ForgotPassword: "",
      ResetPassword: "",
      MainApp: {
        path: "",
        screens: {
          List: {
            // path: "deals",
            screens: {
              DealList: "",
              DealDetails: "",
              EditDeal: "",
            },
          },
          Messages: {
            // path: "messages",
            screens: {
              SuggestedDeals: "",
            },
          },
          Add: "",
          Search: {
            // path: "search",
            screens: {
              MemberList: "",
            },
          },
          Profile: {
            // path: "profile",
            screens: {
              MemberProfile: "",
              EditMember: "",
            },
          },
        },
      },
    },
  },
};

/**
 * NavigationContainer: engloba toda a estrutura de rotas da app
 * initialRouteName: tela principal que aparece quando abre a app
 * screenOptions={{ headerShown: false }} esconder a barra do topo do telemovel
 * @returns
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.cardBackground,
          alignItems: Platform.OS === "web" ? "center" : "stretch",
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: Platform.OS === "web" ? 450 : "100%",
            backgroundColor: colors.background,
            overflow: "hidden",
          }}
        >
          <NavigationContainer ref={navigationRef} linking={linkingConfig}>
            <StatusBar style="light" />

            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="MainApp" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
