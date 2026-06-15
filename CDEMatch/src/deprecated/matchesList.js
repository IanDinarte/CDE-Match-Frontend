// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
//   DeviceEventEmitter,
// } from "react-native";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import Modal from "react-native-modal";
// import api from "../../services/api";
// import { Ionicons } from "@expo/vector-icons";
// import { globalStyles } from "../../styles/globalStyles";
// import { dealStyle } from "../../styles/dealStyle";
// import { DealCard } from "../../components/dealCard";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { colors } from "../../styles/colors";
// import { modalStyle } from "../../styles/modalStyle";
// import { formStyle } from "../../styles/formStyle";

// export default function MatchesListScreen() {
//   const [deals, setDeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const navigation = useNavigation();

//   const fetchDeals = () => {
//     setLoading(true);

//     api
//       .get(`api/member/matches`)
//       .then((res) => {
//         setDeals(res.data || []);
//         setLoading(false);
//         setRefreshing(false);
//       })
//       .catch((error) => {
//         Alert.alert("Error", error.response.data);
//         console.log(error.message + " " + error.response.data);
//         setLoading(false);
//         setRefreshing(false);
//       });
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchDeals();
//     }, []),
//   );

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchDeals();
//   }, []);

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       <View style={dealStyle.detailsHeaderContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons
//             style={formStyle.backButton}
//             name="chevron-back-outline"
//             size={30}
//           />
//         </TouchableOpacity>
//         <Text style={dealStyle.detailTitle}>Seus Interesses</Text>
//       </View>

//       <View style={[dealStyle.container, { flex: 1 }]}>
//         {loading && deals.length === 0 ? (
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <ActivityIndicator size="large" color="#E6C687" />
//           </View>
//         ) : (
//           <FlatList
//             data={deals}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => <DealCard item={item} />}
//             contentContainerStyle={dealStyle.listContent}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 tintColor="#E6C687"
//                 colors={["#E6C687"]}
//                 progressBackgroundColor={colors.searchBackground || "#223142"}
//               />
//             }
//             ListEmptyComponent={
//               <Text
//                 style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
//               >
//                 Nenhum Match disponivel no momento.
//               </Text>
//             }
//           />
//         )}
//       </View>
//     </View>
//   );
// }
