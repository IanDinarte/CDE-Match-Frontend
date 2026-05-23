import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import api from "../services/api";
import { globalStyles } from "../styles/globalStyles";
import { loginStyle } from "../styles/loginStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha o email e senha.");
      return;
    }

    setLoading(true);

    api
      .post("api/auth/login", { email, password })
      .then(async (res) => {
        setLoading(false);

        const token = res.data;
        if (token) {
          await AsyncStorage.setItem("userToken", token);
          navigation.replace("MainApp");
        } else {
          Alert.alert("Erro", "Falha na autenticação: Token não recebido.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        Alert.alert("Erro", "Email ou senha incorretos.");
      });
  };

  return (
    <SafeAreaView style={loginStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={loginStyle.keyboardView}
      >
        <View style={loginStyle.content}>
          <View style={loginStyle.headerContainer}>
            <Text style={loginStyle.welcomeText}>Bem vindo ao</Text>
            <Text style={loginStyle.mainTitle}>CDE Match</Text>
          </View>

          <View style={loginStyle.formCard}>
            <TextInput
              style={loginStyle.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={loginStyle.input}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={loginStyle.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0D141C" />
              ) : (
                <Text style={loginStyle.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={loginStyle.forgotPassword}>Esqueci-me da senha</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={loginStyle.footer}>
          <Image
            source={require("../../assets/cde logo.png")}
            style={loginStyle.footerLogo}
            resizeMode="contain"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
