import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { dealStyle } from "../../styles/dealStyle";
import { colors } from "../../styles/colors";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SuggestedDealCard } from "../../components/suggestedDealCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { formStyle } from "../../styles/formStyle";
import { globalStyles } from "../../styles/globalStyles";

export default function SuggestedDealsScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchSuggestedDeals = () => {
    api
      .get("api/deal/suggestion")
      .then((res) => {
        setDeals(res.data || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        const errorMsg = error.response?.data || "Ocorreu um erro";
        if (Platform.OS === "web") {
          window.alert("Error: " + errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
        console.log(error.message + " " + errorMsg);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={dealStyle.detailsHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            style={formStyle.backButton}
            name="chevron-back-outline"
            size={30}
          />
        </TouchableOpacity>
        <Text style={dealStyle.detailTitle}>Negócios Sugeridos</Text>
      </View>

      {Platform.OS === "web" && (
        <TouchableOpacity
          style={globalStyles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="reload" size={20} color={colors.primary} />
          <Text
            style={{
              color: colors.primary,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            Atualizar Lista
          </Text>
        </TouchableOpacity>
      )}

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
    </SafeAreaView>
  );
}
