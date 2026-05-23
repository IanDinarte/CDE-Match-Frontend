import { StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export const memberStyle = StyleSheet.create({
  memberCard: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  memberEmail: {
    color: colors.textSecondary,
    marginVertical: 4,
  },

  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  contentContainer: { 
    padding: 20, 
    paddingBottom: 40, 
  },
  headerRow: { 
    paddingTop: 30,
    paddingBottom: 15,
    paddingLeft: 20,
    flexDirection: "row", 
    alignItems: "center",  
    backgroundColor: colors.cardBackground,
  },
  avatarCircle: { 
    // marginTop: 25,
    width: 80, 
    height: 80, 
    borderRadius: 50, 
    backgroundColor: "#C4C4C4", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  avatarText: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: colors.cardBackground, 
  },
  headerInfo: { 
    // paddingTop: 25,
    marginLeft: 15, 
  },
  nameText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: colors.textSecondary || "#E6C687", 
  },
  locationText: { 
    fontSize: 16, 
    color: colors.textSecondary || "#8A94A6", 
    marginTop: 4, 
  },
  descContainer: { 
    margin: 15, 
  },
  descText: { 
    fontSize: 17, 
    color: colors.textPrimary, 
    lineHeight: 22, 
    marginBottom: 15, 
  },
  contactsTitle: { 
    fontSize: 16, 
    color: colors.gray || "#566275", 
    fontWeight: "bold", 
    marginBottom: 5, 
  },
  contactItem: { 
    fontSize: 15, 
    color: "#FFFFFF", 
    marginBottom: 4, 
  },
  actionButton: { 
    flexDirection: "row", 
    backgroundColor: colors.actionButton, 
    alignSelf: "flex-start", 
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 50, 
    alignItems: "center", 
    marginLeft: 15, 
    marginBottom: 15, 
  },
  actionButtonText: { 
    color: colors.textPrimary, 
    fontWeight: "medium", 
    fontSize: 17, 
  },
  tabBar: { 
    flexDirection: "row", 
    backgroundColor: colors.cardBackground,
    marginBottom: 15, 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: "center", 
  },
  tabButtonActive: { 
    borderBottomWidth: 3, 
    borderBottomColor: colors.primary || "#A88A44", 
  },
  tabButtonText: { 
    color: colors.textSecondary || "#566275", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
  tabActiveText: { 
    color: colors.primary || "#A88A44", 
  },
  dynamicContent: { 
    flex: 1, 
  },
  
  // empresas
  cardBusiness: { 
    flexDirection: "row", 
    backgroundColor: colors.cardBackground || "#131C26", 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12, 
    marginHorizontal: 12,
    alignItems: "center", 
  },
  logoPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: "#1A2433", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  cardInfo: { 
    marginLeft: 15, 
    flex: 1, 
  },
  cardTitle: { 
    color: colors.textPrimary, 
    fontSize: 16, 
    fontWeight: "bold", 
  },
  roleText: { 
    color: colors.textPrimary || "#8A94A6", 
    fontWeight: "normal", 
  },
  cardSub: { 
    color: colors.textPrimary || "#8A94A6", 
    fontSize: 13, 
    marginTop: 4, 
  },
  
  // deals
  cardDeal: { 
    backgroundColor: colors.cardBackground, 
    padding: 15, 
    borderRadius: 15, 
    marginHorizontal: 12,
    marginBottom: 12, 
  },
  dealHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12, 
  },
  miniAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: "#C4C4C4", 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 10, 
  },
  miniAvatarText: {
    fontSize: 14, 
    fontWeight: "bold", 
    color: colors.background, 
  },
  dealAuthor: { 
    color: colors.textSecondary, 
    fontWeight: "bold", 
    fontSize: 18, 
  },
  dealRole: { 
    color: colors.textSecondary || "#8A94A6", 
    fontSize: 11, 
  },
  dealTitle: { 
    color: colors.textPrimary, 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 6, 
  },
  dealBody: { 
    color: colors.textTertiary, 
    fontSize: 14, 
    lineHeight: 18, 
    marginBottom: 15, 
  },
  dealActions: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
  },
  btnDeal: { 
    backgroundColor: colors.actionButton, 
    paddingVertical: 6, 
    paddingHorizontal: 16, 
    borderRadius: 50, 
  },
  btnDealText: { 
    color: colors.textPrimary, 
    fontWeight: "medium", 
    fontSize: 17, 
  },
});