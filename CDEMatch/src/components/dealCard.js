import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { dealStyle } from "../styles/dealStyle";
import { useNavigation } from "@react-navigation/native";

export function DealCard({ item }) {
  const navigation = useNavigation();
  const initial = item.owner ? item.owner.name.charAt(0).toUpperCase() : "U";

  return (
    <View style={dealStyle.card}>
      <View style={dealStyle.cardHeader}>
        <TouchableOpacity
          style={dealStyle.headerLeft}
          onPress={() =>
            navigation.navigate("MemberProfile", { id: item.owner?._id })
          }
        >
          {item.owner?.profilePicture ? (
            <Image
              source={{ uri: item.owner?.profilePicture }}
              style={dealStyle.avatar}
            ></Image>
          ) : (
            <View style={dealStyle.avatar}>
              <Text style={dealStyle.avatarText}>{initial}</Text>
            </View>
          )}

          <View>
            <Text style={dealStyle.userName}>
              {item.owner.name || "Utilizador"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={dealStyle.optionsIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <Text style={dealStyle.dealTitle}>{item.title}</Text>
      <Text style={dealStyle.dealInfo}>
        {item.type}, {item.area}
      </Text>
      <Text style={dealStyle.dealInfo}>{item.price} €</Text>
      <Text style={dealStyle.dealDescription}>{item.description}</Text>

      <View style={dealStyle.cardActions}>
        <TouchableOpacity style={dealStyle.actionButton}>
          <Ionicons name="heart-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>
        <TouchableOpacity
          style={dealStyle.actionButton}
          onPress={() => navigation.navigate("DealDetails", { id: item._id })}
        >
          <Ionicons name="eye-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>
        <TouchableOpacity style={dealStyle.actionButton}>
          <Ionicons name="send-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>
        <TouchableOpacity style={dealStyle.actionButton}>
          <Ionicons name="star-outline" size={22} color="#EEEEEE" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
