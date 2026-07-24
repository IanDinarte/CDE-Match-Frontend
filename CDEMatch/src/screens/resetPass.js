import React, { useContext, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginStyle } from "../styles/loginStyle";
import { colors } from "../styles/colors";
import api from "../services/api";

export default function ResetPasswordScreen({ route }) {
  const email = route.params ? route.params.email : null;
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigation = useNavigation();

  const handleResetPass = () => {
    if (!code) {
      if (Platform.OS === "web") {
        window.alert("Erro:" + "Preencha o código enviado ao email.");
      } else {
        Alert.alert("Erro", "Preencha o código enviado ao email.");
      }
      return;
    }

    if (newPassword != confirmNewPassword) {
      if (Platform.OS === "web") {
        window.alert("Erro:" + "As duas senhas devem ser iguais.");
      } else {
        Alert.alert("Erro", "As duas senhas devem ser iguais.");
      }
      return;
    }

    const data = { email: email, code: code, password: newPassword };

    api
      .patch("api/auth/resetPassword", data)
      .then((res) => {
        if (Platform.OS === "web") {
          window.alert("Sucesso: " + "Senha atualizada com sucesso.");
        } else {
          Alert.alert("Sucesso", res.data || "Senha atualizada com sucesso.");
        }
        navigation.navigate("Login");
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
            <Text style={loginStyle.welcomeText}>Criar nova senha:</Text>
          </View>

          <TextInput
            style={loginStyle.input}
            placeholder="Code"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="characters"
            value={code}
            onChangeText={setCode}
          />

          <TextInput
            style={loginStyle.input}
            placeholder="New Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            autoCapitalize="none"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={loginStyle.input}
            placeholder="Confirm New Password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
            autoCapitalize="none"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />

          <TouchableOpacity
            style={loginStyle.loginButton}
            onPress={handleResetPass}
          >
            <Text style={loginStyle.loginButtonText}>Refazer Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyle.forgotPassword}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={loginStyle.forgotPassword}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
