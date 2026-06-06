import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// importar screens da app
import LoginScreen from "./src/screens/loginScreen.js";
import TabNavigator from "./src/routes/tabNavigator.js";

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
    </SafeAreaProvider>
  );
}
