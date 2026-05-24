import { StyleSheet, Platform } from "react-native";
import { colors } from "./colors";

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 100,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    color: colors.textSecondary,
    fontSize: 20,
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", // Tenta imitar a fonte serifada
  },
  mainTitle: {
    color: colors.textSecondary,
    fontSize: 65,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.inputText,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: colors.actionButton,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 30, // Faz o botão um pouco mais estreito que os inputs, como na imagem
  },
  loginButtonText: {
    color: colors.cardBackground, // Texto escuro para contrastar com o ouro
    fontSize: 18,
    fontWeight: "medium",
  },
  forgotPassword: {
    color: colors.textSecondary,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 15,
  },
  footerLogo: {
    width: 150, // Define a largura da imagem
    height: 150, // Define a altura da imagem
  },
});
