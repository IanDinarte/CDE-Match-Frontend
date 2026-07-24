import React, { useContext, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginStyle } from "../styles/loginStyle";
import { colors } from "../styles/colors";
import api from "../services/api";

export default function ForgotPassScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleForgotPass = () => {
    if (!email) {
      if (Platform.OS === "web") {
        window.alert("Error: " + "Preencha o email.");
      } else {
        Alert.alert("Erro", "Preencha o email.");
      }
      return;
    }

    const data = { email: email };

    api
      .post("api/auth/resetPassword", data)
      .then((res) => {
        if (res.data.success) {
          navigation.navigate("ResetPassword", { email: email });
        } else {
          const errorMsg = "Ocorreu um problema, tente novamente.";
          if (Platform.OS === "web") {
            window.alert("Error: " + errorMsg);
          } else {
            Alert.alert("Error", errorMsg);
          }
          console.log(errorMsg);
        }
      })
      .catch((error) => {
        const errorMsg = error.response?.data || "Ocorreu um erro";
        if (Platform.OS === "web") {
          window.alert("Error: " + errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
        console.log(error + " " + errorMsg);
      });
  };

  return (
    <SafeAreaView style={loginStyle.container}>
      <View style={loginStyle.content}>
        <View style={loginStyle.formCard}>
          <View style={loginStyle.headerContainer}>
            <Text style={loginStyle.welcomeText}>Esqueci-me da senha</Text>
            <Text style={loginStyle.fpLabel}>
              Insira seu email para refazer sua senha:
            </Text>
          </View>

          <TextInput
            style={loginStyle.input}
            placeholder="Email"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={loginStyle.loginButton}
            onPress={handleForgotPass}
          >
            <Text style={loginStyle.loginButtonText}>Refazer Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyle.forgotPassword}
            onPress={navigation.goBack}
          >
            <Text style={loginStyle.forgotPassword}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
