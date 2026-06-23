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

// importar screens da app
import LoginScreen from "./src/screens/loginScreen.js";
import TabNavigator from "./src/routes/tabNavigator.js";
import { colors } from "./src/styles/colors.js";

const Stack = createStackNavigator();

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
          <NavigationContainer>
            <StatusBar style="light" />

            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="MainApp" component={TabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
