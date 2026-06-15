import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import api from "../../services/api";
import { globalStyles } from "../../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { dealStyle } from "../../styles/dealStyle";
import { MemberCard } from "../../components/memberCard";

export default function MemberListScreen() {
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembers = () => {
    setLoading(true);

    const params = new URLSearchParams({
      name: searchText,
    });

    api
      .get(`api/member?${params}`)
      .then((res) => {
        setMembers(res.data || []);
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
    fetchMembers();
  }, [searchText]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMembers();
  }, [searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={dealStyle.container}>
        <View style={dealStyle.searchBarContainer}>
          <TextInput
            style={dealStyle.searchBar}
            placeholder="Procurar Membro"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            clearButtonMode="while-editing"
          />
        </View>

        {loading && members.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <MemberCard member={item} />}
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
                Nenhum membro foi encontrado.
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}
