import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const dealStyle = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: colors.background,
    paddingBottom: 20,
  },
  searchBarContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
  },
  searchBar: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.textMain,
    fontSize: 16,
    flex: 1,
    // alignItems: "center"
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    color: colors.textPrimary,
    fontSize: 24,
  },
  suggestedBy: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  dealTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 8,
  },
  dealInfo: {
    color: colors.textPrimary,
  },
  dealDescription: {
    color: colors.textTertiary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  dangerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  // COLOCAR NO FORM STYLE
  actionButton: {
    flexDirection: "row",
    backgroundColor: colors.actionButton,
    alignSelf: "flex-start",
    alignItems: "center",
    // flex: 0,
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 5,
  },
  dangerButton: {
    flexDirection: "row",
    backgroundColor: colors.danger,
    alignSelf: "auto",
    alignItems: "center",
    // flex: 0,
    borderRadius: 50,
    padding: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontWeight: "medium",
    fontSize: 17,
    paddingHorizontal: 5,
  },

  //details
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 20,
  },
  detailsHeaderContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 10,
    // alignItems: "center",
    // justifyContent: "center",
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    color: colors.textSecondary,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center"
  },
  detailAvatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: colors.avatarBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailAvatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.background,
  },
  detailName: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: "bold",
  },
  detailInfo: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  detailDescription: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16,
  },

  //filtros

  //createDeal COLOCAR NO FORMSTYLE
  inputItem: {
    marginBottom: 12,
  },
  inputBox: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.textMain,
    fontSize: 16,
    // flex: 1,
  },
  multilineInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: colors.textMain,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
  },
});
