import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { globalStyles } from "../../styles/globalStyles";
import { dealStyle } from "../../styles/dealStyle";
import { DealCard } from "../../components/dealCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";

export default function DealListScreen() {
  const [deals, setDeals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchDeals = () => {
    setLoading(true);

    const params = new URLSearchParams({
      title: searchText,
      type: selectedType,
      area: selectedArea,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }).toString();

    api
      .get(`api/deal?${params}`)
      .then((res) => {
        setDeals(res.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDeals(searchText);
  }, [searchText, selectedType, selectedArea, minPrice, maxPrice]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={dealStyle.container}>
        <View style={dealStyle.searchBarContainer}>
          <TextInput
            style={dealStyle.searchBar}
            placeholder="Procurar Negócio por Titulo ou Membro"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            clearButtonMode="while-editing"
          />
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
            renderItem={({ item }) => <DealCard item={item} />}
            contentContainerStyle={dealStyle.listContent}
            ListEmptyComponent={
              <Text
                style={{ color: "#8A94A6", textAlign: "center", marginTop: 10 }}
              >
                Nenhum negócio disponível no momento.
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}
