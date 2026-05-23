import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  tabNavigator: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 0,
    elevation: 0,
    height: 95,
    paddingBottom: 10,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.textPrimary,
  },
});
