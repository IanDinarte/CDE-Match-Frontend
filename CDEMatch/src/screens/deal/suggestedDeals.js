import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { dealStyle } from "../../styles/dealStyle";
import { colors } from "../../styles/colors";
import api from "../../services/api";
import { SuggestedDealCard } from "../../components/suggestedDealCard";

export default function SuggestedDealsScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSuggestedDeals = () => {
    api
      .get("api/deal/suggestion")
      .then((res) => {
        setDeals(res.data || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("Erro ao carregar sugeridos:", error.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchSuggestedDeals();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSuggestedDeals();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={dealStyle.detailsHeaderContainer}>
        <Text style={dealStyle.detailTitle}>Negócios Sugeridos</Text>
      </View>

      {loading && deals.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#E6C687" />
        </View>
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SuggestedDealCard
              item={item}
              onActionComplete={fetchSuggestedDeals}
            />
          )}
          contentContainerStyle={dealStyle.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E6C687"
              colors={["#E6C687"]}
              progressBackgroundColor={colors.searchBackground || "#223142"}
            />
          }
          ListEmptyComponent={
            <Text
              style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
            >
              Nenhum negócio sugerido.
            </Text>
          }
        />
      )}
    </View>
  );
}
