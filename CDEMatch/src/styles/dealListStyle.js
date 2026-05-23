import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const dealListStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    backgroundColor: colors.searchBackground,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.textMain,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Sombra para Android/iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.avatarBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.background,
  },
  userName: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  userTitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  optionsIcon: {
    color: colors.iconSecondary,
    fontSize: 24,
  },
  offerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  offerDescription: {
    color: colors.textTertiary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.actionButton,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
