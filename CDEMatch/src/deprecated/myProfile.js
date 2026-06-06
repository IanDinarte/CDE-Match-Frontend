// import React, { useState, useEffect } from "react";
// import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
// import api from "../../services/api";
// import { globalStyles } from "../../styles/globalStyles";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProfileTemplate from "../../components/profileTemplate";
// import { useNavigation } from "@react-navigation/native";

// export default function MyProfileScreen() {
//   const [member, setMember] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigation = useNavigation();

//   useEffect(() => {
//     api
//       .get(`api/member/me`)
//       .then((res) => {
//         setMember(res.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <View style={globalStyles.center}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!member) {
//     return (
//       <View style={globalStyles.center}>
//         <Text>Membro não encontrado.</Text>
//       </View>
//     );
//   }

//   return (
//     <ProfileTemplate
//       member={member}
//       isOwnProfile={true}
//       onEditPress={() => navigation.navigate("EditMember", { member: member })}
//     />
//   );
// }
