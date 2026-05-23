import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import api from "../../services/api";
import { globalStyles } from "../../styles/globalStyles";

export default function DealDetailsScreen({ route }) {
  const { id } = route.params;

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`api/deal/${id}`)
      .then((res) => {
        setDeal(res.data);
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

  if (!deal) {
    return (
      <View style={globalStyles.center}>
        <Text>Negócio não encontrado.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{deal.name}</Text>
      <View></View>
    </View>
  );
}
