import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import api from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/globalStyles";
import { dealStyle } from "../../styles/dealStyle";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export default function DealDetailsScreen({ route }) {
  const { id } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigation = useNavigation();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMyDeal = deal?.owner?._id === currentUserId;

  useEffect(() => {
    AsyncStorage.getItem("userToken").then((token) => {
      if (token) {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id);
      }
    });

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

  const ownerName = deal.owner?.name || "Membro";
  const initialLetter = ownerName.charAt(0).toUpperCase();

  return (
    <View style={dealStyle.detailsContainer}>
      <View style={dealStyle.detailsHeaderContainer}>
        <Text style={dealStyle.detailTitle}>{deal.title}</Text>
      </View>

      <ScrollView contentContainerStyle={dealStyle.listContent}>
        <View style={dealStyle.card}>
          <View style={dealStyle.cardHeader}>
            <TouchableOpacity
              style={dealStyle.headerLeft}
              onPress={() =>
                navigation.navigate("MemberProfile", { id: deal.owner?._id })
              }
            >
              {deal.owner?.profilePicture ? (
                <Image
                  source={{ uri: deal.owner?.profilePicture }}
                  style={dealStyle.avatar}
                ></Image>
              ) : (
                <View style={dealStyle.detailAvatar}>
                  <Text style={dealStyle.detailAvatarText}>
                    {initialLetter}
                  </Text>
                </View>
              )}
              <View>
                <Text style={dealStyle.detailName}>{ownerName}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={dealStyle.detailInfo}>
            {deal.type}, {deal.area}
          </Text>
          <Text style={dealStyle.detailInfo}>{deal.price} €</Text>
          <Text style={dealStyle.detailDescription}>{deal.description}</Text>

          <View style={dealStyle.cardActions}>
            <TouchableOpacity style={dealStyle.actionButton}>
              <Ionicons name="heart-outline" size={22} color="#EEEEEE" />
            </TouchableOpacity>
            <TouchableOpacity style={dealStyle.actionButton}>
              <Ionicons name="send-outline" size={22} color="#EEEEEE" />
            </TouchableOpacity>
            <TouchableOpacity style={dealStyle.actionButton}>
              <Ionicons name="star-outline" size={22} color="#EEEEEE" />
            </TouchableOpacity>
            {isMyDeal ? (
              <TouchableOpacity
                style={dealStyle.actionButton}
                onPress={() => navigation.navigate("EditDeal", { deal: deal })}
              >
                <Ionicons name="pencil" size={22} color="#EEEEEE" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
