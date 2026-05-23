import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import api from "../../services/api";
import { globalStyles } from "../../styles/globalStyles";
import ProfileTemplate from "../../components/profileTemplate";

export default function MemberProfileScreen({ route }) {
  const { id } = route.params;

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`api/member/${id}`)
      .then((res) => {
        setMember(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={globalStyles.center}>
        <Text>Membro não encontrado.</Text>
      </View>
    );
  }

  return (
    <ProfileTemplate member={member} isOwnProfile={false}/>
  );
}
