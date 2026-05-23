import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { globalStyles } from "../../styles/globalStyles";
import { dealListStyle } from "../../styles/dealListStyle";
import { DealCard } from "../../components/dealCard";

export default function DealListScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("api/deal/")
      .then((res) => {
        setDeals(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={globalStyles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={dealListStyle.container}>
      {/* Barra de Pesquisa */}
      <View style={dealListStyle.searchBarContainer}>
        <TextInput
          style={dealListStyle.searchBar}
          placeholder="Procurar Oferta"
        />
      </View>

      <FlatList
        data={deals}
        keyExtractor={(item) => item._id} // Usando o ID único do MongoDB
        renderItem={({ item }) => <DealCard item={item} />}
        contentContainerStyle={dealListStyle.listContent}
        ListEmptyComponent={
          <Text style={dealListStyle.emptyText}>
            Nenhum negócio disponível no momento.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
