import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const formStyle = StyleSheet.create({
  //edit profile
  formHeader: {
    // flexDirection:"column",
    alignItems: "center",
    // height: 135,
    marginTop: 30,
    gap: 25,
    position: "relative"
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    // gap: 15,
  },
  formTitle: {
    color: colors.textSecondary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
    flex: 1,
    flexWrap: "wrap",
    paddingHorizontal: 30
  },
  formContainer: {
    backgroundColor: colors.cardBackground,
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    // position: "absolute",
    marginBottom: -75, 
    // marginTop: 1,
    zIndex: 10,
    elevation: 10,
  },

  //actions
  importantArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  dangerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
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
    alignSelf: "flex-start",
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
  iconButton: {
    color: colors.actionButton,
    alignSelf: "flex-start",
    alignItems: "center",
    marginRight: 20,
  },
  iconDanger: {
    color: colors.danger,
    alignSelf: "auto",
    alignItems: "center",
    // marginLeft: 20,
  },
  backButtonContainer:{
    position: "absolute",
    left: 10,
    top: 0,
    zIndex: 20,
  },
  backButton: {
    color: colors.actionButton,
    alignSelf: "flex-start",
    alignItems: "center",
  },

  //inputs
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
  profilePictureInput: {
    width: 150,
    height: 150,
    borderRadius: 100,
    outlineColor: colors.cardBackground,
    outlineWidth: 10,
    backgroundColor: colors.avatarBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 60,
    fontWeight: "bold",
    color: colors.cardBackground,
  },
});
