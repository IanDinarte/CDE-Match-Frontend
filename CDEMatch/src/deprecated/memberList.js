// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import api from "../../services/api";
// import { globalStyles } from "../../styles/globalStyles";

// export default function MemberListScreen() {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get("api/member/")
//       .then((res) => {
//         setMembers(res.data);
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

//   return (
//     <View style={globalStyles.screenContainer}>
//       <Text style={globalStyles.mainTitle}>Membros</Text>
//       <FlatList
//         data={members}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => <Text>{item.name}</Text>}
//       />
//     </View>
//   );
// }
