import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native";
import { dealStyle } from "../../styles/dealStyle";
import { DealCard } from "../../components/dealCard";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { modalStyle } from "../../styles/modalStyle";

export default function DealListScreen() {
  const [deals, setDeals] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);

  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [matchFilter, setMatchFilter] = useState("Todos"); //"Todos", "Matched", "Unmatched"

  const insets = useSafeAreaInsets();

  const fetchDeals = () => {
    setLoading(true);

    const params = new URLSearchParams({
      title: searchText,
      type: selectedType,
      area: selectedArea,
      minPrice: minPrice,
      maxPrice: maxPrice,
      matchFilter: matchFilter,
    }).toString();

    api
      .get(`api/deal?${params}`)
      .then((res) => {
        setDeals(res.data || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
        console.log(error.message + " " + error.response.data);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchDeals();
  }, [searchText, selectedType, selectedArea, minPrice, maxPrice, matchFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeals();
  }, [searchText, selectedType, selectedArea, minPrice, maxPrice, matchFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={dealStyle.container}>
        <View style={dealStyle.searchBarContainer}>
          <TextInput
            style={dealStyle.searchBar}
            placeholder="Procurar Negócio ou Membro"
            placeholderTextColor={colors.placeholder}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            clearButtonMode="while-editing"
          />
          <TouchableOpacity
            style={dealStyle.filterButton}
            onPress={() => setFiltersActive(!filtersActive)}
          >
            <Ionicons name={"funnel-outline"} size={30} color={"#EEE"} />
          </TouchableOpacity>
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
            renderItem={({ item }) => <DealCard deal={item} />}
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
                Nenhum negócio disponível no momento.
              </Text>
            }
          />
        )}
        <Modal
          isVisible={filtersActive}
          onBackdropPress={() => setFiltersActive(false)}
          onBackButtonPress={() => setFiltersActive(false)}
          backdropOpacity={0.6}
          backdropTransitionOutTiming={10}
          style={{ margin: 0, justifyContent: "flex-end" }}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          useNativeDriver={true}
        >
          <View
            style={[
              modalStyle.filterModalCard,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <View style={modalStyle.modalHeader}>
              <Text style={modalStyle.modalTitle}>Filtrar Negócios</Text>
              <TouchableOpacity onPress={() => setFiltersActive(false)}>
                <Ionicons name="close" size={24} color="#EEE" />
              </TouchableOpacity>
            </View>

            <Text style={modalStyle.filterLabel}>Limite de Preço</Text>
            <View style={modalStyle.chipContainer}>
              <Text style={modalStyle.filterText}>de</Text>
              <TextInput
                style={modalStyle.priceBox}
                placeholder="€"
                placeholderTextColor={colors.placeholder}
                value={minPrice}
                onChangeText={(value) => setMinPrice(value)}
                clearButtonMode="while-editing"
                inputMode="decimal"
              />
              <Text style={modalStyle.filterText}>até</Text>
              <TextInput
                style={modalStyle.priceBox}
                placeholder="€"
                placeholderTextColor={colors.placeholder}
                value={maxPrice}
                onChangeText={(value) => setMaxPrice(value)}
                clearButtonMode="while-editing"
                inputMode="decimal"
              />
            </View>

            <Text style={modalStyle.filterLabel}>Tipo de Negócio</Text>
            <View style={modalStyle.chipContainer}>
              {["Todos", "Oferta", "Procura"].map((type) => {
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      modalStyle.chip,
                      isSelected && modalStyle.chipSelected,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        modalStyle.chipText,
                        isSelected && modalStyle.chipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={modalStyle.filterLabel}>Área de Atuação</Text>
            <View style={modalStyle.chipContainer}>
              {[
                "Todas",
                "Investimento",
                "Venda de Ativo",
                "Parceria Estratégica",
                "Compra de Negócio",
                "Financiamento",
                "Ajuda Rápida",
                "Procura de Perfis Chave",
                "Oportunidades",
                "Imobiliário",
              ].map((area) => {
                const isSelected = selectedArea === area;
                return (
                  <TouchableOpacity
                    key={area}
                    style={[
                      modalStyle.chip,
                      isSelected && modalStyle.chipSelected,
                    ]}
                    onPress={() => setSelectedArea(area)}
                  >
                    <Text
                      style={[
                        modalStyle.chipText,
                        isSelected && modalStyle.chipTextSelected,
                      ]}
                    >
                      {area}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={modalStyle.filterLabel}>Interesse</Text>
            <View style={modalStyle.chipContainer}>
              {[
                { label: "Todos", value: 0 },
                { label: "Interessados", value: 1 },
                { label: "Por Ver", value: 2 },
              ].map((option) => {
                const isSelected = matchFilter === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      modalStyle.chip,
                      isSelected && modalStyle.chipSelected,
                    ]}
                    onPress={() => setMatchFilter(option.value)}
                  >
                    <Text
                      style={[
                        modalStyle.chipText,
                        isSelected && modalStyle.chipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={modalStyle.applyButton}
              onPress={() => setFiltersActive(!filtersActive)}
            >
              <Text style={modalStyle.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
